const express = require("express");
const router = express.Router();

const postUserController=require('../controller/postController');
const deleteUserController=require('../controller/deleteController');
const getUserController=require('../controller/getController');
const checkAuth=require('../auth/check-auth');
//for signup
router.post("/signup",postUserController.user_signup_post);
//for login
router.post("/login", postUserController.user_login_post);

router.get("/signup",checkAuth,getUserController.user_get_all);
router.delete("/signup/:userId",checkAuth,deleteUserController.user_delete);
module.exports = router;
