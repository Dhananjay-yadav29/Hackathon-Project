const express = require('express');
const mongoose = require('mongoose');

// App config
const app = express();
const port = process.env.PORT || 9000

// Middleware
app.use(express.json());

// DB config
const connection_url = "mongodb+srv://admin:sPLEuzSOq5n6oYLi@cluster0.f9yde.mongodb.net/myDatabase?retryWrites=true&w=majority";
mongoose.connect(connection_url);

// Api routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/project', require('./routes/project'));

app.get("/", (req, res) => res.status(200).send("Hello world"));

// Listening
app.listen(port, () => console.log("Listening"));
