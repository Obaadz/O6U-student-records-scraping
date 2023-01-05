import express from "express";
import cors from "cors";
import "dotenv/config";
import v1Routes from "./routes/v1";
const PORT = process.env.PORT || 5000;

const app = express();
const bodyParser = {
  urlencoded: express.urlencoded({ limit: "30mb", extended: true }),
  json: express.json({ limit: "30mb" }),
};

app.use(bodyParser.urlencoded);
app.use(bodyParser.json);
app.use(cors());

app.use(v1Routes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

export default app;
