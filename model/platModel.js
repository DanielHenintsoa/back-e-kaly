const mongoose = require("mongoose");
const schema = mongoose.Schema({
    libelle: String,
    categorie: String,
    idResto: mongoose.Schema.Types.ObjectId,
    pu : Number,
    etat : Number,
    pa : Number
});

const PlatModel = mongoose.model("plat", schema, 'plat');
const PlatComplet = mongoose.model("plat_complet_final", schema, 'plat_complet_final');
module.exports = {
    platModel : PlatModel,
    platComplet : PlatComplet
};