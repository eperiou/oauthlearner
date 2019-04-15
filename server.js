const express = require("express");
require("dotenv").config();

const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://ezpz-lemonsqueezy.auth0.com/.well-known/jwks.json"
  }),
  audience: "http://localhost:3001",
  issuer: "https://ezpz-lemonsqueezy.auth0.com/",
  algorithms: ["RS256"]
});

const App = express();
App.get("/public", function(req, res) {
  res.json({
    message: "hello from public api"
  });
});
App.get("/private", jwtCheck, function(req, res) {
  res.json({
    message: "hello from private api"
  });
});
App.get("/courses", jwtCheck, checkScope(["read:courses"]), function(req, res) {
  res.json({
    courses: [
      { id: 1, title: "getting better at titles" },
      { id: 2, title: "Doing alright at course" }
    ]
  });
});

const checkRole = role => {
  return (req, res, next) => {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      res.status(401).send("Insufficient role");
    }
  };
};

App.get("/admin", jwtCheck, checkRole("admin"), function(req, res) {
  res.json({
    message: "hello from admin api"
  });
});

App.listen(3001);
console.log(`listening on ${process.env.REACT_APP_API_URL}`);
