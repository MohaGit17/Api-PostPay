const express = require('express');
const cliR = express.Router();
const clictrl = require('../controller/clientCtrl');
const upload = require('../middleware/upload')

cliR.get('/',(req,res)=>{
    res.json("test client valide")
})



cliR.get('/affich', clictrl.affichclients)
cliR.post('/affichF',clictrl.affichFriends)
cliR.post('/affichO',clictrl.affichNoFriends)
cliR.post('/taux',clictrl.TauxTransaction)
cliR.post('/transac',clictrl.affichTrasnac)
cliR.post('/addF',clictrl.addFriends)
cliR.post('/removeF',clictrl.removeFriends)
cliR.post('/addVF',clictrl.addVFriends)
cliR.post('/removeVF',clictrl.removeVFriends)
cliR.post('/isF',clictrl.isFriend)
cliR.post('/isVF',clictrl.isVFriend)




// PAGE A UTILISER
cliR.post('/verifyMail', clictrl.verifyUniqueMail)
cliR.post('/Verifycode', clictrl.goodCode)
cliR.post('/connect', clictrl.clientConnect)
cliR.post('/creat',upload.single('avatar'), clictrl.clientCreate)
cliR.post('/filtre',clictrl.filtre)
cliR.post('/affichone',clictrl.afficheOneclient) // AFFICHE LUI MEME (Page principale)
cliR.post('/affipers',clictrl.affichpersonne)   // AFFICHE AUTRE PERSSONE (Profil d'autre personne)
cliR.post('/page2',clictrl.page2)     // page 2  (info sur ses finnace)


module.exports=cliR;