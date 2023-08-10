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
widgetDivs.forEach((div) => {
  ReactDOM.render(<App siteURL={div.dataset.siteurl} />, div)
})
