
 const mongoose = require("mongoose");
 const Schema = mongoose.Schema;
 const ObjectId = Schema.Types.ObjectId;
 
 const menuSchema = new Schema({
    
   idLoccal : {
     type: ObjectId,
     ref: "Local",
   },
   idAgent: {
    type: ObjectId,
    ref: "Agent",
  },
   dateReservation : {
    type : Number, 
  required : true
},
   telephone1 : Number,
   telephone2 : Number, 
   email : String,
   status : {
    type : String,
     required : true,
     enum : ['initialise', 'en traitement', 'traité avec sucess' ] 
   }
 });
 
 module.exports = mongoose.model("Reservation", menuSchema);
 