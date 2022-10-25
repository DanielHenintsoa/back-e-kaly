const mongoose = require("mongoose");
const schema = mongoose.Schema({
    idMere: mongoose.Schema.Types.ObjectId,
    idPlat: mongoose.Schema.Types.ObjectId,
    pu: Number,
    nombre : Number
});

const CommandeModel = mongoose.model("commande", schema, 'commande');
module.exports = {
    CommandeModel : CommandeModel
};
