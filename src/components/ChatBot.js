import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios'
import Cookies from 'js-cookie'
import { BsFillChatLeftFill } from 'react-icons/bs'
import { LiaAngleDoubleDownSolid } from 'react-icons/lia'
import useAudioRecorder from '../hooks/recordAudio'

const base = 'https://justvoicebackend-vrtx.vercel.app'

// FULL BOT CONTEXT

let mediaRecorder = null
const Chatbot = ({ siteURL }) => {
  const defaultContextSchema = {
    role: 'system',
    content: `I am an AI Assistant of ${siteURL}  here to help you with your queries. You can ask me anything about our products and services.`,
  }
  const [messagesArray, setMessagesArray] = useState([defaultContextSchema])
  const [products, setProducts] = useState([])
  const [prompt, setPrompt] = useState('')
  const [isBlocked, setIsBlocked] = useState(false)
  const [chatOpened, setChatOpened] = useState(false)
  const {
    startRecording,
    stopRecording,
    togglePauseResume,

    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder()

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

      let voiceapi = base + '/api/voicechat'

      const response = await fetch(voiceapi, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { text, error } = await response.json()
        updateMessagesArray(text)
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
        body: JSON.stringify({ text: textInput }),
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

      if (result.content.length > 0) {
        setMessagesArray((prevState) => [...prevState, result])
        console.log('result')
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
      const result = {
        role: 'system',
        content:
          'Sorry, I am not able to understand your query. Please try again.',
      }
      setMessagesArray((prevState) => [...prevState, result])
      await requestVoice(result.content)

      console.error('Error:', error)
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
        <div onClick={() => setChatOpened(true)} className="chaticon">
          <BsFillChatLeftFill />
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-head">
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
                    message.role === 'user' ? 'user-message' : 'bot-message'
                  }`}
                >
                  {message.role === 'user' && (
                    <img
                      src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg" // Replace with the URL of the user's avatar image
                      alt="User Avatar"
                      className="avatar"
                    />
                  )}

                  <div className={`message-bubble ${message.role}`}>
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

export default Chatbot
