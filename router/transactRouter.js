const express = require('express')
const trR=express.Router();
const trctrl = require('../controller/transCtrl');

trR.get('/',(req,res)=>{
    res.json("test transaction valide")
})
trR.post('/creat', trctrl.transCreate)
trR.get('/affich', trctrl.affichtrans)



module.exports=trR;