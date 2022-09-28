/**
 * @fileoverview The starting point of the server file, used to securely serve
 * the dynamically stored files to the front-end upon request
 * Dependencies:
 * - ExpressJS to build a RESTful API on top of Node.js
 * - body-parser to parse HTTP request methods
 * - CORS to safely transfer data between restricted resources (the artefacts)
 *   to the font-end
 */

/* Imports of packages */
const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors");

/* Imports of local modules */
const userRouter = require("./routers/userRouter");
// Accessing the path module
const path = require("path");
// connect mongoose index in models folder
require("./models");
require("./utils/cloudinary");

/* Main implementation */
// app runs on express.js
const app = express();

/* app uses cors to authenticate user
);
*/
app.use(cors());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers, *, Access-Control-Allow-Origin",
    "Origin, X-Requested-with, Content_Type,Accept,Authorization",
    "https://sterlingfamilyartefacts.herokuapp.com"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

// app uses bodyParser to parse JSON objects from HTTP requests
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));

app.use(express.json());

// router of app in server
app.use("/", userRouter);

// Tells the app to listen on port 5000 and logs that information to the console.
app.listen(process.env.PORT || 5100, () => {
  console.log("Server is alive!");
});

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

module.exports = app;
