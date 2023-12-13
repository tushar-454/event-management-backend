const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
const cors = require('cors');

app.use(express.json());
app.use(
  cors({
    origin: ['https://event-management-4dbcc.web.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

const uri = process.env.URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const eventManagementDB = client.db('eventManagementDB');
    const servicesCollection = eventManagementDB.collection('services');
    const bookingCollection = eventManagementDB.collection('booking');

    // api database data
    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    // get one services using id
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const result = await servicesCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // get booking cart
    app.get('/cart/:email', async (req, res) => {
      const { email } = req.params;
      const result = await bookingCollection.find({ email: email }).toArray();
      res.send(result);
    });

    // add cart item in database
    app.post('/booking', async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result);
    });

    // delete cart from database
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('<h1>api is working</h1>');
});

app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
