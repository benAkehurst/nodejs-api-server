const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Task = require('./api/models/todoListModel');
const User = require('./api/models/userModel');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/TodoAPI_DB", 
  { useNewUrlParser: true },
  () => { console.log('Connected to Database')}
);

require('dotenv').config();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});
app.use(cors());

const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const todoRoutes = require('./api/routes/todoListRoutes');
userRoutes(app);
authRoutes(app);
todoRoutes(app);

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'});
})


const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
