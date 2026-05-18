App({
  globalData: {
    userInfo: null,
    emotionHistory: [],
    userPreferences: {
      responseStyle: 'warm',
      languageLevel: 'standard'
    }
  },

  onLaunch() {
    this.loadUserData()
    this.initEmotionDatabase()
  },

  loadUserData() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      const emotionHistory = wx.getStorageSync('emotionHistory')
      const userPreferences = wx.getStorageSync('userPreferences')
      
      if (userInfo) this.globalData.userInfo = userInfo
      if (emotionHistory) this.globalData.emotionHistory = emotionHistory
      if (userPreferences) this.globalData.userPreferences = userPreferences
    } catch (e) {
      console.error('加载用户数据失败', e)
    }
  },

  saveUserData() {
    try {
      wx.setStorageSync('userInfo', this.globalData.userInfo)
      wx.setStorageSync('emotionHistory', this.globalData.emotionHistory)
      wx.setStorageSync('userPreferences', this.globalData.userPreferences)
    } catch (e) {
      console.error('保存用户数据失败', e)
    }
  },

  initEmotionDatabase() {
    const emotions = {
      positive: ['开心', '兴奋', '满足', '感激', '平静', '愉悦', '希望', '骄傲'],
      negative: ['悲伤', '愤怒', '焦虑', '恐惧', '愧疚', '羞耻', '失望', '孤独'],
      neutral: ['平静', '无聊', '疲惫', '困惑', '惊讶']
    }
    this.globalData.emotionDatabase = emotions
  },

  addEmotionRecord(record) {
    record.id = Date.now()
    record.timestamp = new Date().toISOString()
    this.globalData.emotionHistory.unshift(record)
    if (this.globalData.emotionHistory.length > 100) {
      this.globalData.emotionHistory.pop()
    }
    this.saveUserData()
    return record
  },

  getEmotionStats(days = 7) {
    const now = Date.now()
    const cutoff = now - days * 24 * 60 * 60 * 1000
    const recent = this.globalData.emotionHistory.filter(r => new Date(r.timestamp).getTime() > cutoff)
    
    const stats = {
      total: recent.length,
      byType: {},
      byDay: {},
      trend: []
    }

    recent.forEach(record => {
      const type = record.emotion.type || 'neutral'
      stats.byType[type] = (stats.byType[type] || 0) + 1
      
      const day = new Date(record.timestamp).toLocaleDateString()
      stats.byDay[day] = stats.byDay[day] || { positive: 0, negative: 0, neutral: 0 }
      stats.byDay[day][type]++
    })

    return stats
  }
})