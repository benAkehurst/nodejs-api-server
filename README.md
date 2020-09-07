# Nodejs boilerplate REST API

## This repo can be cloned/forked and used as a boilerplate for a node REST API

I built this repo to learn how to make a rest api and server. It was created by following [this tutorial](https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd), and has been expanded on to service the needs of a boilerplate project.

The different things you can do with this server:

- Controllers - deals with database read/write operations
- Models - define schemas of objects in collections the database
- Routes - defines the API routing for controller functions
- Middlewares - helper files and methods

### Installing & config

1. Clone repo and run `npm i` to install all packages

2. In the `server.js` file, you can modify the database location and name on line 22

3. Run MongoDB locally with `brew services start mongodb-community`

### Running the project

1. Add a `.env` flie to the root directory when first cloning this project for storing environment variables

2. Add a `JWT_SECRET` to the `.env` file

3. Start the server with nodemon: `npm start`

4. Restart running server by typing: `rs`

## Current Routes

### Auth Routes

`/api/auth/create-new-user`

```javascript
  POST:
  {
    "firstName": "null", (firstName is optional)
    "lastName": "null", (lastName is optional)
    "email": "test@test.com",
    "password": "test" (min 6 chars)
  }
```

`/api/auth/login-user`

```javascript
  POST:
  {
    "email": "test@test.com",
    "password": "test" (min 6 chars)
  }
```

`/api/auth/check-token-valid/:token`

```javascript
  GET:
  token - this needs to be JWT token provided when logging in
```

### Todo Routes

`/api/tasks/create-new-task/:token`

```javascript
  POST
  {
    "task": "string",
    "userId": "string <-- needs to be the userId from mongodb"
  }
```

`/api/tasks/read-all-user-tasks/:userId/:token`

```javascript
  GET
  Gets all the tasks from a single user
```

`/api/tasks/:userId/:token/:taskId`

```javascript
  GET
  Gets a single task from a single user
```

```javascript
  Updates a single task text
  PUT
  {
    "task": "string"
  }
```

```javascript
  DELETE
  Deletes a single task
```
