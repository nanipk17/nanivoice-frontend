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
  const handleStop = (blob) => {
    setAudioBlob(blob)
  }

  const handleStartRecording = () => {
    startRecording()
  }

  const handleStopRecording = async () => {
    stopRecording()
    console.log('hii')
  }

  useEffect(() => {
    handleAudioRecordingComplete(recordingBlob)
  }, [recordingBlob])

  const handlePauseResumeRecording = () => {
    togglePauseResume()
  }

  const handleAudioRecordingComplete = async (audioBlob) => {
    console.log('packet sent')
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.wav')
      // formData.append('model', 'whisper-1')
      formData.append('language', 'en')

      base = 'http://localhost:3000'
      let voiceapi = base + '/api/gcloud/speech2text'

      const response = await fetch(voiceapi, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        console.log('Audio sent to the API successfully.')
        const { transcription } = await response.json()
        updateMessagesArray(transcription)

        console.log('response', transcription)
      } else {
        console.error('Failed to send audio to the API.')
      }
    } catch (error) {
      console.error('Error sending audio to the API:', error)
    }
  }

  const requestVoice = async (textInput) => {
    let voiceid = '21m00Tcm4TlvDq8ikWAM'

    const baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech'
    const headers = {
      'Content-Type': 'application/json',
      'xi-api-key': '2deb078ea46d326f322b86cb3220bdf8',
    }

    const requestBody = {
      text: textInput,
      model_id: 'eleven_multilingual_v1',
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
        style: 0.5,
        use_speaker_boost: true,
      },
    }
    try {
      const response = await axios.post(`${baseUrl}/${voiceid}`, requestBody, {
        headers,
        responseType: 'blob',
      })

      if (response.status === 200) {
        console.log('hey texted')
        const audio = new Audio(URL.createObjectURL(response.data))
        audio.play()
        return { status: 200, audio }
      } else {
        return { status: 405, audio: 'some error' }
      }
    } catch (error) {
      return { status: 400, audio: error }
    }
  }

  useEffect(() => {
    if (
      messagesArray.length > 1 &&
      messagesArray[messagesArray.length - 1].role !== 'system'
    ) {
      handleChatRequest()
    }

    console.log('messagesarray', messagesArray)

    console.log('products are', products)
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
        console.log('result is', result)
        setProducts(result.result)
        let result1 = {
          role: 'user',
          content: null,
          result: result.result,
        }
        setMessagesArray((prevState) => [...prevState, result1])
        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      }
    } catch (error) {
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

export default ChatbotTest
