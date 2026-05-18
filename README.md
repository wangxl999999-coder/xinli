# 心语AI - 智能情绪解析微信小程序

一款融合心理学、计算机视觉和自然语言处理技术的AI情绪分析微信小程序，帮助用户更好地了解和管理自己的情绪。

## ✨ 功能特性

### 📝 多维度情绪分析
- **文本情绪分析**：通过自然语言处理识别文字中的情绪倾向和具体情绪感受
- **语音情绪识别**：通过语速、语调等声学特征判断用户情绪状态
- **面部表情分析**：调用摄像头捕捉面部动作，实时识别表情对应的情绪

### 🤖 智能共情回应
- 基于不同情绪类型匹配对应的回应风格
- 支持个性化话术风格调整（温暖/温柔/简洁）
- 预制专业心理学模板保证回应质量
- 极端情绪自动检测和预警机制

### 📊 数据可视化
- **情绪分布饼图**：展示各情绪类型占比
- **情绪变化趋势折线图**：追踪7天/30天/90天的情绪波动
- **历史情绪曲线**：查看长期情绪变化轨迹
- **个性化洞察建议**：基于数据分析提供情绪调节建议

### 💝 心理支持工具
- **极端情绪转接**：自动检测消极情绪，提供心理咨询热线
- **每日提醒**：定时提醒记录情绪
- **心理工具箱**：呼吸放松、冥想引导、积极暗示等
- **感恩日记**：培养积极心态

## 📁 项目结构

```
xinli/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序配置
├── app.wxss               # 全局样式
├── project.config.json    # 项目配置
├── sitemap.json           # 站点地图
├── pages/                 # 页面目录
│   ├── index/             # 首页
│   ├── emotion/           # 情绪记录页面
│   │   ├── text.js        # 文本情绪分析
│   │   ├── voice.js       # 语音情绪识别
│   │   └── face.js        # 面部表情分析
│   ├── history/           # 历史记录页面
│   ├── analysis/          # 数据分析页面
│   └── profile/           # 个人中心页面
├── utils/                 # 工具函数
│   ├── emotionAnalyzer.js # 情绪分析引擎
│   ├── empathyEngine.js   # 共情回应引擎
│   └── chartHelper.js     # 图表数据处理
└── images/                # 图片资源
```

## 🚀 快速开始

### 环境要求
- 微信开发者工具
- 微信小程序开发者账号

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd xinli
   ```

2. **导入项目**
   - 打开微信开发者工具
   - 选择"导入项目"
   - 选择项目目录
   - 输入 AppID（测试可使用测试号）

3. **配置权限**
   - 在微信公众平台配置服务器域名（如需调用后端API）
   - 确保录音、相机权限已配置

### 项目配置

在 `app.json` 中配置页面路径和权限：

```json
{
  "pages": [
    "pages/index/index",
    "pages/emotion/text",
    "pages/emotion/voice",
    "pages/emotion/face",
    "pages/history/history",
    "pages/analysis/analysis",
    "pages/profile/profile"
  ],
  "permission": {
    "scope.record": {
      "desc": "需要使用您的麦克风进行语音情绪识别"
    },
    "scope.camera": {
      "desc": "需要使用您的摄像头进行面部表情分析"
    }
  }
}
```

## 🎯 核心功能说明

### 情绪分析引擎 (`utils/emotionAnalyzer.js`)

```javascript
// 文本情绪分析
const result = emotionAnalyzer.analyzeTextEmotion(text)
// 返回: { emotions, dominant, type, confidence, keywords }

// 语音情绪分析
const voiceResult = emotionAnalyzer.analyzeVoiceFeatures(audioData)

// 面部表情分析
const faceResult = emotionAnalyzer.analyzeFaceExpression(faceData)

// 极端情绪检测
const alert = emotionAnalyzer.detectExtremeEmotion(analysis)
```

### 共情回应引擎 (`utils/empathyEngine.js`)

```javascript
// 生成共情回应
const response = empathyEngine.generateResponse(
  emotion, 
  style,        // 'warm' | 'gentle' | 'concise'
  userHistory
)

// 根据历史记录调整风格
const preferredStyle = empathyEngine.adjustStyleByHistory(userHistory)
```

### 图表数据处理 (`utils/chartHelper.js`)

```javascript
// 生成饼图数据
const pieData = chartHelper.generatePieChartData(stats)

// 生成折线图数据
const lineData = chartHelper.generateLineChartData(stats, 7)

// 计算心情指数
const moodScore = chartHelper.calculateMoodScore(history)
```

## 📱 页面说明

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/pages/index/index` | 心情概览、快速记录入口、每日贴士 |
| 文本分析 | `/pages/emotion/text` | 输入文字，分析情绪倾向 |
| 语音识别 | `/pages/emotion/voice` | 录音并分析语音情绪特征 |
| 表情分析 | `/pages/emotion/face` | 拍照识别面部表情情绪 |
| 历史记录 | `/pages/history/history` | 查看所有情绪记录，支持筛选 |
| 数据分析 | `/pages/analysis/analysis` | 情绪分布、趋势图、洞察建议 |
| 个人中心 | `/pages/profile/profile` | 用户信息、设置、心理工具箱 |

## 🎨 设计理念

### 色彩系统
- **主色调**：紫色系 (#6c5ce7) - 代表关怀、温暖和科技感
- **积极情绪**：绿色系 (#00b894) - 代表希望和活力
- **消极情绪**：红色系 (#e17055) - 提供温暖的警示
- **中性情绪**：蓝色系 (#74b9ff) - 平静和稳定

### 交互设计
- 简洁明了的情绪图标，直观传达情绪状态
- 平滑的动画过渡提升用户体验
- 循序渐进的引导，降低使用门槛
- 隐私优先，所有数据本地存储

## 🔮 后续规划

- [ ] 接入真实的AI情绪分析API
- [ ] 增加更多心理测评量表
- [ ] 实现情绪日记导出功能
- [ ] 添加社区分享功能
- [ ] 支持多端数据同步
- [ ] 接入专业心理咨询师平台

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有为心理健康事业做出贡献的人们。如果你有任何问题或建议，欢迎反馈。

---

**注意**：本小程序仅作为情绪记录和辅助工具，不能替代专业心理咨询。如遇严重心理问题，请及时寻求专业帮助。

**全国心理援助热线**：400-161-9995
