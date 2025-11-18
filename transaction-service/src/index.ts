import express, { Request, Response } from "express";
import axios from "axios";
import db from "./db-config";
import cors from "cors";
// top of src/index.ts
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
console.log(
  "DEBUG env sample: DATABASE_URL present?",
  !!process.env.DATABASE_URL
);
console.log(
  "DEBUG env sample: DB_HOST, DB_USER, DB_NAME:",
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_NAME
);
console.log(
  "DEBUG DB_PASS typeof:",
  typeof process.env.DB_PASS,
  "len=",
  (process.env.DB_PASS || "").length
);

const app = express();
const port = 3001;
app.use(cors());

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
  } catch (error: any) {
    console.error("sanctionCallback() error:", error?.message || error);
    if (error?.response) {
      console.error(
        "sanctionCallback() axios response data:",
        error.response.data
      );
      console.error(
        "sanctionCallback() axios response status:",
        error.response.status
      );
    }
    throw error;
  }
}

async function prediction(
  amt: number,
  customer_id: number,
  tx_datetime: string,
  lat: number,
  lon: number
) {
  try {
    const intAmt = Math.round(Number(amt));
    const Payload = {
      TX_AMT: intAmt,
      CUSTOMER_ID: customer_id,
      TX_DATETIME: tx_datetime,
      latitude: lat,
      longitude: lon,
    };
    console.log("prediction payload ->", JSON.stringify(Payload));
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      Payload,
      {
        timeout: 20000,
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(
      "prediction response status:",
      response.status,
      "data:",
      response.data
    );
    return response;
  } catch (error: any) {
    // NEW: verbose logging for axios errors
    console.error("prediction() error:", error?.message || error);
    if (error?.response) {
      console.error("prediction() axios response data:", error.response.data);
      console.error(
        "prediction() axios response status:",
        error.response.status
      );
    }
    throw error;
  }
}

//user first enters his name, system checks name with sanction-list
app.post("/transaction", async (req: Request, res: Response) => {
  console.log("---- Request Received on /transaction ----");
  try {
    const transactionName = req.body.Customer_name;
    const amount = req.body.TX_AMT;
    const datetime = req.body.TX_DATETIME;
    const customer_id = req.body.CUSTOMER_ID;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
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
        const predict = await prediction(
          amount,
          customer_id,
          datetime,
          latitude,
          longitude
        );

        const fraudScore = predict.data.fraud_score;
        let finalStatus;
        if (fraudScore > 0.8) {
          finalStatus = "Reject";
        } else if (fraudScore > 0.5) {
          finalStatus = "Review";
        } else {
          finalStatus = "Approve";
        }
        transactionToSave.risk_score = fraudScore;
        transactionToSave.status = finalStatus;
        console.log(
          "DEBUG db connection password typeof:",
          typeof (db as any).client.config.connection.password
        );
        const pw = String((db as any).client.config.connection.password ?? "");
        console.log(
          "DEBUG db password sample:",
          `len=${pw.length}`,
          `head=${pw.slice(0, 3)}`,
          `tail=${pw.slice(-3)}`
        );
        console.log(
          "DEBUG db connection user:",
          (db as any).client.config.connection.user
        );
        console.log(
          "DEBUG db connection host:",
          (db as any).client.config.connection.host
        );
        console.log(
          "DEBUG db connection database:",
          (db as any).client.config.connection.database
        );
        try {
          const whoami = await db.raw("select current_user as current_user");
          console.log(
            "DEBUG db current_user:",
            whoami.rows ? whoami.rows[0].current_user : whoami
          );
        } catch (e) {
          console.error("DEBUG current_user failed:", e);
        }

        await db("transactions").insert(transactionToSave);
        res.status(200).json({
          success: true,
          message: finalStatus,
          fraud_score: fraudScore,
        });
      } catch (error) {
        throw error;
      }
    }
  } catch (error) {
    // DEV: improved error logging for debugging - remove secrets before committing!
    console.error("Error in /transaction route:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      // axios-specific
      axiosData: (error as any)?.response?.data ?? null,
      axiosStatus: (error as any)?.response?.status ?? null,
    });

    // If it's an axios error coming from the Python services, include response body
    const axiosBody = (error as any)?.response?.data;
    const devDetail = axiosBody
      ? typeof axiosBody === "object"
        ? JSON.stringify(axiosBody)
        : String(axiosBody)
      : (error as Error).message;

    // Return more helpful error info in dev (do NOT expose secrets in prod)
    res.status(500).json({
      error: "unable to post",
      detail: devDetail,
    });
  }
});

app.listen(port, () => {
  console.log(`server is running at port this:${port}`);
});
