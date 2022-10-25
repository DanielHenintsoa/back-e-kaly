const mongoose = require("mongoose");
const schema = mongoose.Schema({
    libelle: String,
    etat: Number,
    cardClasse : String
});

const RestoModel = mongoose.model("resto", schema, 'resto');
module.exports = {
    RestoModel : RestoModel
};