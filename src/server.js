const express = require('express');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const port = 4001;

app.use(express.json());
app.use('/api', pdfRoutes);
app.use('/', (req, res) => {
  res.send('Server is running');
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});