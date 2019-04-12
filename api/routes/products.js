const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const mongoose=require('mongoose');

router.get('/',(req,res,next)=>{
    // res.status(200).json({
    //     message:'Handaling GET resquest to /products'

    // });
    Product.find()
    .exec()
    .then(docs=>{
        // if(docs.length>=0){
            res.status(200).json(docs);
        // }else{
            // res.status(404).json({
            //     message:"No entries Found."
            // })
        // }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

});
router.post('/',(req,res,next)=>{
    // const product ={
    //     name: req.body.name,
    //     price: req.body.price
    // };

    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price

    });
    product.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Handaling POST resquest to /products',
            createdProduct :result
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        });

    });
});
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;

Product.findById(id)
.exec()
.then(doc=>{
    console.log("From Database",doc);
    if(doc){
        res.status(200).json(doc);

    }else{
        res.status(404).json({
            message:"No valid entry founf for provided ID."
        });
    }    
})
.catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
        
    });
});
    // if(id=='special'){
    //     res.status(200).json({
    //         message:'You found special prodect Id.',
    //         id:id
    //     });
    // }else{
    //     res.status(200).json({
    //         message:'you passed an product Id.'

    //     });
    // }
});
router.patch('/:productId',(req,res,next)=>{

const id=req.params.productId;
const updatedOps={};
for(const ops of req.body){
    updatedOps[ops.propName]=ops.value;
}
Product.update({_id: id},{$set:updatedOps}).exec()
.then(result=>{
    console.log(result);
    res.status(200).json(result);
})
.catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    });
});

    // res.status(200).json({
    //     message:'Updated product.'

    // });
});
router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
       res.status(500).json({
           error:err

       });
    });
    // res.status(200).json({
    //     message:'Deleted product.'

    // });
});

module.exports=router;