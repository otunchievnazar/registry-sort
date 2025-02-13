import express from "express";
import pdfRoutes from "./api/routes/pdfRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 4003;

app.use(express.json());
app.use("/api", pdfRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
