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

The game is pre-configured to connect to your LAN IP: `http://172.16.1.218:3000`.

To play with others on your Wi-Fi:
1.  **Run the server** on this computer (`node server.js`).
2.  **Open the game** on any device connected to the same Wi-Fi.
    -   If opening as a file, ensure the code in `index.html` points to `http://172.16.1.218:3000`.
    -   If hosting the game files on a web server, ensure the devices can access that web server.


## Troubleshooting

- **Firewall**: Ensure your firewall allows Node.js to listen on port 3000.
- **CORS**: The server is configured to allow connections from any origin, so running the game game from a local file (`file:///...`) or a local server should work.
