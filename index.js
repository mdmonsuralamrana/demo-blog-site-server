const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwpid.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

app.get('/', (req, res) => {
    res.send(`server is working`)
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const adminCollection = client.db(process.env.DB_NAME).collection("admin");
    const newsCollection = client.db(process.env.DB_NAME).collection("allNews");

    if (err) {
        console.log(`database not connected,`,`Server Error:`, err);
    } else {
        //get all news
        app.get('/news', (req, res) => {
            console.log(`your news here`)
            newsCollection.find({})
                .toArray((err, document) => {
                    res.send(document)
                })
        })
        
        //add new news
        app.post('/addNews', (req, res) => {
            const news = req.body;
            newsCollection.insertOne(service)
                .then(result => {
                    res.send(result.insertedCount > 0);
                })
        })

        //delete news
        app.delete('/deleteNews/:id', (req, res) => {
            newsCollection.deleteOne({ _id: ObjectId(req.params.id) })
                .then(result => {
                    res.send(result.deletedCount > 0)
                })
        })

        //update news
        app.patch('/updateNews/:id', (req, res) => {
            newsCollection.updateOne({ _id: ObjectId(req.params.id) }, {
                $set: { title: req.body.title, image: req.body.image, description: req.body.description }
            })
                .then(result => {
                    res.send(result.modifiedCount > 0)
                })
        })

        //add admin access
        app.post('/addAdmin', (req, res) => {
            const admin = req.body;
            adminCollection.insertOne(admin)
                .then(result => {
                    res.send(result.insertedCount > 0);
                })
        })
    }
});

app.listen(port, () => console.log(`listening on port ${port}`))