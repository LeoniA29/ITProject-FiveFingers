// imports libraries and frameworks used for the project
const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors')

// app runs on express.js
const app = express()

// app uses cors to authenticate user
app.use(
    cors({
      origin: "http://localhost:3000", // location of the react app were connecting to
      credentials: true,
    })
);

// app uses bodyParser to parse JSON objects from HTTP requests
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));

app.use(express.json())
app.use(cors())

// router of app in server
const userRouter = require('./routers/userRouter')
app.use('/', userRouter)

// Tells the app to listen on port 5000 and logs that information to the console.
app.listen(process.env.PORT || 5100, () => {
    console.log('Server is alive!')
})

// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// connect mongoose index in models folder
require('./models')

require('./utils/cloudinary')

module.exports = app
