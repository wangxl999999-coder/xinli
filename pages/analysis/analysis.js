const app = getApp()

Page({
  data: {
    currentPeriod: '7',
    stats: {
      total: 0,
      byType: {},
      byDay: {}
    },
    pieData: [],
    trendData: {
      positive: [0.3, 0.5, 0.4, 0.6, 0.5, 0.7, 0.6],
      negative: [0.2, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1]
    },
    chartLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    positivePercent: 0,
    negativePercent: 0,
    insights: {
      trend: '情绪整体保持稳定，偶尔有波动',
      mainEmotion: '平静是最常出现的情绪',
      suggestion: '继续保持良好的心态，建议每天记录情绪以获得更准确的分析'
    }
  },

  onShow() {
    this.loadStats()
  },

  setPeriod(e) {
    const period = e.currentTarget.dataset.period
    this.setData({ currentPeriod: period })
    this.loadStats()
  },

  loadStats() {
    const days = parseInt(this.data.currentPeriod)
    const stats = app.getEmotionStats(days)

    const positiveCount = stats.byType.positive || 0
    const negativeCount = stats.byType.negative || 0
    const total = stats.total || 1

    const positivePercent = Math.round((positiveCount / total) * 100)
    const negativePercent = Math.round((negativeCount / total) * 100)

    const pieData = [
      { name: '积极情绪', value: positiveCount, color: '#00b894' },
      { name: '消极情绪', value: negativeCount, color: '#e17055' },
      { name: '中性情绪', value: stats.total - positiveCount - negativeCount, color: '#74b9ff' }
    ].filter(item => item.value > 0)

    const insights = this.generateInsights(stats)
    
    const trendData = this.generateTrendData(stats, days)
    const chartLabels = this.generateChartLabels(days)

    this.setData({
      stats,
      positivePercent,
      negativePercent,
      pieData,
      insights,
      trendData,
      chartLabels
    })
  },

  generateTrendData(stats, days) {
    const daysArray = this.getLastDays(days)
    const positive = []
    const negative = []
    
    daysArray.forEach(day => {
      const dayData = stats.byDay && stats.byDay[day] ? stats.byDay[day] : { positive: 0, negative: 0, neutral: 0 }
      const dayTotal = (dayData.positive || 0) + (dayData.negative || 0) + (dayData.neutral || 0)
      if (dayTotal > 0) {
        positive.push(Math.min(90, Math.max(10, ((dayData.positive || 0) / dayTotal) * 80 + 10)))
        negative.push(Math.min(90, Math.max(10, ((dayData.negative || 0) / dayTotal) * 80 + 10)))
      } else {
        positive.push(10)
        negative.push(10)
      }
    })
    
    return { positive, negative }
  },

  generateChartLabels(days) {
    return this.getLastDays(days).map(d => d.slice(5))
  },

  getLastDays(days) {
    const result = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      result.push(date.toLocaleDateString())
    }
    return result
  },

  generateInsights(stats) {
    const positive = stats.byType.positive || 0
    const negative = stats.byType.negative || 0
    const total = stats.total || 1

    let trend = '情绪整体保持稳定'
    let mainEmotion = '记录较少，无法判断主要情绪'
    let suggestion = '建议每天记录情绪，坚持一段时间后可以获得更准确的分析'

    if (total > 5) {
      if (positive > negative * 2) {
        trend = '近期情绪非常积极，继续保持！'
        mainEmotion = '积极情绪占主导地位'
        suggestion = '你的心态非常好，继续保持这种积极乐观的态度'
      } else if (negative > positive * 2) {
        trend = '近期消极情绪较多，需要注意调节'
        mainEmotion = '消极情绪出现频率较高'
        suggestion = '建议多进行放松活动，与朋友倾诉，必要时寻求专业帮助'
      } else {
        trend = '情绪有波动，整体趋于平稳'
        mainEmotion = '积极与消极情绪相对平衡'
        suggestion = '保持良好的生活习惯，注意情绪的及时调节'
      }
    }

    return { trend, mainEmotion, suggestion }
  },

  goToRecord() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})