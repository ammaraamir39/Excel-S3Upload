# Batch Image Uploader to AWS S3

This project provides a Node.js script to upload images from an Excel file to an Amazon S3 bucket. It supports batch processing, concurrency control, and proper error handling. The code is modular, making it easy to maintain and extend.

## Features

- Reads image URLs from an Excel file and uploads them to an S3 bucket.
- Batch processing to handle large datasets.
- Configurable concurrency control to avoid rate limiting.
- Error handling and retry mechanisms.
- Organized code structure with separate modules for better maintainability.

## Prerequisites

- **Node.js** (v12 or higher)
- An **AWS account** with an S3 bucket created
- **AWS credentials** with permissions to upload to S3

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

   ```

2. **Install Required Dependencies:**

   ```bash
       npm install
   ```

## Project Structure

The project is organized into modular files for better maintainability and scalability. Below is an overview of the project structure:

/your-project ├── .env # Environment variables (AWS credentials, S3 bucket name, batch size) ├── .gitignore # Git ignore file (includes .env to prevent sensitive information from being committed) ├── main.js # Main entry point of the script, orchestrates the batch processing ├── s3Client.js # AWS S3 client configuration using AWS SDK v3 ├── uploadService.js # Handles logic for uploading images to S3 ├── batchProcessor.js # Manages batch processing and concurrency control ├── excelService.js # Reads the Excel file and converts the data to JSON format ├── your_file.xlsx # Sample Excel file containing a list of image URLs (LogoURL column) ├── package.json # Node.js dependencies and scripts └── README.md # Project documentation (you are reading this file)

### Explanation of the Files

- **`main.js`**: The main script that coordinates reading the Excel file, processing data in batches, and uploading to S3.
- **`s3Client.js`**: Configures the AWS S3 client using AWS SDK v3.
- **`uploadService.js`**: Handles the actual upload logic for sending image files to the specified S3 bucket.
- **`batchProcessor.js`**: Manages batch processing of records and limits concurrent uploads to avoid rate limiting.
- **`excelService.js`**: Provides a function to read the Excel file and parse its contents into a JSON object.
- **`your_file.xlsx`**: A sample Excel file with a column named `LogoURL` containing the image URLs to be uploaded.
- **`package.json`**: Lists the dependencies required for the project (e.g., `@aws-sdk/client-s3`, `axios`, `xlsx`, `p-limit`) and any project-specific scripts.
- **`README.md`**: The documentation file that provides an overview of the project, setup instructions, and usage guidelines.
