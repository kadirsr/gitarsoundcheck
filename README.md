# TabFlow

Interactive guitar tab trainer.

## Features

- Paste ASCII guitar tabs
- Build tabs with an interactive grid editor
- Real-time microphone pitch detection
- Note-by-note practice
- Wait Mode
- BPM/metronome
- Correct/wrong visual feedback
- Local-only audio processing

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Privacy

Audio is processed locally in the browser. No audio is uploaded.

Microphone access generally works on `localhost` or a secure HTTPS domain. If you deploy to a server and the microphone does not start, put the app behind HTTPS with a domain.

## Localhost Microphone Tunnel

Browsers allow microphone access on `localhost`. If TabFlow is running on a remote HTTP server, open an SSH local-forward tunnel and use the app through:

```text
http://localhost:8093
```

A safe template is included at:

```text
scripts\start-tabflow-localhost-tunnel.example.bat
```

Set the host and key before running it:

```bat
set TABFLOW_SSH_HOST=user@tailscale-ip
set TABFLOW_SSH_KEY=%USERPROFILE%\.ssh\minipc2_ed25519
scripts\start-tabflow-localhost-tunnel.example.bat
```

Keep the BAT window open while practicing. If the window closes, the tunnel is closed; run the BAT again to reopen it.

## Docker

Build and run the production static app with Docker Compose:

```bash
docker compose up -d --build
```

The app is served on:

```text
http://localhost:8080
```

## Ubuntu 24 Server

Install baseline tools:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git
```

Install Docker if it is not already available:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Check Docker Compose:

```bash
docker compose version
```

Clone and run:

```bash
git clone https://github.com/kadirsr/gitarsoundcheck.git
cd gitarsoundcheck
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f
```

Stop:

```bash
docker compose down
```

Rebuild after updates:

```bash
docker compose up -d --build
```

For production use, expose the container behind a reverse proxy such as Nginx, Caddy, or Traefik with HTTPS. Point the proxy to:

```text
http://127.0.0.1:8080
```
