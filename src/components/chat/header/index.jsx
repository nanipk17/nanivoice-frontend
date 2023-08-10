import React from 'react'
import { BiBot, BiChevronDown } from 'react-icons/bi'

const Header = (props) => {
    const { toggleChat } = props
    return (
        <div className='justvoice__chat__header'>
            <div className="justvoice__chat__header__botname">
                <div className="justvoice__chat__bot__image">
                    <BiBot />
                </div>
                <div className="justvoice__chat__bot__name">
                    <div className='justvoice__chat__bot__name_p'>
                        JustVoice
                    </div>
                    <small>
                        AI Voice Chatbot
                    </small>
                </div>
            </div>
            <div onClick={toggleChat} className="justvoice__close__chat__icon__wrapper">
                <div className="justvoice__close__chat__icon__bg"></div>
                <div className="justvoice__mic__zindex">
                    <BiChevronDown className='justvoice__chat__down__chevron' />
                </div>
            </div>
        </div>
    )
}

export default Header