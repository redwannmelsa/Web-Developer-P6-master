const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

// connexion to MongoDB server
mongoose.connect('mongodb+srv://redwannmelsa:jzfyRkuVEi2AcAIW@cluster0.ihhzf.mongodb.net/Cluster0?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(() => console.log('Unable to connect to MongoDB'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use('/api/auth', userRoutes);

module.exports = app;