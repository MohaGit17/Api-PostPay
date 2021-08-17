const mongoose = require('mongoose')
const transs = require('../model/trans')
const clients = require('../model/client')

exports.transCreate = async function (req, res) {

    await clients.find({mail:req.body.from},(err,rest)=>{
        if(err){
            console.log('erreur'+err)
        }else if(rest[0]){
                console.log("mail exist from")
                  if(rest[0].balance<req.body.price){
                        res.json('Erreur: Blanace not can')
                    }else { 
                        console.log("good balance")
                        clients.find({mail:req.body.to},(errr,restt)=>{
                            if(errr){
                                console.log('errreur:'+errr)
                            }else{
                                if(restt[0]){
                                    console.log("mail exist to")
                                    const trans2 = new transs({
                                        price:req.body.price,
                                        to :req.body.to,
                                        from:req.body.from,
                                        spending:req.body.spending,
                                        desc:req.body.desc
                                     });
                                     
                                    for(i=0;i<5;i++){
                                        if(rest[0].table[i].item == req.body.spending){
                                            console.log("la qyanrite actuel eest :" + rest[0].table[i].qty)
                                            let y = rest[0].table[i].qty + parseInt(req.body.price);
                                            rest[0].table[i].qty = y;
                                        }
                                    }
                                     restt[0].balance = parseInt(restt[0].balance) + parseInt(req.body.price);
                                     rest[0].balance-=req.body.price;
                                     trans2.save().then(item => {
                                    //res.send("item saved to database");
                                    console.log('success save data')
                                    restt[0].TransactionsIN.push(item._id)
                                    restt[0].save().then().catch()
                                    rest[0].TransactionsOUT.push(item._id)
                                    rest[0].save().then().catch()
                                    res.json('succes save transaction')
                                    }).catch(error => {
                                    res.status(400).send("unable to save to database" + error);
                                    });

                                }else{
                                    res.json("Recepruter doesn't exist")
                                }
                            }
                             })

                    }
              }
    })
    
    
}

exports.affichtrans = async function(req,res){
    await transs.find({}, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
            res.json(rest)
            console.log(rest)
        }

    })
} 


