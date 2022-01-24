//imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//importing routes from route files
const userRoutes = require('./routes/users');
const saucesRoutes = require('./routes/sauces');

// connexion to MongoDB server
mongoose.connect('mongodb+srv://redwannmelsa:jzfyRkuVEi2AcAIW@cluster0.ihhzf.mongodb.net/Cluster0?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(() => console.log('Unable to connect to MongoDB'));

const app = express();

//setting up CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); //allows images to be posted by users and saves them to image folder
app.use('/api/auth', userRoutes); //authentification and login
app.use('/api/sauces', saucesRoutes); //all sauce related routes, POST, GET, PUT, DELETE

module.exports = app;