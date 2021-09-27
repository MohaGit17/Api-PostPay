const mongoose = require('mongoose')
const clients = require('../model/client')
const transs = require('../model/trans')
const confirms = require('../model/confirmation')
const nodemailer = require("nodemailer");


exports.verifyUniqueMail = async function(req,res){
    await clients.find({mail:req.body.mail}, async function (err, rest) {
        if (err) {
            console.log('erreur'+err)
        } else {
                if(rest[0]){
                    res.json('Bad adress')
                }else{
                    
                    let y = Math.round(Math.random() * (899999) + 100000);
                    let z = 'Your code is :'+y+'; valide for 24 Hours'; 
                    
                    var transporter = nodemailer.createTransport({
                        service: 'outlook',
                        auth: {
                          user: 'Postpay@outlook.fr',
                          pass: 'PastPay23456'
                        }
                      });
                      
                      var mailOptions = {
                        from: 'Postpay@outlook.fr',
                        to: req.body.mail,
                        subject: 'Verification PostPay user',
                        text: z
                        // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                    
                            console.log('Mail envoye')
                            const confir = new confirms({
                                mail : req.body.mail,
                                confirm_code : y
                            })
                            confir.save().then().catch()
 
                    res.json('Good adress')  
                }
        }

    })  
}

exports.goodCode = async (req,res)=>{
    await confirms.find({mail:req.body.mail},(err,rest)=>{
        if(err){
            console.log(err)
        }else{
            res.json(rest[0].confirm_code == req.body.code)
        }
    })
}

exports.clientCreate = async function (req, res) {

    const tablaux = [{  item: "STYLE", qty: 0   },{  item: "FOOD", qty: 0   },{  item: "SPORT", qty: 0   },{  item: "TECH", qty: 0   },{  item: "OTHER", qty: 0   },{item:"TRAVEL",qty:0}]
    const clients2 = new clients({
        mail:req.body.mail,
        username:req.body.username,
        pass:req.body.pass,
        gender:req.body.gender,
        date_naiss:req.body.dd,
        table:tablaux
        });
    if(req.file){
    clients2.avatar = req.file.path
    }    
    clients2.save()
    .then(item => {
        //res.send("item saved to database");
        console.log('success save')
        res.json('succes save client')
        })
        .catch(err => {
            res.status(400).send("unable to save to database" + err);
    });
    
}

exports.affichclients = async function(req,res){
    await clients.find({}, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
                res.json(rest)
        }

    })
} 


exports.affichallotofclients = async function(req,res){
    await clients.find({mail : { $in: req.body.listOfClients } }, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
                res.json(rest)
        }

    })
} 


exports.filtre = async function (req,res){
    let from=new Date(req.body.fromD)
    let to=new Date(req.body.toD)
    console.log(from,to)
    if(req.body.spending.length == 0){
        console.log('vide')
        await transs.find({price:{$gte:req.body.min,$lte:req.body.max},cdate:{$gte:from,$lte:to},$or :[{from:req.body.mail},{to:req.body.mail}]},(err,rest)=>{
            if(err){
                console.log(err)
            }else{
                res.json(rest)
            }
        })
    }else{
        console.log('non vide '+ req.body.spending)
        await transs.find({price:{$gte:req.body.min,$lte:req.body.max},cdate:{$gte:from,$lte:to},spending:req.body.spending,$or :[{from:req.body.mail},{to:req.body.mail}]},(err,rest)=>{
            if(err){
                console.log(err)
            }else{
                res.json(rest)
            }
        })
    }
/*  */
    
}

exports.afficheOneclient = async function(req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
            var userinfo = {}
            userinfo.username = rest[0].username
            userinfo.avatar = rest[0].avatar
                res.json(userinfo)
        }

    })
} 

exports.affichpersonne = async function(req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
            let y={}
            y.friend = (rest[0].freind.includes(req.body.id))
            clients.find({_id:req.body.id},(err2,rest2)=>{
                y.p=rest2[0];
                res.json(y)
            })
                
        }

    })
} 

exports.clientConnect  = async function(req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
            if(rest[0]){
                console.log(rest[0].pass)
                if(rest[0].pass==req.body.pass){
                    let y ={}
                    y.id=rest[0]._id
                    y.mail=rest[0].mail
                    y.username=rest[0].username
                    y.pass=rest[0].pass
                    y.balance=rest[0].balance
                    y.freind=rest[0].freind
                    y.Vfriend=rest[0].Vfriend
                    y.gender=rest[0].gender
                    y.table=rest[0].table
                    y.avatar=rest[0].avatar
                    res.json(y)
                }else{
                    res.json('Wrong pass')
                }
            }else{
                res.json('Wrong mail')
            }
    
        }
    })
} 

exports.affichNoFriends = async function(req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            res.json( err )
        } else {
            rest[0].freind.push(rest[0]._id)
            clients.find({_id:{$nin:rest[0].freind}},(err2,res2)=>{
                    res.json(res2)
            })
           
        }

    })
}

exports.affichFriends = async function(req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            consoel.log( err )
        } else {
            console.log(rest)
            let tab=[]
            clients.find({_id:{$in:rest[0].freind}},(err2,res2)=>{
                if(err2){
                    console.log(err2)
                }else{
                for(i=0;i<res2.length;i++){
                    let y={};y.id=res2[i]._id;y.mail=res2[i].mail;y.username=res2[i].username;y.avatar=res2[i].avatar;
                    console.log(rest[0].Vfriend.includes(res2[i]._id))
                    y.v=rest[0].Vfriend.includes(res2[i]._id);
                    tab.push(y);
                }
                res.json(tab)
            }
        })
        }
    })
    
}

exports.affichVFriends = async function(req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            res.render('errorPage', { error: err })
        } else {
            
            let tab=[]
            clients.find({_id:rest[0].Vfriend},(err2,res2)=>{
                if(err2){
                    console.log(err2)
                }else{
                for(i=0;i<res2.length;i++){
                    let y={};y.id=res2[i]._id;y.mail=res2[i].mail;y.username=res2[i].username;y.avatar=res2[i].avatar;
                    tab.push(y);
                }
                res.json(tab)
            }          
            })
            
        }
    })
    
}

exports.addFriends = async function(req,res){ //friend id in req.body.id
    await clients.findOneAndUpdate({mail:req.body.mail},{ $push: { freind : req.body.id }}, function (err, rest) {
        if (err) {
            conole.log(err)
        } else {
            res.json('update succefully')
        }
    })
}

exports.addVFriends = async function(req,res){ //friend id in req.body.id
    await clients.find({mail:req.body.mail}, async function (err, rest) {
        if (err) {
            res.json(err)
        } else {
                    if(rest[0].freind.includes(req.body.id)){
                        rest[0].Vfriend.push(req.body.id)
                        rest[0].save().then().catch()
                        res.json('succes updat')
                    }else{
                        res.json('please add him in your friend and in sseconde time to your favorite friend')
                    }
                }
    })
}

exports.removeFriends = async function(req,res){
    
    await clients.findOneAndUpdate({mail:req.body.mail},{ $pull: { freind : req.body.id }}, function (err, rest) {
        if (err) {
            res.json(err)
        } else {
            res.json('update succefully')
        }
    })
} 

exports.removeVFriends = async function(req,res){
    await clients.findOneAndUpdate({mail:req.body.mail},{ $pull: { Vfriend : req.body.id }}, function (err, rest) {
        if (err) {
            res.json(err)
        } else {
            res.json('update succefully')
        }
    })
} 

exports.isFriend =   async function (req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            consoel.log( err )
        } else {
            res.json(rest[0].freind.includes(req.body.id))
        }

    })
}

exports.isVFriend =   async function (req,res){
    await clients.find({mail:req.body.mail}, function (err, rest) {
        if (err) {
            consoel.log( err )
        } else {
            console.log(rest[0].Vfriend.includes(req.body.id))
            res.json(rest[0].Vfriend.includes(req.body.id))
        }

    })
}

exports.affichTrasnac = async function(req,res){
    /*await clients.find({mail:req.body.mail},async (err,rest)=>{
        if(err){
            consoel.log(err)
        }else{ 
        var myIds = new Array() 
        await transs.find({_id:{$in:rest[0].TransactionsIN},_id:{$in:rest[0].TransactionsOUT}},(err2,rest2)=>{
            res.json(rest2)
        })    
    }
    })*/
    await transs.find({$or :[{from:req.body.mail},{to:req.body.mail}]},(err,rest)=>{
        res.json(rest)
    })
}

exports.TauxTransaction = async function(req,res){ 
    await clients.find({mail:req.body.mail},(err,rest)=>{
        let totale=0;
        for(i=0;i<6;i++){
            totale += parseInt(rest[0].table[i].qty) 
        }
        console.log(totale)
        console.log(" STYLE = " + ((rest[0].table[0].qty*100)/totale) + " FOOD = " + ((rest[0].table[1].qty*100)/totale))
        res.json(" STYLE = " + ((rest[0].table[0].qty*100)/totale) + " FOOD = " + ((rest[0].table[1].qty*100)/totale)+ " SPORT = " + ((rest[0].table[2].qty*100)/totale)+ " TECH = " + ((rest[0].table[3].qty*100)/totale)+" TRAVEL = " + ((rest[0].table[5].qty*100)/totale) + " OTHER = " + ((rest[0].table[4].qty*100)/totale) )
    })
}

exports.page2 = async function(req,res){
    await clients.find({mail:req.body.mail},async (err,rest)=>{
        if(err){
            consoel.log(err)
        }else{ 
        let y ={}
        let recive=0;depence=0;
        y.b=rest[0].balance;
        let from=new Date(req.body.fromD)
        let to=new Date(req.body.toD)
        await transs.find({_id:{$in:rest[0].TransactionsOUT},price:{$gte:req.body.min,$lte:req.body.max},cdate:{$gte:from,$lte:to}},(err2,rest2)=>{
            for(i=0;i<rest2.length;i++){
                depence += rest2[i].price;
            }
        })   
        await transs.find({_id:{$in:rest[0].TransactionsIN},price:{$gte:req.body.min,$lte:req.body.max},cdate:{$gte:from,$lte:to}},(err2,rest3)=>{
            for(i=0;i<rest3.length;i++){
                recive += rest3[i].price;
            }
        })
        y.lastTrIN=rest3[0];
        y.lastTrOUT=rest2[0]; 
        y.r=recive;
        y.d=depence;
        res.json(y)
    }
    })
}