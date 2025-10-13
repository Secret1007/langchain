# API 配置说明

## 环境变量设置

在 `backend` 目录下创建 `.env` 文件，并添加以下配置：

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# Alternative: DeepSeek API (if using DeepSeek instead of OpenAI)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

## 支持的API提供商

### 1. OpenAI API
- 需要有效的 OpenAI API 密钥
- 支持 GPT-3.5-turbo, GPT-4 等模型
- 默认使用 OpenAI 官方 API

### 2. DeepSeek API
- 需要有效的 DeepSeek API 密钥
- 使用 DeepSeek 的 chat 模型
- 更经济实惠的选择

## 启动服务

1. 安装依赖：
```bash
cd backend
pip install -r requirements.txt
```

2. 设置环境变量（创建 .env 文件）

3. 启动后端服务：
```bash
python main.py
```

服务将在 http://localhost:8000 启动

## API 端点

- `POST /api/check-word` - 单词拼写检查
- `POST /api/check-sentence` - 句子语法检查
- `POST /api/improve-text` - 文本改进建议
- `GET /api/health` - 健康检查

## 前端配置

前端会自动检测后端API连接状态，如果无法连接会自动切换到本地检查模式。
