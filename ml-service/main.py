import joblib
import numpy as np 
import pandas as pd
from fuzzywuzzy import fuzz
from pydantic import BaseModel
from fastapi import FastAPI

model=joblib.load("model.pkl")
sanction_list=pd.read_csv("data/sanction-list.csv")
sanctions=sanction_list["sanction_name"].tolist()
training_columns=['transaction_amt', 'location_chm', 'location_ghk', 'location_tn']

class TransactionRequest(BaseModel):
    transaction_name:str

class FraudPrediction(BaseModel):
    transaction_amt:float
    location:str


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
        df2=pd.DataFrame({"transaction_amt":[request.transaction_amt],
                          "location":[request.location]})
        df2_encoded=pd.get_dummies(df2,columns=["location"])
        df2_aligned=df2_encoded.reindex(columns=training_columns,fill_value=0)
        print(df2_aligned.columns.tolist())
        predict_score=model.predict_proba(df2_aligned)
        return{"fraud_score":predict_score[0][1]}
        


