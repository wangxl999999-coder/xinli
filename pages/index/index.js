const app = getApp()
const chartHelper = require('../../utils/chartHelper.js')

Page({
  data: {
    moodScore: 50,
    todayRecords: [],
    emotionIcons: {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '😌',
      surprise: '😮',
      tired: '😴',
      lonely: '😔',
      neutral: '😐'
    },
    dailyTip: ''
  },

  onLoad() {
    this.loadDailyTip()
  },

  onShow() {
    this.loadTodayRecords()
    this.calculateMoodScore()
  },

  loadDailyTip() {
    const tips = [
      '深呼吸是缓解焦虑最简单有效的方法，试着吸气4秒，屏息4秒，呼气4秒。',
      '每天记录三件感恩的小事，可以显著提升幸福感。',
      '运动能释放内啡肽，哪怕只是10分钟的散步也能改善心情。',
      '充足的睡眠是情绪稳定的基础，建议每晚保持7-8小时睡眠。',
      '与人连接是对抗孤独的良药，今天给亲友发个问候吧。',
      '接纳自己的情绪，无论是快乐还是悲伤，都是正常的体验。',
      '写日记是梳理思绪的好方式，把烦恼写下来，它们会变得更容易处理。',
      '专注于当下，正念冥想能帮助你从焦虑的思绪中解脱出来。'
    ]
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    this.setData({ dailyTip: randomTip })
  },

  loadTodayRecords() {
    const today = new Date().toLocaleDateString()
    const records = app.globalData.emotionHistory.filter(r => {
      return new Date(r.timestamp).toLocaleDateString() === today
    })

    records.forEach(r => {
      r.formattedTime = chartHelper.formatDate(r.timestamp)
    })

    this.setData({ todayRecords: records })
  },

  calculateMoodScore() {
    const score = chartHelper.calculateMoodScore(app.globalData.emotionHistory)
    this.setData({ moodScore: Math.round(score) })
  },

  goToTextAnalysis() {
    wx.navigateTo({
      url: '/pages/emotion/text'
    })
  },

  goToVoiceAnalysis() {
    wx.navigateTo({
      url: '/pages/emotion/voice'
    })
  },

  goToFaceAnalysis() {
    wx.navigateTo({
      url: '/pages/emotion/face'
    })
  }
})