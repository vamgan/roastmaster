# 🔥 RoastMaster CLI

> "The only code reviewer that hates you."

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Gen Z Certified](https://img.shields.io/badge/Gen%20Z-Certified-pink)](https://tiktok.com)

**RoastMaster** is an AI agent that reviews your code, finds bugs, and ROASTS you for them. It can also fix your code, but it will leave passive-aggressive comments in the PR.

![Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R4cWJ3Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6/l3q2K5jinAlChoCLS/giphy.gif)

## 🚀 Why?
Because code reviews are boring. You need to be humbled.

## 📦 Installation

```bash
git clone https://github.com/vamgan/roastmaster.git
cd roastmaster
npm install
npm run build
npm link
```

## 🌶️ Usage

### 1. The Roast (`roast`)
Analyzes your file and destroys your ego.

```bash
roast src/broken.ts
# Output: "Bro really tried to use `any` in 2025? 💀 Expected better from you chief."
```

### 2. The Fix (`fix`)
Fixes the code, but adds helpful comments like `// fixing this race condition fr fr`.

```bash
fix src/broken.ts
```

### 3. Change Persona (`--persona`)
- `roast`: The default. Ruthless Gen Z.
- `hype`: Overwhelmingly positive. "KING YOU DROPPED THIS 👑"
- `senior`: "Back in my day we wrote C on napkins."

```bash
roast src/index.ts --persona hype
```

## 🤖 Usage as a Claude Code Plugin

To install RoastMaster as a plugin in `claude` CLI:

1. Create a `plugins` directory (if you haven't already).
2. Clone this repo into it.
3. Run `claude --plugin-dir ./roastmaster`

Or, if you are distributing it:
1. Publish to npm.
2. Users can install via `claude plugin add roastmaster` (once the marketplace supports it) or simply point to the local directory.

### Configuration via `.mcp.json`
The project includes a `.mcp.json` file that automatically registers the MCP server when loaded as a plugin. Ensure your `OPENAI_API_KEY` is set in your environment.

```json
{
  "mcpServers": {
    "roastmaster": {
      "command": "npx",
      "args": ["-y", "roastmaster@latest", "server"],
      "env": {
        "OPENAI_API_KEY": "your-key-here"
      }
    }
  }
}
```

**That's it.** No git clone, no setup. Just add those 6 lines and Claude gains the power of roasting.

## 🤝 Contributing
Don't break it or I'll roast your PR.


## Installation (Claude Desktop / MCP)

You can use RoastMaster as a tool within Claude Desktop.

### Prerequisites
1.  [Node.js](https://nodejs.org/) (v18 or higher)
2.  Git

### Configuration

Add the following to your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "roastmaster": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/roastmaster/dist/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "your-key-here",
        "BEDROCK_MODEL_ID": "optional-bedrock-model-id" 
      }
    }
  }
}
```
*Note: You must clone this repository and build it (`npm install && npm run build`) locally for the path to exist.*

### Using via GitHub (npx)

If you don't want to clone, you can use `npx` directly (once published to npm) or point to the repo if configured:


### Using as a Claude Plugin (Claude Code)

RoastMaster is designed to work as a native Claude Code plugin.
It provides the following commands:
- `/roast`: Reviews your code with ruthlessness.
- `/fix`: Attempts to fix your code (with attitude).

To install (once supported via direct git URL or marketplace):
*(Follow standard Claude Code plugin installation instructions)*

For now, you can clone this repo and point your tool configuration to it.

T. No cap.
