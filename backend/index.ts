import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import router from "./src/routes/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.use(
  "/",
  function (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(500).json({
      message: "Error got" + err,
    });
  }
);

app.listen(3000, () => {
  console.log("Started server at 3000");
});
