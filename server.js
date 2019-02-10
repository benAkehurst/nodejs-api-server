const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Task = require('./api/models/todoListModel');
const routes = require('./api/routes/todoListRoutes');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/YourDB", {
  useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes(app);


app.listen(port);
console.log('API server started on port: ' + port);
