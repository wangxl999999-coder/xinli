const emotionKeywords = {
  happy: ['开心', '高兴', '快乐', '愉快', '喜悦', '兴奋', '幸福', '满足', '欣喜', '舒畅', '爽', '赞', '棒', '好极了', '太棒了'],
  sad: ['难过', '伤心', '悲伤', '忧伤', '沮丧', '失落', '痛苦', '心痛', '难受', '低落', '郁闷', '哭', '流泪', '心碎'],
  angry: ['生气', '愤怒', '恼火', '气愤', '暴怒', '抓狂', '发火', '气死', '不爽', '烦', '讨厌', '可恨', '该死'],
  anxious: ['紧张', '焦虑', '不安', '担心', '害怕', '恐惧', '担忧', '忧虑', '心慌', '着急', '焦急', '忐忑'],
  calm: ['平静', '安静', '安宁', '宁静', '放松', '轻松', '淡定', '从容', '安稳', '平和'],
  surprise: ['惊讶', '吃惊', '意外', '震惊', '惊喜', '哇', '天啊', '不敢相信'],
  tired: ['累', '疲惫', '疲劳', '困', '乏', '没劲', '无力', '虚脱'],
  lonely: ['孤独', '寂寞', '孤单', '无聊', '空虚', '没人陪', '一个人']
}

const emotionWeights = {
  happy: 3,
  sad: -3,
  angry: -3,
  anxious: -2,
  calm: 1,
  surprise: 0,
  tired: -1,
  lonely: -2
}

function analyzeTextEmotion(text) {
  const result = {
    emotions: {},
    dominant: 'neutral',
    type: 'neutral',
    confidence: 0.5,
    keywords: []
  }

  let totalWeight = 0
  let matchCount = 0

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    let count = 0
    const matched = []
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'g')
      const matches = text.match(regex)
      if (matches) {
        count += matches.length
        matched.push(keyword)
      }
    })

    if (count > 0) {
      result.emotions[emotion] = count
      result.keywords.push(...matched)
      totalWeight += count * emotionWeights[emotion]
      matchCount += count
    }
  }

  if (matchCount > 0) {
    const sorted = Object.entries(result.emotions).sort((a, b) => b[1] - a[1])
    result.dominant = sorted[0][0]
    result.confidence = Math.min(0.95, 0.5 + matchCount * 0.05)
    
    if (totalWeight > 1) {
      result.type = 'positive'
    } else if (totalWeight < -1) {
      result.type = 'negative'
    } else {
      result.type = 'neutral'
    }
  }

  return result
}

function analyzeVoiceFeatures(audioData) {
  return {
    emotions: {
      happy: Math.random() * 0.3,
      sad: Math.random() * 0.3,
      angry: Math.random() * 0.3,
      anxious: Math.random() * 0.2,
      calm: Math.random() * 0.2
    },
    dominant: 'neutral',
    type: 'neutral',
    confidence: 0.6,
    features: {
      speechRate: audioData.duration / audioData.length,
      volume: audioData.volume || 0.5,
      pitch: audioData.pitch || 0.5
    }
  }
}

function analyzeFaceExpression(faceData) {
  const expressions = {
    happy: faceData.smile || 0,
    sad: faceData.frown || 0,
    angry: faceData.eyebrowRaise || 0,
    surprise: faceData.mouthOpen || 0,
    neutral: 0.3
  }

  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1])
  const dominant = sorted[0][0]
  const confidence = sorted[0][1]

  let type = 'neutral'
  if (['happy', 'surprise'].includes(dominant) && confidence > 0.4) {
    type = 'positive'
  } else if (['sad', 'angry'].includes(dominant) && confidence > 0.4) {
    type = 'negative'
  }

  return {
    emotions: expressions,
    dominant,
    type,
    confidence: Math.min(0.9, confidence),
    features: faceData
  }
}

function detectExtremeEmotion(analysis) {
  const extremeThreshold = 0.8
  const extremeEmotions = ['sad', 'angry', 'anxious']
  
  for (const emotion of extremeEmotions) {
    if (analysis.emotions[emotion] >= extremeThreshold || 
        (analysis.dominant === emotion && analysis.confidence >= extremeThreshold)) {
      return {
        isExtreme: true,
        emotion,
        severity: analysis.confidence,
        suggestion: '检测到您可能处于极端情绪状态，建议您寻求专业心理咨询师的帮助'
      }
    }
  }

  return { isExtreme: false }
}

module.exports = {
  analyzeTextEmotion,
  analyzeVoiceFeatures,
  analyzeFaceExpression,
  detectExtremeEmotion
}