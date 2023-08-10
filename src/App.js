import React from 'react';
import ChatBot from "./components/ChatBot";
import ChatbotTest from './components/UrduBot';
import Chatbot from './components/ChatBot';
import ChatWidget from './components/chat';
// import PdfTextExtractor from './components/ExtractText';

function App({siteURL}) {

  console.log('siteURL',siteURL)

  return (
    <div>
      {/* <ChatbotTest siteURL={siteURL} /> */}
      <ChatWidget/>
      {/* <Chatbot siteURL={siteURL} /> */}
      {/* <PdfTextExtractor/> */}
    </div>
  )
}

export default App;
