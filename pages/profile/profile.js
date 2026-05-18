const app = getApp()

Page({
  data: {
    userInfo: {},
    currentMood: {
      icon: '😊'
    },
    totalRecords: 0,
    streakDays: 0,
    positiveRate: 0,
    styleIndex: 0,
    styleOptions: ['温暖', '温柔', '简洁'],
    reminderEnabled: true,
    reminderTime: '20:00'
  },

  onShow() {
    this.loadUserData()
    this.calculateStats()
  },

  loadUserData() {
    const userInfo = app.globalData.userInfo || {}
    const preferences = app.globalData.userPreferences || {}
    
    const styleMap = { 'warm': 0, 'gentle': 1, 'concise': 2 }
    const styleIndex = styleMap[preferences.responseStyle] || 0

    this.setData({
      userInfo,
      styleIndex
    })
  },

  calculateStats() {
    const records = app.globalData.emotionHistory
    const totalRecords = records.length
    
    const positiveCount = records.filter(r => r.emotion && r.emotion.type === 'positive').length
    const positiveRate = totalRecords > 0 ? Math.round((positiveCount / totalRecords) * 100) : 0

    let streakDays = 0
    const today = new Date().toDateString()
    let checkDate = new Date()
    
    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toDateString()
      const hasRecord = records.some(r => 
        new Date(r.timestamp).toDateString() === dateStr
      )
      
      if (hasRecord || dateStr === today) {
        streakDays++
      } else {
        break
      }
      
      checkDate.setDate(checkDate.getDate() - 1)
    }

    const latestRecord = records[0]
    let moodIcon = '😊'
    if (latestRecord && latestRecord.emotion) {
      const moodMap = {
        'happy': '😄',
        'sad': '😢',
        'angry': '😠',
        'anxious': '😰',
        'calm': '😌',
        'surprise': '😮'
      }
      moodIcon = moodMap[latestRecord.emotion.dominant] || '😊'
    }

    this.setData({
      totalRecords,
      streakDays,
      positiveRate,
      currentMood: { icon: moodIcon }
    })
  },

  onStyleChange(e) {
    const index = parseInt(e.detail.value)
    const styles = ['warm', 'gentle', 'concise']
    
    app.globalData.userPreferences.responseStyle = styles[index]
    app.saveUserData()
    
    this.setData({ styleIndex: index })
    
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    })
  },

  onReminderToggle(e) {
    this.setData({ reminderEnabled: e.detail.value })
    
    if (e.detail.value) {
      wx.showToast({
        title: '已开启提醒',
        icon: 'success'
      })
    }
  },

  onTimeChange(e) {
    this.setData({ reminderTime: e.detail.value })
  },

  openTool(e) {
    const tool = e.currentTarget.dataset.tool
    
    const toolNames = {
      'breathing': '呼吸放松',
      'meditation': '冥想引导', 
      'affirmation': '积极暗示',
      'gratitude': '感恩日记'
    }
    
    wx.showModal({
      title: toolNames[tool],
      content: '该功能正在开发中，敬请期待！',
      showCancel: false
    })
  },

  contactSupport() {
    wx.makePhoneCall({
      phoneNumber: '400-161-9995'
    })
  },

  showAbout() {
    wx.showModal({
      title: '关于心语AI',
      content: '心语AI是一款基于人工智能的情绪分析与心理健康辅助工具。\n\n我们致力于：\n❤️ 帮助用户更好地了解自己的情绪\n❤️ 提供专业的共情回应\n❤️ 记录和追踪情绪变化\n❤️ 在需要时提供心理支持\n\n版本：v1.0.0',
      showCancel: false
    })
  },

  shareApp() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  clearData() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有记录数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          app.globalData.emotionHistory = []
          app.saveUserData()
          
          this.setData({
            totalRecords: 0,
            streakDays: 0,
            positiveRate: 0
          })
          
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '发现一款很棒的情绪记录小程序',
      path: '/pages/index/index'
    }
  }
})