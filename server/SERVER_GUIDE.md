# Roadst3r Game Server

This is a standalone Node.js server for Roadst3r that handles multiplayer synchronization.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your computer.

## Installation

1.  Open your terminal or command prompt.
2.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```
    *Note: If you encounter permission issues with PowerShell, try using Command Prompt (cmd) or run `npm install` directly.*

## Running the Server

To start the server, run:

```bash
node server.js
```
or
```bash
npm start
```

The server will start on port **3000**.
You should see: `Server running on port 3000`.

## Connecting the Game

The game is pre-configured to connect to `http://localhost:3000`.
Simply open `drive/index.html` in your browser (or refresh if open) while the server is running.
You should see "Connected to server" in the browser console (F12).

## Troubleshooting

- **Firewall**: Ensure your firewall allows Node.js to listen on port 3000.
- **CORS**: The server is configured to allow connections from any origin, so running the game game from a local file (`file:///...`) or a local server should work.
