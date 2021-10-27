const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());

require('dotenv').config()

const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cetyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const databse = client.db('NewCarMechanic');
        const serviceCollection = databse.collection('client');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // UPDATE 
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = serviceCollection.updateOne(query)
            res.json(result);
        })

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = serviceCollection.insertOne(service);

            res.json(result);
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('my server is ready to use ');
})


app.listen(port, () => {
    console.log('listing from port', port);
})