const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

//for product

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      // if(docs.length>=0){
      const response = {
        count: docs.length,
        product: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
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
};
exports.products_get = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost3000/products/" + id
          }
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID.",
          request: {
            type: "GET",
            url: "http://localhost3000/products/"
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//for order
exports.order_get_all=(req, res, next) => {
    Order.find()
      .select("_id productId quantity")
  
      //! papulating ref data list using populate('<entity name>')
      .populate('productId')
      .exec()
      .then(orders => {
        const response = {
          count: orders.length,
          order: orders.map(order => {
            return {
              id: order._id,
              productId: order.productId,
              quantity: order.quantity,
              request: {
                type: "GET",
                url: "http://localhost3000/orders/" + orders._id
              }
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
  }

  exports.order_get=(req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
      .select("_id productId quantity")
      .populate('productId')
      .exec()
      .then(order => {
        if (!order) {
          res.status(404).json({
            message: "Order not found."
          });
        }
        const response = {
          order: order,
          request: {
            type: "GET",
            url: "http://localhost3000/order" + id
          }
        };
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }

  //for geting all user
  exports.user_get_all=(req, res, next) => {
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
  }
