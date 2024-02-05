import express, { Express } from "express";
import fileUpload from "express-fileupload";
import fileRoutes from "./modules/file/file.routes";
import bodyParser from "body-parser";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));
app.use(bodyParser.json());

const runningPort: number = 5001;

app.use("/File", fileRoutes);

app.listen(runningPort, () =>
  console.log(`app listening on ${runningPort} port.`)
);
