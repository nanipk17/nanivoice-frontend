import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './chat.css'
import App from './App'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// Find all widget divs
const widgetDivs = document.querySelectorAll('.justvoice')

// Inject our React App into each class
//
// div.dataset.siteurl
// mail={div.dataset.mail}
// siteURL={div.dataset.siteurl}
// apiKey={div.dataset.apikey}
widgetDivs.forEach((div) => {
  ReactDOM.render(
    <App
      mail={'sadathsadu2002@gmail.com'}
      siteURL={'nani.pk'}
      apiKey={'1233'}
    />,
   div
  )
})
