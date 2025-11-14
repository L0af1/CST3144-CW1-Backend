// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routes.js";
import logger from "./src/logger.js";
import { connectDB } from "./src/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(logger);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/", routes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
