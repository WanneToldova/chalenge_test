const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const routes = require('./api/routes');

// Middleware para tratar JSON
app.use(express.json());

// Route
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Fake API running at port ${PORT}`);
});
