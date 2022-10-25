const mongoose = require("mongoose");
const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: String,
    prenom: String,
    email: String,
    mdp: String,
    token: String,
    dateExpiration: Date,
    idProfil: mongoose.Schema.Types.ObjectId,
    idResto : String, 
});

const UserModel = mongoose.model("utilisateur", schema, 'utilisateur');
const UserComplet = mongoose.model("user_complet_resto", schema, 'user_complet');
module.exports = {
    userModel : UserModel,
    userComplet : UserComplet
};