# 🛠️ Project Tools

This directory contains utility scripts for development.

## 🛡️ Security CLI Tool

A CLI tool to generate secure keys, tokens, and hashes for the project.

### How to use

1. Go to the `tools` directory: `cd tools`
2. Run the commands:

```bash
# Show help
npm run security -- help

# Generate a 32-byte hex key (for VITE_CRYPTO_KEY)
npm run security -- key

# Generate a 64-byte token (for JWT_SECRET)
npm run security -- token 64

# Generate a SHA-256 hash of a text
npm run security -- hash "your-text-here"

# Generate all required .env security keys at once
npm run security -- env
```

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `key [len]` | Generates a random hex key. | `npm run security -- key 32` |
| `token [len]` | Generates a random base64url token. | `npm run security -- token 64` |
| `hash <text>` | Generates a SHA-256 hash. | `npm run security -- hash "password"` |
| `env` | Generates a template for `.env` keys. | `npm run security -- env` |

---
*Note: This tool uses Node.js built-in `crypto` module.*
