import React from 'react';
import ChatBot from "./components/ChatBot";
// import PdfTextExtractor from './components/ExtractText';

function App({siteURL}) {

  console.log('siteURL',siteURL)

  return (
    <div>
      <ChatBot siteURL={siteURL} />
      {/* <PdfTextExtractor/> */}
    </div>
  );
}

export default App;
