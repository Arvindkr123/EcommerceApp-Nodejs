import express from "express";
import { APP_PORT } from "./config/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./db/index.js";
const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.use(errorHandler);

// connecting to the database
connectDB()
  .then(() => {
    app.listen(APP_PORT, () => {
      console.log(`listening on ${APP_PORT}`);
    });
  })
  .catch((err) => console.log(err.message));
