const app = getApp()
const emotionAnalyzer = require('../../utils/emotionAnalyzer.js')
const empathyEngine = require('../../utils/empathyEngine.js')
const chartHelper = require('../../utils/chartHelper.js')

Page({
  data: {
    capturedImage: '',
    isAnalyzing: false,
    analysisResult: null,
    empathyResponse: '',
    emotionIcon: '😶',
    emotionName: '等待分析',
    typeName: '中性',
    extremeAlert: { isExtreme: false },
    breakdownData: []
  },

  takePhoto() {
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
          quality: 'high',
          success: (res) => {
            this.setData({
              capturedImage: res.tempImagePath
            })
            wx.showToast({
              title: '拍摄成功',
              icon: 'success'
            })
          },
          fail: () => {
            wx.showToast({
              title: '拍摄失败，请重试',
              icon: 'none'
            })
          }
        })
      },
      fail: () => {
        wx.showModal({
          title: '需要相机权限',
          content: '请在设置中开启相机权限，以便进行面部表情分析',
          showCancel: false
        })
      }
    })
  },

  retakePhoto() {
    this.setData({
      capturedImage: '',
      analysisResult: null
    })
  },

  analyzeFace() {
    if (!this.data.capturedImage) return

    this.setData({ isAnalyzing: true })

    setTimeout(() => {
      const mockFaceData = {
        smile: Math.random() * 0.6,
        frown: Math.random() * 0.3,
        eyebrowRaise: Math.random() * 0.2,
        mouthOpen: Math.random() * 0.4
      }

      const analysis = emotionAnalyzer.analyzeFaceExpression(mockFaceData)
      
      const emotionTypes = ['happy', 'sad', 'angry', 'anxious', 'calm', 'surprise', 'neutral']
      analysis.dominant = emotionTypes[Math.floor(Math.random() * emotionTypes.length)]
      analysis.type = ['happy', 'surprise', 'calm'].includes(analysis.dominant) ? 'positive' : 
                     ['sad', 'angry', 'anxious'].includes(analysis.dominant) ? 'negative' : 'neutral'
      analysis.confidence = Math.random() * 0.3 + 0.6

      const response = empathyEngine.generateResponse(
        analysis,
        app.globalData.userPreferences.responseStyle,
        app.globalData.emotionHistory
      )

      const extremeAlert = emotionAnalyzer.detectExtremeEmotion(analysis)

      const breakdownData = [
        { name: '开心', value: analysis.emotions.happy || 0.1, percent: Math.round((analysis.emotions.happy || 0.1) * 100), color: '#fdcb6e' },
        { name: '悲伤', value: analysis.emotions.sad || 0.1, percent: Math.round((analysis.emotions.sad || 0.1) * 100), color: '#6c5ce7' },
        { name: '愤怒', value: analysis.emotions.angry || 0.1, percent: Math.round((analysis.emotions.angry || 0.1) * 100), color: '#d63031' },
        { name: '惊讶', value: analysis.emotions.surprise || 0.1, percent: Math.round((analysis.emotions.surprise || 0.1) * 100), color: '#74b9ff' },
        { name: '平静', value: analysis.emotions.neutral || 0.1, percent: Math.round((analysis.emotions.neutral || 0.1) * 100), color: '#00b894' }
      ]

      this.setData({
        analysisResult: analysis,
        empathyResponse: response,
        emotionIcon: chartHelper.getEmotionIcon(analysis.dominant),
        emotionName: chartHelper.getEmotionName(analysis.dominant),
        typeName: analysis.type === 'positive' ? '积极情绪' : 
                  analysis.type === 'negative' ? '消极情绪' : '中性情绪',
        extremeAlert: extremeAlert,
        breakdownData: breakdownData,
        confidencePercent: Math.round(analysis.confidence * 100),
        isAnalyzing: false
      })
    }, 1500)
  },

  onCameraError(e) {
    console.error('相机错误:', e.detail)
    wx.showModal({
      title: '相机启动失败',
      content: '无法启动相机，请检查相机权限是否已开启',
      showCancel: false
    })
  },

  saveRecord() {
    if (!this.data.analysisResult) return

    const record = {
      type: 'face',
      content: '面部表情记录',
      emotion: this.data.analysisResult,
      response: this.data.empathyResponse
    }

    app.addEmotionRecord(record)

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    setTimeout(() => {
      this.setData({
        capturedImage: '',
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

  onShareAppMessage() {
    return {
      title: '我用心语AI分析了面部表情，你也来试试吧！',
      path: '/pages/index/index'
    }
  }
})