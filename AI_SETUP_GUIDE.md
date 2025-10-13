# AI实时检查设置指南

## 🚀 快速设置

### 1. 创建环境变量文件

在 `backend` 目录下创建 `.env` 文件：

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# 或者使用 DeepSeek API (更经济实惠)
# DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 2. 获取API密钥

#### 选项A: OpenAI API
1. 访问 https://platform.openai.com/api-keys
2. 登录你的OpenAI账户
3. 创建新的API密钥
4. 复制密钥并替换 `.env` 文件中的 `sk-your-actual-api-key-here`

#### 选项B: DeepSeek API (推荐，更经济)
1. 访问 https://platform.deepseek.com/
2. 注册账户并获取API密钥
3. 在 `.env` 文件中使用 `DEEPSEEK_API_KEY` 而不是 `OPENAI_API_KEY`

### 3. 启动服务

```bash
# 启动后端
cd backend && python main.py

# 启动前端
cd frontend && npm start
```

## 🎯 功能说明

现在系统将：

1. **只使用AI检查** - 移除了所有本地检查逻辑
2. **实时单词检查** - 输入单词时自动调用AI检查拼写
3. **实时句子检查** - 输入标点符号时自动调用AI检查语法
4. **智能反馈** - 显示AI的置信度和详细解释
5. **一键应用** - 快速修正AI建议的错误

## 🔧 故障排除

### API密钥错误
```
openai.OpenAIError: The api_key client option must be set
```
**解决方案**: 确保 `.env` 文件中的API密钥正确设置

### API连接失败
**解决方案**: 检查网络连接和API密钥是否有效

### 前端显示"API未连接"
**解决方案**: 确保后端服务正在运行在 http://localhost:8000

## 💡 使用提示

1. **输入单词** - 系统会自动检查拼写错误
2. **输入标点符号** - 系统会自动检查句子语法
3. **查看建议** - 右侧Revision Panel会显示AI的检查结果
4. **应用建议** - 点击"应用"按钮快速修正错误
5. **AI标识** - 所有建议都来自AI，显示🤖标识

现在你可以享受纯AI驱动的实时英语检查体验了！🌟
