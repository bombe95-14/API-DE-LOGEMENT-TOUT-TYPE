
 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
 const ObjectId = Schema.Types.ObjectId;
 
 const agentSchema = new Schema({
   agent: {
     type: ObjectId,
     ref: "Agent",
   },
   localisation: String,
   typeLocal : {
            type : String, 
            required : true, 
            enum : [ 'chambre moderne', 'studio moderne', 'appartement', 'villa & duplex', 'boutique', 'magasin' ]
   },
   status : {
         type : String,
         required : true, 
         enum : ['occupe completement', 'non occupe', 'reserve']
   }, 
   departement : {
    type : String, required : true
   }, 
   surface : Number,
   quantite : Number,
   prixLoyer : Number,
   liste_image : [String], 
   datePubliLocal : Number,
   nombre_chadousal : [Number],
 });
 
 module.exports = mongoose.model("Local", menuSchema);
 