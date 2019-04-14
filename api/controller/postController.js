const Product = require("../models/product");
const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//for product
exports.product_post=(req, res, next) => {
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage:req.file.path
    });
    product
      .save()
      .then(result => {
        res.status(201).json({
          message: "Creating product Succesfully",
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage:result.productImage,
            request: {
              type: "POST",
              url: "http://localhost3000/products/" + result._id
            }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
//for order
  exports.order_post=(req, res, next) => {
    const id = req.body.productId;
  
    Product.findById(id)
      .then(product => {
        if (!product) {
          res.status(404).json({
            message: "Product Not Found."
          });
        }
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          productId: req.body.productId,
          quantity: req.body.quantity
        });
        return order.save();
      })
      .then(result => {
        res.status(201).json({
          message: "Order Stored.",
          createdOrder: {
            _id: result._id,
            productId: result.productId,
            quantity: result.quantity,
            request: {
              type: "POST",
              url: "http://localhost3000/orders/" + result._id
            }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  //for signup user
  exports.user_signup_post=(req, res, next) => {
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
  }

  //for login controll
   exports.user_login_post=(req, res, next) => {
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
  }