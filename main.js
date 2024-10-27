require("dotenv").config()

const { processBatch } = require("./services/batchProcessor")
const { readExcelFile } = require("./services/excelService")

async function main() {
  try {
    const filePath = "your_file.xlsx"
    const sheetData = readExcelFile(filePath)

    // Configuration for batch size and S3 bucket
    const batchSize = parseInt(process.env.BATCH_SIZE, 10) || 100 // Use batch size from .env or default to 100
    const bucketName = process.env.S3_BUCKET_NAME // Use bucket name from .env

    // Process in batches
    for (let i = 0; i < sheetData.length; i += batchSize) {
      const batch = sheetData.slice(i, i + batchSize)
      console.log(`Processing batch ${i / batchSize + 1}...`)
      await processBatch(batch, bucketName)
      console.log(`Completed batch ${i / batchSize + 1}`)

      // Optional: Add delay between batches to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1-second delay
    }

    console.log("All batches processed successfully.")
  } catch (error) {
    console.error("An error occurred:", error.message)
  }
}

// Execute the script
main().catch(console.error)
