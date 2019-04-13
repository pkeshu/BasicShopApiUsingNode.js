const mongoose=require('mongoose');
const orderShema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product",require:true},
    quantity:{type:Number,default:1}
});
module.exports=mongoose.model("Order",orderShema);