import React from 'react'
import Message from './message'

const Body = ({ messages }) => {
  return (
    <div className="justvoice__chat__body">
      {messages.map((message, index) => (
        <Message key={index} sentBy={message.role} message={message.content}  />
      ))}
    </div>
  )
}

export default Body
