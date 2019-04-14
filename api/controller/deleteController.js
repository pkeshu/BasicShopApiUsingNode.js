const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
//for product
exports.product_delete_all=(req,res,next)=>{
    Product.find()
    .remove()
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"All Products are deleted successfully."
        });
    })
    .catch(err=>{
        res.status(500).json({

            error:err
        });
    });
}
exports.product_delete= (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Data delete Successfully",
          request: {
            type: "DELETE",
            url: "http://localhost3000/products" + id
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

  //for orders
  exports.order_delete_all=(req, res, next) => {
    Order.find()
      .remove()
      .exec()
      .then(result => {
        res.status(200).json({
          message: "All order are Deleted.",
          request: {
            type: "DELETE",
            urls: "http://localhost3000/orders"
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
  exports.order_delete=(req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Order Deleted Successfully.",
          request: {
            type: "DELETE",
            url: "http://localhost3000/orders/",
            body: {
              productId: "ID",
              quantity: "number"
            }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }

  //delete all user
  exports.user_delete=(req, res, next) => {
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
  }