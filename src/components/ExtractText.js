import React, { useState } from 'react'
import pdfjs from 'pdfjs-dist'

const PdfTextExtractor = () => {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  const extractTextFromPdf = async () => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const typedArray = new Uint8Array(reader.result)
      try {
        const pdf = await pdfjs.getDocument(typedArray).promise
        const numPages = pdf.numPages
        let extractedText = ''
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber)
          const textContent = await page.getTextContent()
          textContent.items.forEach((textItem) => {
            extractedText += textItem.str + ' '
          })
        }
        setText(extractedText)
      } catch (error) {
        console.error('Error extracting text:', error)
        setText('Error extracting text')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={extractTextFromPdf}>Extract Text</button>
      <div>
        <h2>Extracted Text:</h2>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default PdfTextExtractor
