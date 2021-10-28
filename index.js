const express= require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;


const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middelware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d3pnh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("CarMechanic");
        const servicesCollection = database.collection("services");
        
        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
          });

        //   GET Singel Services
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
          });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await servicesCollection.insertOne(service);
            res.json(result)
          });


    }
    finally{
        // await client.close();
    }

};
run().catch(console.dir);



// app.get('/', (req,res)=>{
//     res.send('Runnig Genius server');
// });

app.listen(port, ()=>{
    console.log('Running genius Server On port:', port);
});