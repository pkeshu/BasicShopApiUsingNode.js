const express=require('express');
const app=express();
const productRoutes=require('./api/routes/products')
const orderRoutes=require('./api/routes/orders')
const morgan =require('morgan');

// app.use((req,res,next)=>{
//     res.status(200).json({
//         message:'its work!'
//     });
// });

//route which should handle request
app.use(morgan('dev'));
app.use('/products',productRoutes );
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error=new Error("Not Found");
    error.status=404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports=app;