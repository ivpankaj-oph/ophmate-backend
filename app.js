import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import router from "./routes/index.js";
import { swaggerUi, specs } from "./docs/swagger.js";
import errorHandler from "./middleware/errorhandler.js";

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    message: "Cannot hold that much load :(",
  },
});


app.use(limiter);
app.use(morgan("dev"));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello , Pankaj said hi :)");
});

app.use("/api", router);

export default app

