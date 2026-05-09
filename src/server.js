require('dotenv').config();
const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('School Management API Running');
});

// Routes
app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
