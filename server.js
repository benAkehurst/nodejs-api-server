const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Task = require('./api/models/todoListModel');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/TodoAPI_DB", 
  { useNewUrlParser: true },
  () => { console.log('Connected to Database')}
);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());

const routes = require('./api/routes/todoListRoutes');
routes(app);

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'});
})


app.listen(port);
console.log('API server started on port: ' + port);
