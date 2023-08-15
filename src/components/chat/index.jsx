import React, { useEffect, useState } from 'react'
import ChatButton from './chat-button'
import Header from './header'
import Input from './input'
import Body from './body'
import axios from 'axios'

import Alert from './alert'
import Cookies from 'js-cookie'

import { BsFillMicMuteFill } from 'react-icons/bs'
import useAudioRecorder from '../../hooks/recordAudio'

// const base = 'http://localhost:3000'
const base = 'https://justvoicebackend-vrtx.vercel.app'

const ChatWidget = ({ siteURL, lang }) => {
  let urdu =
    'میں یہاں آپ کے سوالات میں مدد کرنے کے لئے نانی ڈاٹ پی کے اے آئی اسسٹنٹ ہوں. آپ مجھ سے ہماری مصنوعات اور خدمات کے بارے میں کچھ پوچھ سکتے ہیں.'
  let content =
    lang === 'urdu'
      ? urdu
      : `I am an AI Assistant of ${siteURL}  here to help you with your queries. You can ask me anything about our products and services.`
  let defaultContextSchema = {
    role: 'system',
    content: content,
  }
  const [chatOpen, setChatOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [prompt, setPrompt] = useState('')

  const [messagesArray, setMessagesArray] = useState([defaultContextSchema])

  const toggleChat = () => {
    setChatOpen(!chatOpen)
  }
  useEffect(() => {
    console.log(chatOpen)
  }, [chatOpen])

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

      let newbase = 'http://localhost:3000'
      let suffixURL = lang == 'ur' ? '/api/gcloud/gtest2' : '/api/voicechat'
      let voiceapi = base + suffixURL
      // let voiceapi = newbase + '/api/gcloud/gtest2'

      const response = await fetch(voiceapi, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { text } = await response.json()
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
    let voiceId = lang=='en' ? "" : ""

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          text: textInput,
          voiceId:
            lang == 'ur' ? 'IKne3meq5aSn9XLyUdCD' : 'EXAVITQu4vr4xnSDxMaL',
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
        conversationId: Cookies.get('convoId') ? Cookies.get('convoId') : '1234',
        textInput: messagesArray[messagesArray.length - 1].content,
        siteURL: siteURL,
      }

      const apiUrl = base + '/api/chatgpt/openai'

      const response = await axios.post(apiUrl, {
        input: obj,
        summary: aisummary,
      })

      let { result, summary, convoId } = await response.data
      if (obj.conversationId.length < 5) {
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
      let urdu ='معذرت، میں آپ کے سوال کو سمجھنے کے قابل نہیں ہوں۔ دوبارہ کوشش کریں.'
      const result = {
        role: 'system',
        content:
           lang=='en'? "Sorry, I am not able to understand your query. Please try again.":urdu,
      }

      setMessagesArray((prevState) => [...prevState, result])
      await requestVoice(result.content)

      console.error('Error:', error)
    }
  }

  const handleTextSubmit = (prompt) => {
    if (prompt == '') {
      alert('no input')
      return
    } else {
      updateMessagesArray(prompt)
      setPrompt('')
    }
  }

  return (
    <div className="justvoice__widget">
      <div
        className={`justvoice__chatBtn ${
          chatOpen ? 'justvoice__chatBtn__open' : 'justvoice__chatBtn__close'
        }`}
      >
        <ChatButton
          prompt={prompt}
          handleTextSubmit={handleTextSubmit}
          toggleChat={toggleChat}
          chatOpen={chatOpen}
        />
      </div>
      <div
        className={`${
          chatOpen
            ? 'justvoice__chat__size__open'
            : 'justvoice__chat__size__close'
        } justvoice__chat__main`}
      >
        <Header toggleChat={toggleChat} />
        <div className="justvoice__chat__x2b3f5h9c8">
          <Body messages={messagesArray} />
        </div>
        <Input
          prompt={prompt}
          setPrompt={setPrompt}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          isRecording={isRecording}
        />
      </div>
    </div>
  )
}

export default ChatWidget
