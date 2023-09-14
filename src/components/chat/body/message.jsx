import React from 'react'

const Message = (props) => {
  const { sentBy, message, key, funcResult } = props

  const url = 'https://nani.pk/products/'

  return (
    <div
      className={`${
        sentBy === 'user'
          ? 'justvoice__chat__msg__user'
          : 'justvoice__chat__msg__bot'
      }`}
    >
      {message?.length > 0 ? (
        message
      ) : (
        <div className="justvoice_media_body">
          {funcResult?.map((m) => (
            <div className="justvoice_media_head">
              <img src={m.image} className="justvoice_chat_img" alt="" />
              <h5>
                <a target="_blank" href={url + m.handle}>
                  {m.title}
                </a>{' '}
              </h5>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Message
