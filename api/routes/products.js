const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
const CheckAuth=require('../auth/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter =(req,file,cb)=>{
    //reject operation
    if( file.mimetype==='image/jpeg'||file.mimetype==='image/png' || file.mimetype==='image/jpg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter:fileFilter
});

router.get("/", (req, res, next) => {
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
            productImage:doc.productImage,
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
});
router.post("/",CheckAuth,upload.single("productImage"), (req, res, next) => {
  // const product ={
  //     name: req.body.name,
  //     price: req.body.price
  // };
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
});
router.get("/:productId",CheckAuth, (req, res, next) => {
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
});
router.patch("/:productId", CheckAuth,(req, res, next) => {
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
});
router.delete("/:productId",CheckAuth, (req, res, next) => {
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
});
router.delete('/',CheckAuth,(req,res,next)=>{
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
});

module.exports = router;

/*


! This code is not working 
? Is this really working?

TODO hello guys whats going on!


*/
