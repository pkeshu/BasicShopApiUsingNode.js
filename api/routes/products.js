const express = require("express");
const router = express.Router();
const multer = require("multer");
const CheckAuth=require('../auth/check-auth');
const getProductController=require('../controller/getController');
const postProductController=require('../controller/postController');
const updateProductController=require('../controller/updateController');
const deleteProductController=require('../controller/deleteController');

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

router.get("/",getProductController.products_get_all);
router.post("/",CheckAuth,upload.single("productImage"),postProductController.product_post);
router.get("/:productId",CheckAuth,getProductController.products_get);
router.patch("/:productId", CheckAuth,updateProductController.product_update);
router.delete("/:productId",CheckAuth,deleteProductController.product_delete);
router.delete('/',CheckAuth,deleteProductController.product_delete_all);


module.exports = router;