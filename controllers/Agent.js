

const fs = require('fs')
const Agent=require('../models/Agent')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

import { createHash } from 'crypto'


const createAgent = async (request, response) => {

        const { nom, mail, adresse, password, tel1, tel2 } = request.body
        let image = request.files.monimage
        Agent.find({"email" : mail}, (err, user)=>{
            if(user.length > 0){
                res.json({message : 'Email already exists'});
                }
            else {
                       
              bcrypt.hash(password, 10)
              .then(hachage => {
                     //Create User
                     let agent = new Agent();
                     agent.nom = nom
                     agent.email=mail
                     agent.adresse=adresse
                     agent.password=hachage
                     agent.telephone1=tel1
                     agent.telephone2=tel2
                     agent.image = request.protocol+'://'+request.get('host')+'/photo/'+ mail + '/tof/' + request.file.filename
                      const saved = await agent.save()
                      if (!saved) {
                         return res.status(500).send({message : " Compte non crée "});
                       } 
                       // creation de repertoire
                       else {
                         fs.mkdir('/photo/' + mail, (err)=>{
                           if(err) {
                                       response.json({ message : 'une erreur est survenue \n\n ' + err })   
                           }
 
                           response.status(200).json({
                             message : 'yes yes'
                         });
 
              } )       
                       }
         
              })
              .catch(erreur => response.json( {message : 'une erreur est survenue \n\n  ' + erreur} ) )
    
            }    
        } )

}

const allAgent = async (request, response) =>{
    const lesAgent = await Agent.find();
    if (!lesAgent) {
        return res.status(400).send("Pas d'agents existant.");
      }
  
      return res.status(200).json( { agent : lesAgent, locals : listeLocals } );
}

const loginAgent = (request, response)=>{
         const {email, password, categorieAgent } = request.body

         try {
            const user = await Agent.findOne({ email: req.body.email });
            if (!user) {
              return res
                .status(404)
                .json({ message : "aucun utilisateur ne s'est enregistrer avec ces coordonnées. \n veuillez ressayer de nouveau" });
            }
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
              return res.status(401).send("Validation credentials does not match");
            }

            response.status(200).json({
              nextroute: '/reservation/' + idAgent,
              token: jwt.sign(
                  { idagent: user.idAgent, },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '1h' }
              )
          });

          } catch (error) {
            return res.status(500).send(error);
          }
}

module.exports = {createAgent, allAgent, loginAgent}