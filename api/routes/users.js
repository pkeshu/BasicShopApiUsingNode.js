const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//for hasing password use bcrypt library
const bcrypt = require("bcrypt");

//for signup
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length > 0) {
        return res.status(409).json({
          message: "Email already exit"
        });
      } else {
        bcrypt.hash(req.body.password, 11, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              // password:req.body.password
              password: hash,
              gender: req.body.gender,
              mobileNo: req.body.mobileNo,
              firstname: req.body.firstname,
              middlename: req.body.middlename,
              lastname: req.body.lastname,
              age: req.body.age
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User Created."
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

//for login

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed."
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth Failed."
            });
          }
          if (result) {
            const token = jwt.sign(
                {
                  email: user[0].email,
                  userId: user[0]._id
                },
                "secretkey",
                {
                  expiresIn: "1h"
                }
              );
            return res.status(200).json({
              message: "Auth Successful.",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth Failed."
            
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.get("/signup", (req, res, next) => {
  User.find()
    .select("_id email gender mobileNo firstname middlename lastname age")
    .exec()
    .then(users => {
      const response = {
        count: users.count,
        users: users.map(user => {
          return {
            _id: user._id,
            email: user.email,
            gender: user.gender,
            mobileNo: user.mobileNo,
            firstname: user.firstname,
            middlename: user.middlename,
            lastname: user.lastname,
            age: user.age
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.delete("/signup/:userId", (req, res, next) => {
  User.find({ _id: req.params.userId })
    .remove()
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted."
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
