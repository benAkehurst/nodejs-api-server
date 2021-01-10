# Nodejs boilerplate REST API

## This repo can be cloned/forked and used as a boilerplate for a node REST API

I built this repo to learn how to make a rest api and server. It was created by following [this tutorial](https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd), and has been expanded on to service the needs of a boilerplate project. I've also used inspiration from [this awesome dev!](https://github.com/christopherliedtke)

The different things you can do with this server:

- Controllers - deals with database read/write operations and logic.
- Models - define schemas of objects in collections the database.
- Routes - defines the API routing for controller functions.
- Middlewares - helper files, utils and methods. Basically anything that isn't done by a controller.

### Installing & config

1. Clone repo and run `npm i` to install all packages

2. In the `server.js` file, you can modify the database location and name on line 22

3. Run MongoDB locally with `brew services start mongodb-community`

### Running the project

1. Add a `.env` flie to the root directory when first cloning this project for storing environment variables

2. Add a `JWT_SECRET` to the `.env` file

3. Start the server with nodemon: `npm start`. Currently the default port for the server is `5000` and this can be set in the `.env`. This is to prevent clashes when running the server and clients in dev locally.

4. Restart running server by typing: `rs`

## Available Scripts

- `start` - starts the server
- `reset` - deletes the node_modules
- `reinstall` - deletes and then reinstalls the node_modules
- `test` - runs all unit tests
- `test:watch` - watches for unit tests that have changed and reruns the test suite

## Current Routes

### Auth Routes

#### `/api/v1/auth/login-user`

```javascript
  POST:
  {
    "email": "",
    "password": "" (at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.)
  }
```

#### `/api/v1/auth/create-new-user`

```javascript
  POST:
  {
    "firstName": "", (firstName is optional)
    "lastName": "", (lastName is optional)
    "email": "",
    "password": "" (at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.)
    "password2": ""
    "acceptedTerms": Boolean
  }
```

#### `/api/v1/auth/verification/verify-account/:uniqueId/:secretCode`

This route is activated when a user clicks the link in an email sent to then when creating a new account.

#### `/api/v1/auth/password-reset/get-code`

Allows a user to get a password reset code emailed to them.

```javascript
  POST:
  {
    "email": "",
    "password": "",
    "password2": "",
    "code": "" (this will have been emailed to the user)
  }
```

#### `/api/v1/auth/password-reset/verify-code

Allows a user to get a password reset code emailed to them.

```javascript
  POST:
  {
    "email": ""
  }
```

#### `/api/v1/auth/delete-account`

Allows a user to delete their account.

```javascript
  POST:
  {
    "password": "",
    "uniqueId": ""
  }
```

#### `/api/v1/auth/check-token-valid-external/:token`

```javascript
  GET
  External route to check if a token is valid
```
