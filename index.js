const express=require('express')
const mongoose = require('mongoose')
// const fileUpload = require('express-fileupload')
const path = require('path')

const Agent = require('./models/Agent').default
const Local = require('./models/Local')
const Reservation = require('./models/Reservation')

const AgentControl = require('./controllers/Agent')
const LocalControl = require('./controllers/Local')
const ReservationControl = require('./controllers/Reservation')

var config = require('./config/config');
const auth = require('./middleware/auth')
const multer = require('./middleware/multer-config')
//Connect to Mongo DB
mongoose.connect(config.getDBString());

//const { MongoClient, ServerApiVersion } = require('mongodb');


const cors = require('cors')

const app=express()


app.use(express.json());
app.use( cors() )

app.use('/photo', express.static(path.join(__dirname, 'photo')));

/*app.get('/', async (request,response)=>{

    const uri = "mongodb+srv://cedric:SAINTvalentin@95@labombe.zsa6q.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
     await client.connect(async (err) => {
      const collection = client.db("labombe").collection("first_table");

      const insertResult = collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
      console.log('Inserted documents =>', insertResult);
      // perform actions on the collection object
      if(err) log('UNE ERREUR DE CONNEXION EST SURVENUE')
      client.close();
    });
   // I/O Exception: Failed to create folder: C:\Users\KENFI\GlassFish_Server.  Terminating archive installation.
      console.log('ENFIN CONNECTE A MONGODB')

      response.send('BONJOUR A TOUS ET A TOUTE')
})*/

// REQUETE DE TYPE GET

app.get('/', async (request, response)=>{
   let infoDate = new Date()
   infoDate=infoDate.getTime - 23*24*3600*1000

  try {
    const lesAgent = await Agent.find();
    const listeLocals = await Local.find( { "status" : "non occupe", "datePubliLocal" : { $gt : infoDate, 
    $not : {$lte:infoDate} }}, { "localisation" : 1, "liste_image" : 1, "typeLocal" : 1, "datePubliLocal" : 1, "surface" : 1, "departement" : 1, "prixLoyer" : 1, "quantite" : 1, "nombre_chadousal" : 1  } )
    
    const varGroup = { $group : {"departement" : "$departement", "typelocal" : "$typeLocal", "total" : {$sum : 1} } }
    const quantite_local = await (await Local.aggregate( [ {}, {} ,varGroup] )).forEach(
        ( department )=>{

        }
    )

    if(!quantite_local)  res.status(400).send("CETTE PARTIE EST EN CONSTRUCTION. MERCI DE REPASSER") 

    if (!lesAgent) {
      return res.status(400).send("Pas d'agents existant.");
    }

    return res.status(200).json( { agent : lesAgent, locals : listeLocals, quantite_local_department : quantite_local } );
  } catch (error) {
    res.status(404).send(error);
  }

 // response.send('merci')

})

app.get('/search/:lieu/:typelocal/:prix', async (request, response)=>{
            const {lieu, typelocal, prix} = request.params
            
            await Local.find({ "status" : "non occupe", "localisation" : lieu , "typeLocal" : typelocal }, 
            { "liste_image" : 1, "datePubliLocal" : 1, "surface" : 1, "departement" : 1, "prixLoyer" : 1, "nombre_chadousal" : 1, "quantite" : 1 } )    
            .then(locaux => response.status(200).json(locaux) )
            .catch(error => response.status(400).json({error}) )
           //  response.send(lieu + '\n\n' + typelocal + '\n\n' + prix)
})


app.get('/agents', AgentControl.allAgent)

app.get('/local/:idLocal',  LocalControl.findOneLocal )

app.get('/service/:type_service', async (request, response)=>{
                  const {type_service} = request.params 
                  await Local.find( { "typeLocal" : typelocal, "status" : "non occupe" },
                  { "localisation" : 1, "liste_image" : 1, "typeLocal" : 1, "datePubliLocal" : 1, "surface" : 1, "departement" : 1, "prixLoyer" : 1, "quantite" : 1, "nombre_chadousal" : 1  }  )    
                  .then(locaux => response.status(200).json(locaux) )
                  .catch(error => response.status(400).json({error}) )                
})

app.get('/connected/:idAgent', auth, ReservationControl.allReservation )

app.get('/reservation/:idAgent', auth, ReservationControl.allReservation )

// REQUETE DE TYPE POST

app.post('/agent' , multer, AgentControl.createAgent )

app.post('/connected/local', auth, multer, LocalControl.createLocal )

app.post('/connexion', AgentControl.loginAgent )

app.post('/reservation_local', ReservationControl.createReservation) 

//REQUETE DE TYPE PUT   DELETE

app.put('/reservation/modified/:idReservation/:idLocal/:type_modification', auth, ReservationControl.modifyReservation )
app.delete('/reservation/annuler/:idReservation/:idLocal', auth, ReservationControl.deleteReservation )
app.delete('/local/:id', auth, Local.deleteOne)

app.listen(config.PORT, ()=>{
  console.log('Server started at - '+ config.URL+ ":" +config.PORT);
});

//mongodb+srv://cedric:<password>@labombe.zsa6q.mongodb.net/?retryWrites=true&w=majority

