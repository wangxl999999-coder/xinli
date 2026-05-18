const app = getApp()
const chartHelper = require('../../utils/chartHelper.js')

Page({
  data: {
    records: [],
    filteredRecords: [],
    currentFilter: 'all'
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    const records = app.globalData.emotionHistory.map(record => ({
      ...record,
      formattedTime: chartHelper.formatDate(record.timestamp)
    }))

    this.setData({ records })
    this.applyFilter()
  },

  setFilter(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ currentFilter: filter })
    this.applyFilter()
  },

  applyFilter() {
    const { records, currentFilter } = this.data
    
    let filtered = records
    if (currentFilter !== 'all') {
      filtered = records.filter(r => r.type === currentFilter)
    }

    this.setData({ filteredRecords: filtered })
  },

  getTypeIcon(type) {
    const icons = {
      text: '✍️',
      voice: '🎤',
      face: '😊'
    }
    return icons[type] || '📝'
  },

  getTypeLabel(type) {
    const labels = {
      text: '文字记录',
      voice: '语音记录',
      face: '表情记录'
    }
    return labels[type] || '记录'
  },

  getEmotionIcon(dominant) {
    return chartHelper.getEmotionIcon(dominant)
  },

  getEmotionName(dominant) {
    return chartHelper.getEmotionName(dominant)
  },

  getTypeName(type) {
    const names = {
      positive: '积极情绪',
      negative: '消极情绪',
      neutral: '中性情绪'
    }
    return names[type] || '中性情绪'
  },

  viewRecord(e) {
    const record = e.currentTarget.dataset.record
    
    wx.showModal({
      title: '情绪记录详情',
      content: `记录类型: ${this.getTypeLabel(record.type)}\n识别情绪: ${this.getEmotionName(record.emotion.dominant)}\n置信度: ${(record.emotion.confidence * 100).toFixed(0)}%\n\nAI回应: ${record.response}`,
      showCancel: false
    })
  },

  goToRecord() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})