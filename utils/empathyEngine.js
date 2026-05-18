const responseTemplates = {
  happy: {
    warm: [
      "听起来你今天心情很不错！真为你感到开心，是什么好事让你这么开心呀？",
      "哇，感受到你的喜悦了！能分享一下是什么让你这么开心吗？",
      "太棒了！你的好心情也感染到我了，继续保持这份快乐哦！"
    ],
    gentle: [
      "真好，能感受到你的愉悦，愿这份好心情一直伴随着你。",
      "嗯，听得出你心情不错，愿你今天一切顺利。",
      "看到你开心我也很开心，希望这份快乐能持续下去。"
    ],
    concise: [
      "开心就好！",
      "很棒！",
      "不错哦！"
    ]
  },
  sad: {
    warm: [
      "我能感受到你的难过，想哭就哭出来吧，我会一直陪着你的。",
      "听到你这么说我很心疼，发生什么事了？愿意跟我说说吗？",
      "抱抱你，难过的时候不要一个人扛着，说出来会好受一些。"
    ],
    gentle: [
      "我理解你的感受，难过是很正常的情绪，给自己一点时间。",
      "嗯，我在听。有时候悲伤也是一种释放，不用太压抑自己。",
      "每个人都会有难过的时候，这并不代表你脆弱。"
    ],
    concise: [
      "我理解。",
      "会好起来的。",
      "慢慢来。"
    ]
  },
  angry: {
    warm: [
      "我能感受到你的愤怒，换作是我可能也会很生气，发生什么了？",
      "生气是正常的，把心里的不爽都说出来吧，我听着呢。",
      "我知道你现在很生气，深呼吸，慢慢说，我会一直在这里。"
    ],
    gentle: [
      "我理解你的愤怒，遇到这样的事任谁都会不舒服。",
      "嗯，我能感受到你的情绪，先平复一下，我们慢慢说。",
      "愤怒是内心的信号，它在告诉你什么对你很重要。"
    ],
    concise: [
      "我理解。",
      "慢慢说。",
      "深呼吸。"
    ]
  },
  anxious: {
    warm: [
      "别担心，有我在。把你焦虑的事情告诉我，我们一起想办法。",
      "我知道你现在很紧张，试着深呼吸，慢慢吸气，慢慢呼气。",
      "焦虑的时候很容易胡思乱想，跟我说说你在担心什么好吗？"
    ],
    gentle: [
      "焦虑是很自然的反应，说明你很在意这件事。试着让自己放松一些。",
      "嗯，我能感受到你的不安。很多时候焦虑来自对未来的担忧，让我们专注在当下。",
      "每个人都会有焦虑的时候，这并不代表你不够好。"
    ],
    concise: [
      "放轻松。",
      "会没事的。",
      "慢慢来。"
    ]
  },
  calm: {
    warm: [
      "真好，能保持平静的心态很不容易呢。现在在做什么呀？",
      "感受到你的平静了，这种状态真的很舒服。",
      "内心平和是最好的状态，愿你一直保持这份宁静。"
    ],
    gentle: [
      "嗯，平静的状态很好。享受这份安宁吧。",
      "内心平静的时候最适合思考了，有什么想聊的吗？",
      "保持这份平和，生活会更美好。"
    ],
    concise: [
      "很好。",
      "不错。",
      "保持。"
    ]
  },
  neutral: {
    warm: [
      "今天过得怎么样？有什么想跟我聊聊的吗？",
      "你好呀！今天有什么特别的事情发生吗？",
      "我在这里陪你，想说什么都可以。"
    ],
    gentle: [
      "嗯，有什么想分享的吗？",
      "今天感觉如何？",
      "我在听。"
    ],
    concise: [
      "你好。",
      "嗯。",
      "好的。"
    ]
  }
}

const followUpQuestions = {
  happy: [
    "是什么让你这么开心呢？",
    "这份开心持续多久了？",
    "有什么特别的事情发生吗？"
  ],
  sad: [
    "这种感觉持续多久了？",
    "有什么我可以帮到你的吗？",
    "最近有发生什么让你难过的事吗？"
  ],
  angry: [
    "是什么事情让你这么生气呢？",
    "这种感觉什么时候开始的？",
    "你觉得怎样才能让你感觉好一些？"
  ],
  anxious: [
    "你在担心什么呢？",
    "这种焦虑感什么时候最强烈？",
    "有什么方法能让你放松一些吗？"
  ],
  default: [
    "能详细说说吗？",
    "还有呢？",
    "你现在感觉怎么样？"
  ]
}

function generateResponse(emotion, style = 'warm', userHistory = []) {
  const emotionKey = emotion.dominant || 'neutral'
  const templates = responseTemplates[emotionKey] || responseTemplates.neutral
  const styleTemplates = templates[style] || templates.warm
  
  let response = styleTemplates[Math.floor(Math.random() * styleTemplates.length)]
  
  if (emotion.keywords && emotion.keywords.length > 0) {
    const keyword = emotion.keywords[0]
    response = response.replace(/你/g, `你提到"${keyword}"，`)
  }
  
  if (userHistory.length === 0 || Math.random() > 0.5) {
    const questions = followUpQuestions[emotionKey] || followUpQuestions.default
    const question = questions[Math.floor(Math.random() * questions.length)]
    response += '\n\n' + question
  }
  
  return response
}

function adjustStyleByHistory(userHistory) {
  if (userHistory.length < 3) return 'warm'
  
  const recentResponses = userHistory.slice(-5)
  const styleCounts = { warm: 0, gentle: 0, concise: 0 }
  
  recentResponses.forEach(record => {
    if (record.userFeedback) {
      if (record.userFeedback.positive) {
        styleCounts[record.styleUsed || 'warm']++
      }
    }
  })
  
  const sorted = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])
  return sorted[0][0]
}

module.exports = {
  generateResponse,
  adjustStyleByHistory,
  responseTemplates
}