const fs = require('fs')
const path = require('path')
const pdfParse = require('pdf-parse')

const readPdf = async (files) => {
  try {
    const combinedText = []

    for (const file of files) {
      const filePath = path.resolve(__dirname, file)
      const pdfData = await fs.promises.readFile(filePath)
      const options = {} // You can add options if needed, e.g., { max: 1 } to extract only the first page
      const pdfText = await pdfParse(pdfData, options)

      // Trim whitespace and remove empty lines from each PDF
      const trimmedText = pdfText.text
        .replace(/^\s+|\s+$/gm, '')
        .replace(/^\s*\n/gm, '')
      combinedText.push(trimmedText)
    }

    return combinedText.join('\n\n') // Separate text from different PDFs with two newlines
  } catch (error) {
    console.error('Error reading PDF:', error)
    throw new Error('The file could not be read.')
  }
}

const pdfFiles = ['test.pdf', 'kiddo.pdf'] // Replace with the array of file paths

// readPdf(pdfFiles)
//   .then((data) => {
//     console.log('Combined Text:', data)
//   })
//   .catch((err) => console.error(err))

console.log(__dirname)
