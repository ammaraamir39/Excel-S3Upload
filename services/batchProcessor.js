// batchProcessor.js
const pLimit = require("p-limit")
const { uploadLogoToS3 } = require("../services/s3UploadService")

const limit = pLimit(10) // Allow a maximum of 10 concurrent uploads

// Function to process each batch of images
async function processBatch(batch, bucketName) {
  const uploadPromises = batch.map((row, index) => {
    const logoUrl = row["LogoURL"] // Assumes Excel column name is 'LogoURL'
    const ticker = row["Ticker"] ? row["Ticker"] : row["CUSIP"]
    const logoName = `logos/${ticker}.png` // Customize the key name as needed

    // Use p-limit to control concurrency
    return limit(() => uploadLogoToS3(logoUrl, bucketName, logoName))
  })

  // Wait for all uploads in the current batch to complete
  await Promise.all(uploadPromises)
}

module.exports = { processBatch }
