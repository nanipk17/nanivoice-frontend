import React from 'react'
import { MdSend } from 'react-icons/md'
import { BsFillChatRightFill } from 'react-icons/bs'

const ChatButton = (props) => {
    const { toggleChat, chatOpen,prompt,handleTextSubmit } = props
    return (
        chatOpen ?
            <button onClick={() => { handleTextSubmit(prompt)}} className='justvoice__chat__button__send__open'>
                <MdSend className='justvoice__send__icon' />
            </button>
            :
            <button onClick={toggleChat} className='justvoice__chat__button__send__open'>
                <BsFillChatRightFill className='justvoice__chat__open__icon' />
            </button>
    )
}

export default ChatButton