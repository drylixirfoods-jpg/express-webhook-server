# Contributing to Express Webhook Server

First off, thank you for considering contributing to the Express Webhook Server! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript styleguide
* Include appropriate test cases
* Document new code
* End all files with a newline

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/express-webhook-server.git
   ```

3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/drylixirfoods-jpg/express-webhook-server.git
   ```

4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Install dependencies:
   ```bash
   npm install
   ```

6. Make your changes and test them:
   ```bash
   npm run dev
   ```

7. Commit your changes:
   ```bash
   git commit -am 'Add feature: description'
   ```

8. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```

9. Create a Pull Request on GitHub

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Start with a type: feat, fix, refactor, docs, style, test

Example:
```
feat: add rate limiting to webhook endpoint

Implement basic rate limiting using express middleware
with configurable window and max requests per window.

Fixes #123
```

### JavaScript Styleguide

* Use 2 spaces for indentation
* Use const for constants and let for variables (avoid var)
* Use async/await instead of .then() when possible
* Use arrow functions for callbacks
* Comment complex logic
* Use meaningful variable names

Example:
```javascript
// Good
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Bad
var exp = require('express');
var a = exp();
var b = require('body-parser');
a.use(b.json());
a.get('/',(q,r)=>{r.send('Hello World')});
```

### Documentation Styleguide

* Use Markdown
* Reference other sections with markdown links
* Include code examples where appropriate
* Use proper grammar and spelling

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help organize and categorize issues and pull requests.

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested

### Project Structure

Before making significant changes, please familiarize yourself with the project structure:

```
.
├── server.js              # Main server file
├── package.json           # Project metadata and dependencies
├── .env.example           # Example environment configuration
├── README.md              # Project documentation
├── CONTRIBUTING.md        # This file
└── .gitignore             # Git ignore rules
```

### Testing

While this project doesn't have automated tests yet, please:

1. Test your changes locally with `npm run dev`
2. Verify the health check endpoint
3. Test webhook verification
4. Test webhook processing
5. Test error handling

## Questions?

Feel free to open an issue with the label `question` or contact the maintainers.

Thank you for contributing! 🎉
