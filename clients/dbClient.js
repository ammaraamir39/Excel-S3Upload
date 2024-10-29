require("dotenv").config()
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
let client

async function connectToDB() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
    console.log("Connected to MongoDB")
  }
  return client.db(dbName) // Return the database instance
}

module.exports = { connectToDB }
