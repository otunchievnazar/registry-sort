import express from 'express';
import pdfRoutes from './api/routes/pdfRoutes';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 4003;

app.use(express.json());
app.use('/api', pdfRoutes);

// Only start the server if we're running directly (not being imported)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the app instead of the server
export default app;