const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Task = require('./api/models/todoListModel');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoAPI_DB", {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./api/routes/todoListRoutes');
routes(app);

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'});
})


app.listen(port);
console.log('API server started on port: ' + port);
