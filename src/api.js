const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

MongoClient.connect(url, function(err, client) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Create a new document
    const createDocument = (data) => {
      db.collection('mycollection').insertOne(data, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Document created');
        }
      });
    };

    // Read all documents
    const readDocuments = () => {
      db.collection('mycollection').find().toArray((err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
    };

    // Update a document
    const updateDocument = (id, data) => {
      db.collection('mycollection').updateOne({ _id: id }, { $set: data }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Document updated');
        }
      });
    };

    // Delete a document
    const deleteDocument = (id) => {
      db.collection('mycollection').deleteOne({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Document deleted');
        }
      });
    };
  }
});