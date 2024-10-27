const XLSX = require("xlsx")

// Function to read the Excel file and convert it to JSON
function readExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    return sheetData
  } catch (error) {
    console.error("Failed to read Excel file:", error.message)
    throw error
  }
}

module.exports = { readExcelFile }
