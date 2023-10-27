const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


// Middleware
app.use(cors())
app.use(express.json())


// coffee-project
// 3mrTWIlbbkNPfztV


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnl4pp8.mongodb.net/?retryWrites=true&w=majority`;

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

    let coffeeCollection = client.db('coffeeCollection').collection('coffee')

    app.get('/coffee', async (req, res) => {
      let cursor = coffeeCollection.find()
      let result = await cursor.toArray()
      res.send(result)

    })

    app.get('/updatecoffee/:id', async (req, res) => {
      let id = req.params.id
      let query = { _id: new ObjectId(id) }
      let result = await coffeeCollection.findOne(query)
      res.send(result)
    })


    app.post('/addCoffee', async (req, res) => {
      let data = req.body
      console.log(data);
      let result = await coffeeCollection.insertOne(data)
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      let id = req.params.id
      let query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/updatecoffee/:id',async (req, res) => {
      let id = req.params.id
      let coffeeData = req.body
      let query = { _id: new ObjectId(id) }
      let option = { upsert: true }
      let updatedData = {
        $set: {
          coffeeName:coffeeData.coffeeName,
          avaibaleQuentey:coffeeData.avaibaleQuentey,
          supplierName:coffeeData.supplierName,
          taste:coffeeData.taste,
          category:coffeeData.category,
          details:coffeeData.details,
          photoUrl:coffeeData.photoUrl
        }
      }
      let result = await coffeeCollection.updateOne(query,updatedData,option)
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


app.get('/', (req, res) => {
  res.send('Backend server is running')
})

app.listen(port, () => {
  console.log('Server is running');
})