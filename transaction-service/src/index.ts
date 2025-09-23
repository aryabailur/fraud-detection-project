import express, { Request, Response } from "express";
import axios from "axios";
import db from "./db-config";
const app = express();
const port = 3000;

app.use(express.json());

async function sanctionCallback(trans_name: string) {
  try {
    const nameData = {
      transaction_name: trans_name,
    };
    const response = await axios.post(
      "http://127.0.0.1:8000/sanction-check",
      nameData
    );

    return response;
  } catch (error) {
    throw error;
  }
}

async function prediction(amt: number, loc: string) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/predict", {
      transaction_amt: amt,
      location: loc,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

//user first enters his name, system checks name with sanction-list
app.post("/transaction", async (req: Request, res: Response) => {
  console.log("---- Request Received on /transaction ----");
  try {
    const transactionName = req.body.transaction_name;
    const amount = req.body.transaction_amt;
    const location = req.body.location;
    let transactionToSave = { ...req.body };
    const sanctionMatch = await sanctionCallback(transactionName);

    if (sanctionMatch.data.match === true) {
      transactionToSave.status = "Sanctioned";
      try {
        await db("transactions").insert(transactionToSave);
      } catch (dbErr) {
        console.error("DB insert failed:", dbErr);
        throw dbErr; // rethrow so outer catch handles it
      }

      res.status(403).json({
        success: false,
        message: "is fraud,transaction blocked due to sanction match",
      });
    } else {
      //users name not in sanction list, proceed to predict fraud score
      try {
        const predict = await prediction(amount, location);

        const fraudScore = predict.data.fraud_score;
        let finalStatus;
        if (fraudScore > 0.8) {
          finalStatus = "Reject";
        } else if (fraudScore > 0.5) {
          finalStatus = "Review";
        } else {
          finalStatus = "Approve";
        }
        transactionToSave.fraud_score = fraudScore;
        transactionToSave.status = finalStatus;
        await db("transactions").insert(transactionToSave);
        console.error(Error);
        res.status(200).json({ success: true, message: finalStatus });
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in /transaction route:", error);
    res.status(500).json({ error: "unable to post" });
  }
});

app.listen(port, () => {
  console.log(`server is running at port this:${port}`);
});
