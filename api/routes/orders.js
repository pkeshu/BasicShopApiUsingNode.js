const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'GET request in /orders.'

    });

});

router.post('/',(req,res,next)=>{
    order={
        productId:req.body.productId,
        quantity:req.body.quantity

    }
    res.status(201).json({
        message:'Handaling POST request in /orders.',
        order: order
    });

});
router.get('/:orderId',(req,res,next)=>{
    if(req.params.orderId=="special"){
        res.status(200).json({
            id:req.params.orderId,
            message:"You found special Order Id."
        });
    }else{
        res.status(200).json({
         
                message:"You passed Order Id."
            

        });
    }

});
router.patch('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:"Updated Order."

    });

});
router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:"Deleted Order."

    });

});

module.exports=router;