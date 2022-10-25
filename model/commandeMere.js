const mongoose = require("mongoose");
const { CommandeModel } = require("./commande");
const schema = mongoose.Schema({
    idUser: mongoose.Schema.Types.ObjectId,
    idResto: mongoose.Schema.Types.ObjectId,
    daty: Date,
    idLivreur: mongoose.Schema.Types.ObjectId,
    etat : Number
});

const CommandeMereModel = mongoose.model("commande_mere", schema, 'commande_mere');
const CommandeMereComplet = mongoose.model("commande_livreurs", schema, 'commande_livreurs');


const ValiderPanier  = (panier, idUser) => {
    const commandes = panier.reduce((group, product) => {
        const { resto } = product;
        group[resto[0]._id] = group[resto[0]._id] ?? [];
        group[resto[0]._id].push(product);
        return group;
      }, {});
    
    for (const [key, value] of Object.entries(commandes)) {
        console.log(`${key}: ${value}`);
        const idResto = key;
        const plats = value;
        var commandeMere = new CommandeMereModel({
            idUser: idUser,
            idResto: idResto,
            daty: new Date(),
            etat : 1
        });
        commandeMere.save(function (err, commandeMere) {
            if (err){
                console.log(err);
                throw err;
            }else{
                plats.map(plat => {
                    const commandeFille = new CommandeModel({
                        idMere: commandeMere._id,
                        idPlat: plat._id,
                        pu: plat.pu,
                        nombre : plat.nombre
                    });
                    commandeFille.save((err, commandeF)=>{
                        if (err){
                            console.log(err);
                            throw err;
                        }
                        console.log(commandeF);
                    })
                });
            }
        });
    }
}
module.exports = {
    CommandeMereModel : CommandeMereModel,
    CommandeMereComplet : CommandeMereComplet,
    validerPanier : ValiderPanier
};