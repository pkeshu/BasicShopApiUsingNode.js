const Product = require("../models/product");
const Order = require("../models/order");

//for product
exports.product_update=(req, res, next) => {
    const id = req.params.productId;
    const updatedOps = {};
    for (const ops of req.body) {
      updatedOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updatedOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Data Update SuccessFully.",
          request: {
            type: "UPDATE",
            url: "http://localhost3000/products/" + id
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
  exports.order_update=(req, res, next) => {
    const id = req.params.orderId;
    const updatedOps = {};
    for (const ops of req.body) {
      updatedOps[ops.propName] = ops.value;
    }
  
    Order.update({ _id: id }, { $set: updatedOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Order is Updated successfully",
          request: {
            type: "UPDATE",
            url: "http://localhost3000/orders" + id
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }