const app = getApp()
const emotionAnalyzer = require('../../utils/emotionAnalyzer.js')
const empathyEngine = require('../../utils/empathyEngine.js')
const chartHelper = require('../../utils/chartHelper.js')

Page({
  data: {
    isRecording: false,
    recordingDuration: 0,
    audioRecorded: false,
    audioDuration: 0,
    isPlaying: false,
    playProgress: 0,
    isAnalyzing: false,
    analysisResult: null,
    empathyResponse: '',
    emotionIcon: '😶',
    emotionName: '等待分析',
    typeName: '中性',
    extremeAlert: { isExtreme: false },
    waveBars: [20, 30, 50, 40, 60, 35, 45, 25, 55, 30]
  },

  recorderManager: null,
  innerAudioContext: null,
  recordingTimer: null,
  playTimer: null,
  waveTimer: null,

  onLoad() {
    this.recorderManager = wx.getRecorderManager()
    this.innerAudioContext = wx.createInnerAudioContext()

    this.recorderManager.onStop((res) => {
      console.log('录音停止', res)
      this.audioPath = res.tempFilePath
      this.setData({
        audioRecorded: true,
        audioDuration: res.duration
      })
      wx.showToast({
        title: '录音完成',
        icon: 'success'
      })
    })

    this.recorderManager.onError((err) => {
      console.error('录音错误', err)
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      })
      this.setData({ isRecording: false })
    })

    this.innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false, playProgress: 0 })
      clearInterval(this.playTimer)
    })

    this.innerAudioContext.onError((err) => {
      console.error('播放错误', err)
      this.setData({ isPlaying: false })
    })
  },

  toggleRecording() {
    console.log('点击录音按钮', this.data.isRecording)
    if (this.data.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  },

  startRecording() {
    console.log('开始录音')
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              console.log('授权成功')
              this.doRecord()
            },
            fail: () => {
              console.log('授权失败')
              wx.showModal({
                title: '需要录音权限',
                content: '请在设置中开启录音权限，以便进行语音情绪分析',
                showCancel: false
              })
            }
          })
        } else {
          this.doRecord()
        }
      }
    })
  },

  doRecord() {
    this.recorderManager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    })

    this.setData({
      isRecording: true,
      recordingDuration: 0,
      audioRecorded: false,
      analysisResult: null
    })

    this.recordingTimer = setInterval(() => {
      this.setData({
        recordingDuration: this.data.recordingDuration + 1
      })
    }, 1000)

    this.startWaveAnimation()
  },

  stopRecording() {
    console.log('停止录音')
    this.recorderManager.stop()
    this.setData({ isRecording: false })
    clearInterval(this.recordingTimer)
    this.stopWaveAnimation()
  },

  startWaveAnimation() {
    this.waveTimer = setInterval(() => {
      const bars = this.data.waveBars.map(() => Math.floor(Math.random() * 60) + 20)
      this.setData({ waveBars: bars })
    }, 200)
  },

  stopWaveAnimation() {
    clearInterval(this.waveTimer)
    this.setData({
      waveBars: [20, 30, 50, 40, 60, 35, 45, 25, 55, 30]
    })
  },

  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  playAudio() {
    if (this.data.isPlaying) {
      this.innerAudioContext.pause()
      this.setData({ isPlaying: false })
      clearInterval(this.playTimer)
    } else {
      this.innerAudioContext.src = this.audioPath
      this.innerAudioContext.play()
      this.setData({ isPlaying: true })

      let progress = 0
      const duration = this.data.audioDuration / 1000
      this.playTimer = setInterval(() => {
        progress += 1
        const percent = Math.min(100, (progress / duration) * 100)
        this.setData({ playProgress: percent })
      }, 1000)
    }
  },

  reRecord() {
    this.setData({
      audioRecorded: false,
      analysisResult: null
    })
    this.audioPath = null
  },

  analyzeVoice() {
    this.setData({ isAnalyzing: true })

    setTimeout(() => {
      const mockAudioData = {
        duration: this.data.audioDuration,
        length: 1000,
        volume: Math.random() * 0.5 + 0.3,
        pitch: Math.random() * 0.5 + 0.3
      }

      const analysis = emotionAnalyzer.analyzeVoiceFeatures(mockAudioData)
      
      const emotionTypes = ['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral']
      analysis.dominant = emotionTypes[Math.floor(Math.random() * emotionTypes.length)]
      analysis.type = ['happy', 'calm'].includes(analysis.dominant) ? 'positive' : 
                     ['sad', 'angry', 'anxious'].includes(analysis.dominant) ? 'negative' : 'neutral'
      analysis.confidence = Math.random() * 0.3 + 0.6

      const response = empathyEngine.generateResponse(
        analysis,
        app.globalData.userPreferences.responseStyle,
        app.globalData.emotionHistory
      )

      const extremeAlert = emotionAnalyzer.detectExtremeEmotion(analysis)

      this.setData({
        analysisResult: analysis,
        empathyResponse: response,
        emotionIcon: chartHelper.getEmotionIcon(analysis.dominant),
        emotionName: chartHelper.getEmotionName(analysis.dominant),
        typeName: analysis.type === 'positive' ? '积极情绪' : 
                  analysis.type === 'negative' ? '消极情绪' : '中性情绪',
        extremeAlert: extremeAlert,
        confidencePercent: Math.round(analysis.confidence * 100),
        isAnalyzing: false
      })
    }, 1500)
  },

  getSpeedLabel(rate) {
    if (rate < 0.3) return '慢'
    if (rate < 0.6) return '适中'
    return '快'
  },

  getVolumeLabel(volume) {
    if (volume < 0.3) return '低'
    if (volume < 0.6) return '适中'
    return '高'
  },

  getPitchLabel(pitch) {
    if (pitch < 0.3) return '低沉'
    if (pitch < 0.6) return '适中'
    return '高亢'
  },

  saveRecord() {
    if (!this.data.analysisResult) return

    const record = {
      type: 'voice',
      content: '语音记录',
      emotion: this.data.analysisResult,
      response: this.data.empathyResponse,
      timestamp: new Date().toISOString()
    }

    app.addEmotionRecord(record)

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    setTimeout(() => {
      this.setData({
        audioRecorded: false,
        analysisResult: null,
        empathyResponse: ''
      })
    }, 1500)
  },

  shareResult() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  contactConsultant() {
    wx.showModal({
      title: '联系心理咨询师',
      content: '我们可以为您推荐专业的心理咨询师。是否立即拨打心理援助热线？',
      confirmText: '拨打热线',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-161-9995'
          })
        }
      }
    })
  },

  onUnload() {
    clearInterval(this.recordingTimer)
    clearInterval(this.playTimer)
    clearInterval(this.waveTimer)
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
  },

  onShareAppMessage() {
    return {
      title: '我用心语AI分析了语音情绪，你也来试试吧！',
      path: '/pages/index/index'
    }
  }
})
