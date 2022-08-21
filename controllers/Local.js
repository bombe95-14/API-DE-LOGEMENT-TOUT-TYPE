
const { response } = require('express')
const Local = require('../models/Local')

const createLocal = async (request, response) => {
    const { nom, mail, adresse, password, tel1, tel2 } = request.body
    let images = request.files.mesimages 

    const local = new Local()
     local.agent=idAgent
     local.localisation=localisation
     local.typeLocal=typelocal
     local.departement=departement
     local.surface=superficie
      local.datePubliLocal=Date.now()
      local.prixLoyer=prixLoyer
      local.quantite=quantiteExemplaire
      local.nombre_chadousal=quantitechadousal    
      local.status="non occupe"
      local.liste_image = request.protocol+'://'+request.get('host')+'/photo/'+ mail + '/local/' + request.file.filename

      await local.save()
      .then((reponse) => response.status(200).json({ message : "local enregistrer avec sucess" }))
      .catch(error => res.status(400).json({ error }));
}

const findOneLocal = async (request, response)=>{ 
    
                await Local.findById(request.params.idLocal , (err, local)=>{
                if(err)  return response.status(404).send('LOCAL NON DISPONIBLE')
                else return response.status(200).json(local);
                })       
}

const deleteOne = async (request, response)=>{
          await Local.deleteOne( {_id:request.params.id} )
          .then(xx => response.json({message : 'ce local a ete supprime avec sucess'}))
          .catch(err => response.status(301).json({err}))
}

module.exports = {createLocal, findOneLocal, deleteOne} 