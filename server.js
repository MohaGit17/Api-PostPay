const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use('/uploads',express.static('uploads'))

require('./model/db')();

const transR = require('./router/transactRouter');
const cliR = require('./router/clientRouter');
app.use('/client',cliR)
app.use('/transaction',transR)
app.use(express.json())
app.use(cors());
app.get('/',function(req,res){res.json('hello')});
//app.get('/favuser',funtion(req,res){
   // res.json()
//})

let port =process.env.PORT || 8000;

app.listen(port,()=>{
   console.log("We are listening ")
});