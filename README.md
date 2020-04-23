# node.js boilerplate API server

## This repo can be cloned and used as a base project of a node.js API server

I built this repo to learn how to make an api server. It was created by following [this tutorial](https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd), and has been expanded on using the lessons learnt.

The different things you can do with this server:

- Controllers - deal with database read/write operations
- Models - define schemas of objects in the database
- Routes - define the API routing for controller functions

### Todo

- [ ] Add a templating engine to allow for doing serverside templating (ejs or pug)
- [ ] Add passport.js for logging in via FB, twitter, email
- [ ] Add firebase support

### Installing & config

1. Clone repo and run `npm i` to install all packages

2. In the `server.js` file, you can modify the database location and name on line 22

### Running the project

3. Add a `.env` flie to the root directory when first cloning this project for storing environment variables

4. Add a `config.js` to the `middlewares` file and add your own secret phrase

```javascript
module.exports = {
  secret: 'worldisfullofdevelopers',
};
```

5. Start the server with nodemon: `nodemon start server.js`

6. Restart running server by typing: `rs`

### Adding entities to the database

7. Add to db though postman using following syntax:

```javascript
{
"email":"test@test.com",
"password":"123"
}
```

This means that you need to have an empty object with the key pair items that the database is expecting to receive.
