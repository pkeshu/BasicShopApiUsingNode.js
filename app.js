const express=require('express');
const app=express();
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/users');
const morgan =require('morgan');
const bodyParser=require('body-parser');
const mongoose =require('mongoose')
const uri = "mongodb+srv://node-shop:node-shop@node-rest-shop-sjqez.mongodb.net/test?retryWrites=true";
mongoose.connect(uri,{
    useNewUrlParser: true
});

//for access image from everywhere
app.use('/uploads',express.static('uploads'));
//morgan for wating log in terminal 
app.use(morgan('dev'));
//using body parse for post method
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//handaling CORS(Cross Origin Resource Sharing) error
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Orign, X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method=='OPTIONS'){
        res.header("Access-Control-Allow-Methods",
        "PUT,POST,PATCH,DELETE,GET");
        res.status(200).json({});
    }
    next();
});
//route which should handle request
app.use('/products',productRoutes );
app.use('/orders',orderRoutes);
app.use('/',userRoutes);
//Error handaling when resources not found or url not found
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