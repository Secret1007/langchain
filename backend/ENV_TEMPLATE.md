# Environment Variables Template

Create a `.env` file in the `backend/` directory with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Alternative: DeepSeek Configuration (uncomment to use)
# DEEPSEEK_API_KEY=your-deepseek-api-key-here
# DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# Application Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Optional: Additional Model Settings
TEMPERATURE=0.7
MAX_TOKENS=500
```

## How to Create

**Windows:**
```bash
copy ENV_TEMPLATE.md .env
```

**macOS/Linux:**
```bash
cp ENV_TEMPLATE.md .env
```

Then edit the `.env` file and add your actual API keys.

## Getting API Keys

### OpenAI
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into `.env`

### DeepSeek (Alternative)
1. Visit https://platform.deepseek.com/
2. Register and get your API key
3. Use it as an alternative to OpenAI

## Security Notes

- ⚠️ **Never commit `.env` files to version control**
- The `.env` file is already in `.gitignore`
- Keep your API keys secret
- Rotate keys if they are exposed

