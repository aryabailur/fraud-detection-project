import joblib
import numpy as np 
import pandas as pd
import os
import psycopg2
from fuzzywuzzy import fuzz
from pydantic import BaseModel
from fastapi import FastAPI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")



model=joblib.load("XGmodel.pkl")
sanction_list=pd.read_csv("data/sanction-list.csv")
users_df=pd.read_csv("data/users.csv")
sanctions=sanction_list["sanction_name"].tolist()
training_columns=["TX_AMOUNT","speed_kmh","hour_of_day","day_of_week","dist_from_home","TIME_SINCE_LAST_SEC"]


DATABASE_URL = os.environ.get("DATABASE_URL")


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers

    # 1. Convert degrees to radians
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = np.radians(lat2 - lat1)
    dlambda = np.radians(lon2 - lon1)

    # 2. Apply the Haversine formula
    a = np.sin(dphi / 2)**2 + np.cos(phi1) * np.cos(phi2) * np.sin(dlambda / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))

    # 3. Return distance in km
    return R * c


def get_db_connection():
      print(f"DEBUG - Full DATABASE_URL: {DATABASE_URL}")
      print(f"DEBUG - DATABASE_URL type: {type(DATABASE_URL)}")
      return psycopg2.connect(DATABASE_URL,sslmode='require',
        connect_timeout=10)
     

class TransactionRequest(BaseModel):
    transaction_name:str

class FraudPrediction(BaseModel):
    CUSTOMER_ID:int
    TX_DATETIME:str
    TX_AMT:int
    latitude:float
    longitude:float


app=FastAPI()
@app.post("/sanction-check")
def sanction_check(request:TransactionRequest):
        transaction_name=request.transaction_name
        for name in sanctions:
            fuzz_score=fuzz.token_set_ratio(name,transaction_name)
            if fuzz_score>85:
               return{"match":True}
            
        return{"match":False}

    
@app.post('/predict')
def prediction(request:FraudPrediction):
        customer_id=request.CUSTOMER_ID
        amt=request.TX_AMT
        date_time=request.TX_DATETIME
        date_time=pd.to_datetime(date_time)
        latitude=request.latitude
        longitude=request.longitude
        db_connection= get_db_connection()
        db_cursor=db_connection.cursor()
        db_cursor.execute('SELECT "TX_DATETIME",latitude,longitude FROM transactions WHERE "CUSTOMER_ID"=%s ORDER BY "TX_DATETIME" DESC LIMIT 1;',(customer_id,))
        row=db_cursor.fetchone()
        if row==None:
             time_since_last_sec=0
             dist_from_last=0
             speed_kmh=0

        else:
             prev_datetime=row[0]
             prev_lat=row[1]
             prev_lon=row[2]
             time_since_last_sec=date_time-prev_datetime
             time_since_last_sec=time_since_last_sec.total_seconds()
             dist_from_last=haversine_distance(latitude,longitude,prev_lat,prev_lon)
             speed_kmh=dist_from_last/((time_since_last_sec+1)/3600)

             
        db_cursor.close()
        db_connection.close()
        hour_of_day=date_time.hour
        day_of_week=date_time.dayofweek

        user_profile=users_df.loc[users_df["CUSTOMER_ID"]==customer_id]

        if user_profile.empty==True:
             distance_from_home=0

        else:
             home_lat = user_profile['home_lat'].iloc[0]
             home_lon = user_profile['home_lon'].iloc[0]
             distance_from_home=haversine_distance(latitude,longitude,home_lat,home_lon)

       

        
        train_data={
             "TX_AMOUNT":amt
             ,"speed_kmh":speed_kmh,
             "hour_of_day":hour_of_day,
             "day_of_week":day_of_week,
             "dist_from_home":distance_from_home,
             "TIME_SINCE_LAST_SEC":time_since_last_sec
        }
        print("=" * 50)
        print("FRAUD DETECTION INPUT FEATURES:")
        print(f"  TX_AMOUNT: {amt}")
        print(f"  speed_kmh: {speed_kmh}")
        print(f"  hour_of_day: {hour_of_day}")
        print(f"  day_of_week: {day_of_week}")
        print(f"  dist_from_home: {distance_from_home}")
        print(f"  TIME_SINCE_LAST_SEC: {time_since_last_sec}")
        print("=" * 50)
        train_df=pd.DataFrame([train_data])
        train_df=train_df.reindex(columns=training_columns,fill_value=0)
        fraud_score=model.predict_proba(train_df)
        return{"fraud_score":float(fraud_score[0][1])}



        


