import { useState, useCallback } from 'react'

const useAudioRecorder = (
  audioTrackConstraints,
  onNotAllowedOrFound,
  mediaRecorderOptions
) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState()
  const [timerInterval, setTimerInterval] = useState()
  const [recordingBlob, setRecordingBlob] = useState()

  const _startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1)
    }, 1000)
    setTimerInterval(interval)
  }, [setRecordingTime, setTimerInterval])

  const _stopTimer = useCallback(() => {
    if (timerInterval != null) clearInterval(timerInterval)
    setTimerInterval(undefined)
  }, [timerInterval, setTimerInterval])

  const startRecording = useCallback(() => {
    if (timerInterval != null) return

    navigator.mediaDevices
      .getUserMedia({ audio: audioTrackConstraints ?? true })
      .then((stream) => {
        setIsRecording(true)
        const recorder = new MediaRecorder(stream, mediaRecorderOptions)
        setMediaRecorder(recorder)
        recorder.start()
        _startTimer()

        recorder.addEventListener('dataavailable', (event) => {
          setRecordingBlob(event.data)
          recorder.stream.getTracks().forEach((t) => t.stop())
          setMediaRecorder(undefined)
        })
      })
      .catch((err) => {
        console.log(err.name, err.message, err.cause)
        onNotAllowedOrFound?.(err)
      })
  }, [
    timerInterval,
    setIsRecording,
    setMediaRecorder,
    _startTimer,
    setRecordingBlob,
    onNotAllowedOrFound,
    mediaRecorderOptions,
  ])

  const stopRecording = useCallback(() => {
    mediaRecorder?.stop()
    _stopTimer()
    setRecordingTime(0)
    setIsRecording(false)
    setIsPaused(false)
  }, [mediaRecorder, setRecordingTime, setIsRecording, setIsPaused, _stopTimer])

  const togglePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false)
      mediaRecorder?.resume()
      _startTimer()
    } else {
      setIsPaused(true)
      _stopTimer()
      mediaRecorder?.pause()
    }
  }, [mediaRecorder, setIsPaused, _startTimer, _stopTimer])

  return {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  }
}

export default useAudioRecorder
