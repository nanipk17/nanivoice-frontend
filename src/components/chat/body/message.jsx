import React from 'react'

const Message = (props) => {
  const { sentBy, message } = props
  return (
    <div
      className={`${
        sentBy === 'user'
          ? 'justvoice__chat__msg__user'
          : 'justvoice__chat__msg__bot'
      }`}
    >
      { message}
    </div>
  )
}

export default Message
