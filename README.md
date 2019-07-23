# Nodejs API Server

## This repo can be cloned and used as a base project of a Node.js API server

This is an tutorial project built to learn how to build a real world API:

The different things you can do with this server:
<ul>
  <li>Controllers - Deal with DB Read/Write Operations</li>
  <li>Models - Define Schemas of Objects in the DB</li>
  <li>Routes - Define the API routing for controller functions</li>
</ul>

Clone repo and run ```npm i``` to install all packages

In the `server.js` file, you can modify the database location and name on line 22

Start the server with nodemon: ```nodemon start server.js```

Restart running server by typing: ```rs```

Add a ```.env``` flie to the root directory when first cloning this project for storing environment variables

Add to db though postman using following syntax:
```
{
	"email":"test@test.com",
	"password":"123"
}
```

This API was built with [this tutorial](https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd).
