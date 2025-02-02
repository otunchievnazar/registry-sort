import express from 'express';
import pdfRoutes from './routes/pdfRoutes';

const app = express();
const port = 4002;

app.use(express.json());
app.use('/api', pdfRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});