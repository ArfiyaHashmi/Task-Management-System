// mongoConnect.js
const { MongoClient } = require('mongodb');

// Replace this with your actual connection string
const uri = "mongodb+srv://root:root123@cluster0.n7ekgaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();  // Connect to MongoDB

    const db = client.db("");  // Replace with your DB name
    const collection = db.collection("your_collection_name");  // Replace with your collection name

    const data = await collection.find({}).toArray();  // Fetch all documents
    console.log("Fetched Data:", data);
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  } finally {
    await client.close();  // Close connection
  }
}

run();
