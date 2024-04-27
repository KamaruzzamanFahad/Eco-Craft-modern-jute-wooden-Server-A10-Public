const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.otpbube.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('ArtAndCraft')
    const craftcollection = database.collection('Craft')
    const subcatagorycollection = database.collection('subcategory_Name')

    app.get('/craft', async (req,res) =>{
        const data = craftcollection.find()
        const result = await data.toArray()
        res.send(result);
    })

    app.get('/subcatagory', async (req,res) =>{
        const data = subcatagorycollection.find()
        const result = await data.toArray()
        res.send(result)
    })

    app.get('/craft/:id', async(req,res)=> {
        const email = req.params.id;
        const quary = {email: "mihacker41@gmail.com"}
        const result = await craftcollection.find(quary)

        res.send(result)
        console.log(email)
    })


    app.post('/craft', async (req,res) => {
        const doc = req.body;
        const result = await craftcollection.insertOne(doc)
        res.send(result)
    })

    















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req,res) =>{
    console.log('server is running port: ',port)
    res.send(`server is running post: ${port} `)
})

app.listen(port, () => {
    console.log('server running port: ',port)
})