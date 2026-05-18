const app = getApp()
const emotionAnalyzer = require('../../utils/emotionAnalyzer.js')
const empathyEngine = require('../../utils/empathyEngine.js')
const chartHelper = require('../../utils/chartHelper.js')

Page({
  data: {
    inputText: '',
    isAnalyzing: false,
    analysisResult: null,
    empathyResponse: '',
    emotionIcon: '😶',
    emotionName: '等待分析',
    typeName: '中性',
    extremeAlert: { isExtreme: false },
    quickPhrases: [
      '今天很开心',
      '感觉有点累',
      '心情很糟糕',
      '有点焦虑',
      '内心很平静',
      '感到很孤独',
      '特别生气',
      '感到惊喜',
      '压力很大',
      '充满希望'
    ]
  },

  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  selectPhrase(e) {
    const phrase = e.currentTarget.dataset.phrase
    this.setData({
      inputText: phrase
    })
  },

  analyzeEmotion() {
    if (!this.data.inputText.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    this.setData({ isAnalyzing: true })

    setTimeout(() => {
      const analysis = emotionAnalyzer.analyzeTextEmotion(this.data.inputText)
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
        isAnalyzing: false
      })
    }, 1000)
  },

  saveRecord() {
    if (!this.data.analysisResult) return

    const record = {
      type: 'text',
      content: this.data.inputText,
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
        inputText: '',
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
      title: '我用心语AI分析了情绪，你也来试试吧！',
      path: '/pages/index/index'
    }
  }
})