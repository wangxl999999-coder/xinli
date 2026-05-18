function generatePieChartData(emotionStats) {
  const colors = {
    positive: '#00b894',
    negative: '#e17055',
    neutral: '#74b9ff',
    happy: '#fdcb6e',
    sad: '#6c5ce7',
    angry: '#d63031',
    anxious: '#0984e3',
    calm: '#00cec9'
  }

  const data = []
  let total = 0

  for (const [type, count] of Object.entries(emotionStats.byType || {})) {
    total += count
    data.push({
      name: getEmotionName(type),
      value: count,
      color: colors[type] || '#999'
    })
  }

  return {
    data,
    total,
    title: '情绪分布'
  }
}

function generateLineChartData(emotionStats, days = 7) {
  const daysArray = getLastDays(days)
  const datasets = [
    { name: '积极情绪', color: '#00b894', data: [] },
    { name: '消极情绪', color: '#e17055', data: [] },
    { name: '中性情绪', color: '#74b9ff', data: [] }
  ]

  daysArray.forEach(day => {
    const dayData = emotionStats.byDay && emotionStats.byDay[day] ? emotionStats.byDay[day] : { positive: 0, negative: 0, neutral: 0 }
    datasets[0].data.push(dayData.positive || 0)
    datasets[1].data.push(dayData.negative || 0)
    datasets[2].data.push(dayData.neutral || 0)
  })

  return {
    labels: daysArray.map(d => d.slice(5)),
    datasets,
    title: `${days}天情绪趋势`
  }
}

function getLastDays(days) {
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    result.push(date.toLocaleDateString())
  }
  return result
}

function getEmotionName(type) {
  const names = {
    positive: '积极情绪',
    negative: '消极情绪',
    neutral: '中性情绪',
    happy: '开心',
    sad: '悲伤',
    angry: '愤怒',
    anxious: '焦虑',
    calm: '平静',
    surprise: '惊讶',
    tired: '疲惫',
    lonely: '孤独'
  }
  return names[type] || type
}

function getEmotionIcon(type) {
  const icons = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    calm: '😌',
    surprise: '😮',
    tired: '😴',
    lonely: '😔',
    neutral: '😐',
    positive: '😄',
    negative: '😞'
  }
  return icons[type] || '😶'
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  
  return date.toLocaleDateString()
}

function calculateMoodScore(emotionHistory) {
  if (!emotionHistory || emotionHistory.length === 0) return 50
  
  const scores = {
    positive: 2,
    neutral: 0,
    negative: -2
  }
  
  let total = 0
  let count = 0
  
  emotionHistory.forEach(record => {
    if (record.emotion && record.emotion.type) {
      total += scores[record.emotion.type] || 0
      count++
    }
  })
  
  const avg = count > 0 ? total / count : 0
  return Math.max(0, Math.min(100, 50 + avg * 10))
}

module.exports = {
  generatePieChartData,
  generateLineChartData,
  getEmotionName,
  getEmotionIcon,
  formatDate,
  calculateMoodScore
}