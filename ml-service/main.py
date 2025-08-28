import joblib
import numpy as np 
import pandas as pd
import fuzzywuzzy as fuzz
from pydantic import BaseModel
from fastapi import FastAPI

model=joblib.load("model.pkl")
pd.read_csv("C:/Users/aryab/fraud-detection-project/ml-service/data/transactions.csv")
sanction_list=pd.read_csv("C:/Users/aryab/fraud-detection-project/ml-service/data/sanction-list.csv")
sanctions=sanction_list["sanction_name"].tolist()

class sanction(BaseModel):
    transaction_name:str

class fraudPrediction(BaseModel):
    transaction_amt:float
    location:str

    app=FastAPI()
    @app.post("/sanction-check")
    def sanction_check(request:sanction):
        transaction_name=request.transaction_name
        for name in sanctions:
            fuzz_score=fuzz.ratio(name,transaction_name)
            if fuzz_score>85:
               return{"match":true}
            
        return{"match":false}
