import React, { useState, useEffect, useRef } from 'react'
// import { AudioRecorder } from 'react-audio-voice-recorder'
import axios from 'axios'
import Cookies from 'js-cookie'

const base = 'https://justvoicebackend-vrtx.vercel.app'

// roles
const botRolePairProgrammer =
  'You are an expert pair programmer helping build an AI bot application with the OpenAI ChatGPT and Whisper APIs. The software is a web application built with NextJS with serverless functions, React functional components using TypeScript.'

// personalities
const quirky = ''

// brevitie
const briefBrevity = 'Your responses are always 1 to 2 sentences.'

// dials
const role = botRolePairProgrammer
const personality = quirky
const brevity = briefBrevity

// FULL BOT CONTEXT
const botContext = `${role} ${personality} ${brevity}`
const defaultContextSchema = {
  role: 'system',
  content: botContext,
}

const StockQuote = () => {
  const [messagesArray, setMessagesArray] = useState([defaultContextSchema])
  const [showProducts, setShowProducts] = useState(false)
  const [products, setProducts] = useState([])
  const [prompt, setPrompt] = useState('')

  const requestVoice = async (textInput) => {
    let voiceid = '21m00Tcm4TlvDq8ikWAM'

    const baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech'
    const headers = {
      'Content-Type': 'application/json',
      'xi-api-key': '64f7c0ea93b15d001f8984b645c07075',
    }

    const requestBody = {
      text: textInput,
      model_id: 'eleven_monolingual_v1',
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
        conversationId: '64c521466d43591c2157116f',
        textInput: messagesArray[messagesArray.length - 1].content,
        newConvo: false,
      }

      const apiUrl = base + '/api/chatgpt/openai'

      const response = await axios.post(apiUrl, {
        input: obj,
        summary: aisummary,
      })

      let { result, summary } = await response.data

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
        setShowProducts(true)
        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  //  const handleAudioRecordingComplete = async (audioBlob) => {
  //    try {
  //      const formData = new FormData()
  //      formData.append('file', audioBlob, 'audio.wav')
  //      formData.append('model', 'whisper-1')

  //      const response = await fetch('/api/voicechat', {
  //        method: 'POST',
  //        body: formData,
  //      })

  //      if (response.ok) {
  //        console.log('Audio sent to the API successfully.')
  //        const { text, error } = await response.json()
  //        updateMessagesArray(text)

  //        console.log('response', text, error)
  //      } else {
  //        console.error('Failed to send audio to the API.')
  //      }
  //    } catch (error) {
  //      console.error('Error sending audio to the API:', error)
  //    }
  //  }

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
    <div className="chat-container">
      <div className="chat-head">
        <h1>Chatbot</h1>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="message-body">
          {messagesArray.map((message, index) => (
            <>
              {message.content ? (
                <div
                  key={index}
                  className={`p-2 max-w-[400px] ${
                    message.role === 'user'
                      ? 'bg-blue-200 -ml-2'
                      : 'bg-green-200 self-end'
                  } rounded`}
                >
                  <p
                    className={`msg-body ${
                      message.role === 'user'
                        ? 'text-blue-800'
                        : 'text-green-800'
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 px-5">
                  {products &&
                    products.map((product) => (
                      <div>
                        <img
                          src={product.image}
                          className="w-[150px]"
                          alt={product.name}
                        />
                      </div>
                    ))}
                </div>
              )}
            </>
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
        {/* <AudioRecorder
          onRecordingComplete={(audioBlob) =>
            handleAudioRecordingComplete(audioBlob)
          }
        /> */}
      </div>
    </div>
  )
}

export default StockQuote
