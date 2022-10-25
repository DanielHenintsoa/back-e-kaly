const express = require("express");
var cors = require('cors')
const app = express();
const db = require("./db/connection");
const {userModel, userComplet} = require("./model/userModel");
const {platComplet} = require("./model/platModel");
const {CommandeMereModel, CommandeMereComplet, validerPanier} = require("./model/commandeMere");
const { RestoModel } = require("./model/restoModel");

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors({
    origin : "*"
}));
const {SMTPClient}   = require('emailjs');


app.get('/api/utilisateurs', cors(), async(req, res) => {
    try {
        const posts = await userModel.find();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/plats', cors(), async(req, res) => {
    try {
        const posts = await platComplet.find();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/restos', cors(), async(req, res) => {
    try {
        const posts = await RestoModel.find();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/client/rechercher', cors(), async(req, res) => {
    try {
        let text = req.query.text;
        if(text){
            text = text.trim();
        }
        console.log(text);
        const posts = await platComplet.find({
            $or : [{ 
                    libelle : { $regex: "(?i)"+text }
                },
                { 
                    categorie : { $regex: "(?i)"+text }
                }]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/api/login', cors(), async(req, res) => {
    const {email, mdp} = req.body;
    try {
        const user = await userComplet.findOne({
            email : email,
            mdp : mdp
        });
        if(!user){
            res.status(500).send({
                message : "Erreur d'authentification !"
            });
        }else{
            res.json(user);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/commander', cors(), async(req, res) => {
    const {plats, idUser} = req.body;
    try {
        validerPanier(plats, idUser);
        res.json({});
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/client/commandes', cors(), async(req, res) => {
    try {
        const idUser = req.query.idUser;
        const posts = await CommandeMereComplet.find({
            idUser : idUser
        });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/resto/commandes', cors(), async(req, res) => {
    try {
        const idResto = req.query.idResto;
        const posts = await CommandeMereComplet.find({
            idResto : idResto
        });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/resto/valider-commande', cors(), async(req, res) => {
    try {
        const { idCommande } = req.body;
        const c = await CommandeMereModel.findOneAndUpdate({_id : idCommande}, { etat : 11 });
        res.json(c);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/e-kaly/commandes', cors(), async(req, res) => {
    try {
        const posts = await CommandeMereComplet.find({
            etat : 11
        });
        const livreurs = await userComplet.find({
            idProfil : "6241b4f794736fed37e2fb2a"
        });
        res.json({commandes : posts, livreurs : livreurs});
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/e-kaly/assigner-livreur', cors(), async(req, res) => {
    try {
        const { idLivreur, idCommande } = req.body;
        const c = await CommandeMereModel.findOneAndUpdate({_id : idCommande}, { idLivreur : idLivreur });
        res.json(c);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/livreur/commandes', cors(), async(req, res) => {
    try {
        const idLivreur = req.query.idLivreur;
        console.log(idLivreur);
        const posts = await CommandeMereComplet.find({
            idLivreur : idLivreur,
            etat : 11
        });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/livreur/livrer', cors(), async(req, res) => {
    try {
        const { idCommande } = req.body;
        console.log(idCommande);
        const c = await CommandeMereModel.findOneAndUpdate({_id : idCommande}, { etat : 21 });
        res.json(c);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/sendMail', cors(), async(req, res) => {
    try {
        const { commande, isValide} = req.body;
        const textValid = isValide ? "validée" : "annullée";
        const client  = new SMTPClient({
            user:    "daniel.devvv@gmail.com",
            password:"vavolombelona.24",
            host:    "smtp.gmail.com",
            ssl:     true,
            port: 465
        });

        client.send({
            text:    "Votre commande est "+textValid,
            from:    "daniel.devvv@gmail.com",
            to:      commande.utilisateur.email,
            subject: "E-kaly Commande ["+commande.resto.libelle+"] - Ref : ["+commande._id+"]",
            attachment:
            [
               {
                   data:"<html><strong>Bonjour, votre commande sur E-kaly est "+textValid+"<br/> Connectez-vous sur <a href='www.e-kaly.com' target='_blank'>www.e-kaly.com</a> pour voir les détails</strong></html>", alternative:true
                }
            ]
        }, function(err, message) {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }else{
                res.json({success: true, msg: 'sent'});
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3001, ()=>{
    console.log("Listenning on port 3001...");
});