require("dotenv").config()
const EventEmitter = require("events")
const { uploadLogoToS3 } = require("../services/s3UploadService")
const { connectToDB } = require("../clients/dbClient")

const CDN_BASE_URL = process.env.CDN_BASE_URL

class BatchEmitter extends EventEmitter {}
const batchEmitter = new BatchEmitter()

async function saveBatchToDatabase(batch) {
  try {
    const db = await connectToDB()
    const collection = db.collection("issuers")

    // Use bulk write with upsert option to handle duplicates
    const bulkOps = batch.map((record) => ({
      updateOne: {
        filter: { ticker: record.ticker }, // Ensure uniqueness based on ticker
        update: { $set: record },
        upsert: true // Insert if the document doesn't exist
      }
    }))

    const result = await collection.bulkWrite(bulkOps)
    console.log(
      `Inserted ${result.upsertedCount} new records, updated ${result.modifiedCount} existing records.`
    )
  } catch (error) {
    console.error("Error inserting records to the database:", error)
  }
}

async function updateIssuerCusips(issuerCusipChunk) {
  try {
    const db = await connectToDB()
    const issuersCollection = db.collection("issuers")
    const issuercusipsCollection = db.collection("issuercusips")

    for (const { ticker, cusip } of issuerCusipChunk) {
      const issuer = await issuersCollection.findOne({ ticker })
      if (!issuer) {
        console.error(`Issuer with ticker ${ticker} not found.`)
        continue
      }

      const issuerId = issuer._id

      await issuercusipsCollection.updateOne(
        { issuer: issuerId },
        {
          $addToSet: { cusip: cusip }
        },
        { upsert: true }
      )

      console.log(
        `Updated or inserted CUSIP ${cusip} for issuer with ticker ${ticker}`
      )
    }
  } catch (error) {
    console.error("Error updating issuer CUSIPs:", error)
  }
}

async function processBatch(batch, bucketName, maxConcurrency = 10) {
  const results = []
  for (let i = 0; i < batch.length; i += maxConcurrency) {
    // Take a slice of the batch, limited to the max concurrency
    const chunk = batch.slice(i, i + maxConcurrency)
    const issuerChunk = []
    const issuerCusipChunk = []

    const uploadPromises = chunk.map((row) => {
      const name = row["IssuerName"]
      const logoUrl = row["LogoURL"] // Assumes Excel column name is 'LogoURL'
      const ticker = row["Ticker"] ? row["Ticker"] : row["CUSIP"]
      const cusip = row["CUSIP"] ?? null
      const logoName = `logos/${ticker}.png` // Customize the key name as needed

      console.log("LogoURL => ", { logoUrl, ticker, logoName })
      const issuerObj = {
        name,
        ticker,
        logoUrl: `https://${CDN_BASE_URL}/logos/${ticker}.png`,
        email: "",
        user: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const issuerCusipChunkObj = {
        ticker,
        cusip,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      issuerChunk.push(issuerObj)
      issuerCusipChunk.push(issuerCusipChunkObj)
      // Call the upload function
      return uploadLogoToS3(logoUrl, bucketName, logoName, issuerObj)
    })

    // Wait for the current chunk to complete before moving to the next
    results.push(...(await Promise.all(uploadPromises)))
    console.log("PUSHING TO BATCH EMITTER =>", issuerChunk)
    batchEmitter.emit("batchReady", { issuerChunk, issuerCusipChunk })
  }
  return results
}

module.exports = {
  processBatch,
  saveBatchToDatabase,
  updateIssuerCusips,
  batchEmitter
}
