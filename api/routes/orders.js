const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

router.post("/", (req, res, next) => {
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
});
router.get("/", (req, res, next) => {
  Order.find()
    .select("_id productId quantity")

    //! papulating ref data list using populate('<entity name>')
    .populate('productId','name')
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
});

router.get("/:orderId", (req, res, next) => {
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
});
router.patch("/:orderId", (req, res, next) => {
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
});
router.delete("/:orderId", (req, res, next) => {
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
});
router.delete("/", (req, res, next) => {
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
});

module.exports = router;
