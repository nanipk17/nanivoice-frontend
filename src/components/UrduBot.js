import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios'
import Cookies from 'js-cookie'
import { BsFillChatLeftFill } from 'react-icons/bs'
import { LiaAngleDoubleDownSolid } from 'react-icons/lia'
import useAudioRecorder from '../hooks/recordAudio'

// let  base = 'http://localhost:3000'
const base = 'https://justvoicebackend-vrtx.vercel.app'

// FULL BOT CONTEXT
const defaultContextSchema = {
  role: 'system',
  content:
    'میں یہاں آپ کے سوالات میں مدد کرنے کے لئے نانی ڈاٹ پی کے اے آئی اسسٹنٹ ہوں. آپ مجھ سے ہماری مصنوعات اور خدمات کے بارے میں کچھ پوچھ سکتے ہیں.',
}
let newbase = 'http://localhost:3000'

let mediaRecorder = null
const ChatbotTest = ({ siteURL }) => {
  const [messagesArray, setMessagesArray] = useState([defaultContextSchema])
  const [products, setProducts] = useState([])
  const [prompt, setPrompt] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const [chatOpened, setChatOpened] = useState(false)
  const [record, setRecord] = useState(false) // state to control recording
  const [audioBlob, setAudioBlob] = useState(null)
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder()

  // function to handle the recorded blob

  const handleStartRecording = () => {
    startRecording()
  }

  const handleStopRecording = async () => {
    stopRecording()
  }

  useEffect(() => {
    handleAudioRecordingComplete(recordingBlob)
  }, [recordingBlob])

  const handleAudioRecordingComplete = async (audioBlob) => {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.wav')
      // formData.append('model', 'whisper-1')
      formData.append('language', 'en')

      let voiceapi = base + '/api/gcloud/s2tURL'
      // let voiceapi = base+ '/api/gcloud/speech2text'

      const response = await fetch(voiceapi, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { transcription } = await response.json()
        updateMessagesArray(transcription)
      } else {
        console.error('Failed to send audio to the API.')
      }
    } catch (error) {
      console.error('Error sending audio to the API:', error)
    }
  }

  const requestVoice = async (textInput) => {
    const url = base + '/api/readvoice'

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          text: textInput,
          voiceId: 'IKne3meq5aSn9XLyUdCD',
        }),
      })

      if (res.status === 200) {
        const audioBuffer = await res.arrayBuffer()
        const audioContext = new AudioContext()
        const audioBufferSource = audioContext.createBufferSource()
        audioContext.decodeAudioData(audioBuffer, (buffer) => {
          audioBufferSource.buffer = buffer
          audioBufferSource.connect(audioContext.destination)
          audioBufferSource.start()
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (
      messagesArray.length > 1 &&
      messagesArray[messagesArray.length - 1].role !== 'system'
    ) {
      handleChatRequest()
    }
  }, [messagesArray, products])

  const updateMessagesArray = (newMessage) => {
    const newMessageSchema = {
      role: 'user',
      content: newMessage,
    }
    setMessagesArray((prevState) => [...prevState, newMessageSchema])
  }

  const handleChatRequest = async () => {
    const key = 'chat_memory'
    let convoSummary = Cookies.get(key) ? JSON.parse(Cookies.get(key)) : ''
    const aisummary = {
      role: 'system',
      content: 'this is the summary of conversation i know ' + convoSummary,
    }

    try {
      const obj = {
        conversationId: Cookies.get('convoId') ? Cookies.get('convoId') : '',
        textInput: messagesArray[messagesArray.length - 1].content,
        siteURL: 'nani.pk',
      }

      const apiUrl = base + '/api/chatgpt/openai'

      const response = await axios.post(apiUrl, {
        input: obj,
        summary: aisummary,
      })

      let { result, summary, convoId } = await response.data
      if (obj.conversationId.length < 1) {
        Cookies.set('convoId', convoId)
      }

      if (result.content) {
        setMessagesArray((prevState) => [...prevState, result])
        await requestVoice(result.content)
        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      } else {
        setProducts(result.result)

        setMessagesArray((prevState) => [...prevState, result])
        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      }
    } catch (error) {
      console.error('Error:', error)
      const result = {
        role: 'system',
        content:
          'معذرت، میں آپ کے سوال کو سمجھنے کے قابل نہیں ہوں۔ دوبارہ کوشش کریں.',
      }
      setMessagesArray((prevState) => [...prevState, result])
      await requestVoice(result.content)
    }
  }

  const handleTextSubmit = () => {
    if (prompt == '') {
      alert('no input')
      return
    } else {
      updateMessagesArray(prompt)
      setPrompt('')
    }
  }

  return (
    <>
      {!chatOpened ? (
        <div onClick={() => setChatOpened(true)} className="chaticon-urdu">
          <BsFillChatLeftFill />
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-head-urdu">
            <h1>{siteURL}</h1>
            <div>
              <LiaAngleDoubleDownSolid
                onClick={() => setChatOpened(false)}
                className="closeicon"
                color="white"
              />
            </div>
          </div>
          <div className="flex-1 bg-white flex items-start justify-start">
            <div className="message-body">
              {messagesArray.map((message, index) => (
                <div
                  key={index}
                  className={`message-container ${
                    message.role === 'user'
                      ? 'user-message-urdu'
                      : 'bot-message'
                  }`}
                >
                  {message.role === 'user' && (
                    <img
                      src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg" // Replace with the URL of the user's avatar image
                      alt="User Avatar"
                      className="avatar"
                    />
                  )}

                  <div className={`message-bubble-urdu ${message.role}`}>
                    <p className="msg-body">{message.content}</p>
                  </div>

                  {message.role === 'system' && (
                    <img
                      alt="Bot Avatar"
                      src="https://herobot.app/wp-content/uploads/2022/11/AI-bot-1.jpg"
                      className="avatar"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              className="chat-input-text"
              placeholder="Type your message..."
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTextSubmit()
                }
              }}
            />

            <button
              className="chat-input-button-urdu"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {isBlocked && (
              <p>
                Microphone access blocked. Please allow microphone access to use
                this feature.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ChatbotTest
