# ILIAS WebDAV Scraper

An Electron-based desktop application that allows automatic synchronization of ILIAS course materials using WebDAV protocol. Built with React, TypeScript, and Electron.

## Features

- WebDAV-based synchronization with ILIAS
- Automatic course material downloading
- Course management interface
- Cross-platform support (Windows, macOS, Linux)
- Modern React-based user interface
- Configurable settings
- Real-time download progress tracking
- Error handling and notifications

## Tech Stack

- **Framework**: Electron
- **Frontend**: React with TypeScript
- **UI Components**: Bootstrap & React Bootstrap
- **Routing**: React Router DOM
- **Notifications**: React Toastify
- **File Operations**: WebDAV Client
- **Development Tools**: Vite, ESLint, Prettier

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install Dependencies

```bash
$ npm install
```

### Development

Run the application in development mode with hot-reload:

```bash
$ npm run dev
```

### Type Checking

```bash
# Check Node.js types
$ npm run typecheck:node

# Check web types
$ npm run typecheck:web

# Check all types
$ npm run typecheck
```

### Linting and Formatting

```bash
# Format code with Prettier
$ npm run format

# Lint code with ESLint
$ npm run lint
```

### Build

Build the application for different platforms:

```bash
# For Windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux

# For Arch Linux (Pacman)
$ npm run build:arch
```

## Version

Current version: 1.1.0

## Author

Created by paul@pabr.de
Homepage: https://www.pabr.de
