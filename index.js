const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors({
  origin: ["http://localhost:5173", "https://modern-jute-wooden.web.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  withCredentials: true,
}))
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.otpbube.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db('ArtAndCraft')
    const craftcollection = database.collection('Craft')
    const subcatagorycollection = database.collection('subcategory_Name')

    app.get('/craft', async (req, res) => {
      const data = craftcollection.find()
      const result = await data.toArray()
      res.send(result);
    })

    app.get('/subcatagory', async (req, res) => {
      const data = subcatagorycollection.find()
      const result = await data.toArray()
      res.send(result);
    })


    app.get('/product/:email', async (req, res) => {
      const email = req.params.email;
      const quary = { email: email }
      const result = await craftcollection.find(quary).toArray()
      res.send(result);
      console.log(email);
    })

    app.get('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }
      const result = await craftcollection.find(quary).toArray()
      res.send(result);
      console.log(id);
    })

    app.get('/allsub/:id',async(req,res)=>{
      const id = req.params.id;
      const quary = {subcategory_Name: id}
      const result = await craftcollection.find(quary).toArray()
      res.send(result)
      console.log(id)
    })

    app.get('/filter',async(req,res)=>{
      const {email,customizable} = req.query;
      const quary = {email: email, customizable: customizable};
      const result = await craftcollection.find(quary).toArray()
      res.send(result)
    })


    app.post('/craft', async (req, res) => {
      const doc = req.body;
      const result = await craftcollection.insertOne(doc)
      res.send(result);
    })

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      console.log('heat delet', id)
      const quary = { _id: new ObjectId(id) }
      const result = await craftcollection.deleteOne(quary);
      res.send(result)
    })


    app.put('/craft/:id', async (req, res) => {
      const id = req.params.id;
      console.log('update hit',id)

      const doc = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedoc = {
        $set: {
          name: doc.name,
          subcategory_Name: doc.subcategory_Name,
          price: doc.price,
          rating: doc.rating,
          processing_time: doc.processing_time,
          detils: doc.detils,
          photo: doc.photo,
          customizable: doc.customizable,
          stockStatus: doc.stockStatus,
        }
      }
      const result = await craftcollection.updateOne(filter,updatedoc,options)
      res.send(result)
    })






    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  console.log('server is running port: ', port)
  res.send(`server is running post: ${port} `)
})

app.listen(port, () => {
  console.log('server running port: ', port)
})