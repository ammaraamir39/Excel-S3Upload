// uploadService.js
const { PutObjectCommand } = require("@aws-sdk/client-s3")
const axios = require("axios")
const s3Client = require("../clients/s3Client")

async function uploadLogoToS3(imageUrl, bucketName, keyName, issuerObj) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
    // console.log("Response from axios =>", response)
    const uploadParams = {
      Bucket: bucketName,
      Key: keyName,
      Body: response.data,
      ContentType: response.headers["content-type"]
    }

    await s3Client.send(new PutObjectCommand(uploadParams))
    console.log(`Uploaded ${keyName} successfully.`)
  } catch (error) {
    console.error(`Failed to upload ${keyName}. Error: ${error.message}`)
  }
}

module.exports = { uploadLogoToS3 }
