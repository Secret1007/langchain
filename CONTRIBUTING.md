# Contributing to English Journey

Thank you for your interest in contributing to English Journey! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, Python version)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists or is planned
- Clearly describe the feature and its use case
- Explain why it would be valuable to users

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/react-langchain-app.git
   cd react-langchain-app
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   # Frontend
   cd frontend
   npm test
   
   # Backend
   cd backend
   pytest  # if tests exist
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Development Guidelines

### Code Style

**Frontend (TypeScript/React):**
- Use functional components with hooks
- Follow ESLint rules
- Use TypeScript for type safety
- Keep components small and focused

**Backend (Python):**
- Follow PEP 8 style guide
- Use type hints
- Keep functions focused and documented
- Use async/await for I/O operations

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:
```
feat(websocket): add real-time sentence detection
fix(backend): resolve API key validation error
docs(readme): update installation instructions
```

## Project Structure

- `frontend/src/components/` - React components
- `frontend/src/hooks/` - Custom React hooks
- `backend/services/` - Business logic
- `backend/main.py` - FastAPI app and routes

## Getting Help

- Check the [README](README.md) for setup instructions
- Review [WEBSOCKET_GUIDE.md](WEBSOCKET_GUIDE.md) for WebSocket details
- Look at existing code for examples
- Open an issue if you need assistance

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the issue, not the person
- Give and receive feedback gracefully

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🌻

