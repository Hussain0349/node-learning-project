# Project-Name

**First Node project**

# Author

**Hussain Ahmad**

##  Overview  
This repository contains my **Node.js learning tasks**, demonstrating Git workflow, npm usage, file system operations, command-line arguments, and building a simple HTTP server without external frameworks.  

Each task is implemented step by step with proper commits and branches following GitHub best practices.  

---

##  Implemented Tasks  

###  TASK-1: Hello World Script
- Initialized Git repository with `.gitignore` (ignores `node_modules/`, `.env`, `*.log`).
- Created `hello.js` that:
  - Prints **"Hello Node.js!"** to the console.
  - Prints the **current date and time**.
  - Prints the **Node.js version** using `process.version`.

### TASK-2: File Management
Created file-manager.js to demonstrate basic file system operations using Node’s built-in fs module..
- #### Features
  - Create a file with content
  - Append new content
  - Read and display file content
  - List all files in the current directory
  -  Delete a file



---
### TASK-3: Command Line Arguments & NPM
Enhanced file-manager.js to accept command-line arguments using process.argv. Installed chalk npm package to colorize output.
- #### Features
  - Supports multiple commands via CLI
  - Colorized terminal output using chalk
  - Added npm scripts for quick execution

#### Supported Commands:
node file-manager.js create filename.txt "content here"
node file-manager.js read filename.txt
node file-manager.js list
node file-manager.js delete filename.txt




### TASK-4: Basic HTTP Server
Built a basic HTTP server using Node’s built-in http module (without Express).
#### Features
  - Handles multiple routes
  - Returns both plain text and JSON responses
  - Logs every request with a timestamp
### Avalible Routes

- GET / → Returns Welcome to my Node.js server!
- GET /time → Returns current server time in JSON
- GET /files → Returns list of project directory files
- GET /health → Returns server status and uptime
- Any other route → Returns JSON 404 Not Found

#### Supported Commands:
node file-manager.js create filename.txt "content here"
node file-manager.js read filename.txt
node file-manager.js list
node file-manager.js delete filename.txt




# Features Summary

 - File system operations (create, read, append, delete)
  - CLI tool with command-line arguments
  - HTTP server with multiple routes
  - responses with proper headers
  - Request logging with timestamps
  - Git workflow with branches, PRs, and reviews

