import React from 'react'

const Message = (props) => {
  const { sentBy, message, key,funcResult } = props
  return (
    <div
      className={`${
        sentBy === 'user'
          ? 'justvoice__chat__msg__user'
          : 'justvoice__chat__msg__bot'
      }`}
    >
      {message?.length > 0 ? message : (
        <div>
          {funcResult?.map((m)=>(
            <img src={m.image} className='w-[200px] h-[200px]' alt="" />
          ))}
        </div>
      ) }
    </div>
  )
}

export default Message
