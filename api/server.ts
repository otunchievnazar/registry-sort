import express from 'express';
import pdfRoutes from './routes/pdfRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4003;

app.use(express.json());
app.use('/api', pdfRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});