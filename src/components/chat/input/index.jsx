import React from 'react'
import { BsFillMicFill } from 'react-icons/bs'

const Input = ({
  handleStartRecording,
  handleStopRecording,
  setPrompt,
  prompt,
  isRecording,
}) => {
  return (
    <div className="justvoice__input">
      <div className="justvoice__input__top__border"></div>
      <div className="justvoice__input__textarea">
        <textarea
          name="enter_msg"
          id="enter_msg"
          value={prompt}
          placeholder="Enter your message..."
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
      </div>
      <div className="justvoice__bottom__layout">
        <div className="justvoice__mic__button">
          {isRecording ? (
            <div className="justvoice__mic__zindex" onClick={handleStopRecording} >
              <BsFillMicFill className="justvoice__mic__icon_recording" />
            </div>
          ) : (
            <div className="justvoice__mic__zindex" onClick={handleStartRecording} >
              <BsFillMicFill className="justvoice__mic__icon" />
            </div>
          )}
        </div>
        <small className="justvoice__bottom__copyright">
          {/* <span>Powered by</span>{' '} */}
          {/* <a
            href="https://www.justautofy.com/products/justvoice"
            target="_blank"
          >
            <img
              className="justvoice__bottom__copyright__img"
              src="https://www.justautofy.com/assets/images/shared/logo-dark.svg"
              alt="img"
            />
          </a> */}
        </small>
      </div>
    </div>
  )
}

export default Input
