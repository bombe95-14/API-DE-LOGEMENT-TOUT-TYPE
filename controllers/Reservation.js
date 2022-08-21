
const Reservation = require('../models/Reservation')
const Local = require('../models/Local')

exports.createReservation = async (request, response)=>{
    
    const reservation = new Reservation({ status : "initialise", dateReservation : Date.now() ,
        ...request.body
      });
      
      reservation.save()
      .then((reponse) => {
        await Local.findById(request.body.idLocal, (err, local)=>{
                if(err)  return response.status(404).json({message : 'LOCAL NON DISPONIBLE'})
                else  
                { 
                    if( local.quantite === 1 )
                       Local.updateOne({ _id : request.idLocal }, { status : "reserve" }).then( rep => response.status(200).json( {message : "VOTRE RESERVATION A ETE EFFECTUE" } ) ).catch( err1 => response.status(400).json({ error }) )
                    else 
                       Local.updateOne({ _id : request.idLocal }, { quantite : local.quantite - 1 }).then( rep => response.status(200).json( {message : "VOTRE RESERVATION A ETE EFFECTUE" } ) ).catch( err1 => response.status(400).json({ error }) )       
                 }
             } )
    })
    .catch(error => res.status(400).json({ error }) );
}

exports.deleteReservation = async (request, response)=>{
          await Reservation.deleteOne({ _id:request.params.idReservation })
          .then( (rep) => { 
            await Local.findById(request.params.idLocal, (err, local)=>{
                if(err)  return response.status(404).json({err})
                else  
                { 
                    if( local.status === "reserve" )
                       Local.updateOne({ _id : request.idLocal }, { status : "non occupe" }).then( rep => response.status(200).json( {message : "CETTE RESERVATION A ETE ANNULE" } ) ).catch( err1 => response.status(400).json({ error }) )
                    else 
                       Local.updateOne({ _id : request.idLocal }, { quantite : local.quantite + 1 }).then( rep => response.status(200).json( {message : "CETTE RESERVATION A ETE ANNULE" } ) ).catch( err1 => response.status(400).json({ error }) )       
                 }
             } )                     
            //response.status(200).json( {message : "CETTE RESERVATION A ETE ANNULE AVEC SUCESS" } )
        } )
          .catch( err1 => response.status(400).json({ error }) )             
}

exports.modifyReservation = async (request, response)=>{
        if (request.params.type_modification === 'cours_de_traitement') {
            await Reservation.updateOne( { _id : request.params.idReservation} , { status : "en traitement" } )
        } else {
            
            await Reservation.updateOne( { _id : request.params.idReservation} , { status : "traite avec sucess" } )
            .then( ok =>{
  
              await Local.findById(request.params.idLocal, (err, local)=>{
                  if(err)  return response.status(404).json({err})
                  else  
                  { 
                      if( local.status === "reserve" )
                         Local.updateOne({ _id : request.idLocal }, { status : 'occupe completement', quantite : 0 }).then( rep => response.status(200).json( {message : "CETTE RESERVATION A ETE ANNULE" } ) ).catch( err1 => response.status(400).json({ error }) )        
                   }
               } )  
  
            } ).catch( err =>  response.status(400).json( {err} ) )

        }          
}

exports.allReservation = async (request, response) => {
       // await Reservation.find( { status : { $in : ['initialise', 'traite avec sucess'] } } )
        await Reservation.aggregate( [ {$match : { idAgent : request.params.idAgent }} ,{ $sort : { "status" : 1 } } ] )
              .then( reservations => response.status(200).json(reservations) )
              .catch( error => response.json({error}) )
}