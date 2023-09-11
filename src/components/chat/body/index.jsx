import React from 'react'
import Message from './message'

const Body = ({ messages,state }) => {
  return (
    <div className="justvoice__chat__body">
      {messages.map((message, index) => (
        <Message key={index} sentBy={message.role} message={message.content} funcResult={message.funcResult}  />
      ))}
    </div>
  )
}

export default Body
