import React from 'react'
import ChatBot from './components/ChatBot'
import ChatbotTest from './components/UrduBot'
import Chatbot from './components/ChatBot'
import ChatWidget from './components/chat'
// import PdfTextExtractor from './components/ExtractText';

function App({ siteURL, apiKey, mail }) {
  return (
    <div>
      <ChatWidget
        siteURL={siteURL}
        mail={mail}
        apiKey={apiKey}
        lang={siteURL.length > 1 && siteURL === 'nani.pk' ? 'urdu' : 'en'}
      />
    </div>
  )
}

export default App
