require("dotenv").config()
const { SQSClient } = require("@aws-sdk/client-sqs")

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

module.exports = sqsClient
