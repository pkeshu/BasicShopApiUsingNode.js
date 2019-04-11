const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'Handaling GET resquest to /products'

    });

});
router.post('/',(req,res,next)=>{
    res.status(200).json({
        message:'Handaling POST resquest to /products'

    });

});
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    if(id=='special'){
        res.status(200).json({
            message:'You found special prodect Id.',
            id:id
        });
    }else{
        res.status(200).json({
            message:'you passed an product Id.'

        });
    }
});
router.patch('/:productId',(req,res,next)=>{
    res.status(200).json({
        message:'Updated product.'

    });
});
router.delete('/:productId',(req,res,next)=>{
    res.status(200).json({
        message:'Deleted product.'

    });
});

module.exports=router;