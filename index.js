const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');

connectToMongo();

const PORT = 8181 || process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());


// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenge', require('./routes/challenge'));


app.listen(PORT, () => {
    console.log(`The App is running at http://localhost:${PORT}`);
})