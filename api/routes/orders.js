const express = require("express");
const router = express.Router();
const CheckAuth=require('../auth/check-auth');
const getOrderController=require('../controller/getController');
const postOrderController=require('../controller/postController');
const updateOrderController=require('../controller/updateController');
const deleteOrderController=require('../controller/deleteController');

router.post("/", CheckAuth,postOrderController.order_post);
router.get("/", CheckAuth,getOrderController.order_get_all);
router.get("/:orderId", CheckAuth,getOrderController.order_get);
router.patch("/:orderId", CheckAuth,updateOrderController.order_update);
router.delete("/:orderId",CheckAuth,deleteOrderController.order_delete);
router.delete("/", CheckAuth,deleteOrderController.order_delete_all);

module.exports = router;
