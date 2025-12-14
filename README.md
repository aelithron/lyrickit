# LyricKit ![IMG](https://hackatime-badge.hackclub.com/U08RJ1PEM7X/lyrickit)
A one-stop-shop webapp for everything related to lyrics! \
Download, write, sync, and export lyrics to be usable where you need them. \
This project was made for Moonshot, a Hack Club event!
<div align="center">
  <a href="https://moonshot.hackclub.com" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/35ad2be8c916670f3e1ac63c1df04d76a4b337d1_moonshot.png" 
         alt="This project is part of Moonshot, a 4-day hackathon in Florida visiting Kennedy Space Center and Universal Studios!" 
         style="width: 100%;">
  </a>
</div>

## Features
- Metadata extractor for uploaded song files
- Pulls existing lyrics from LRCLIB
- Includes a simple tool for playing a song and syncing while you do so, inspired by https://lrc-maker.github.io.
- Works with bulk imports (drop a bunch of songs in, pull/write/sync lyrics, and export a .zip at the end).
- Mobile compatibility
- Supports many file types

## Usage
Go to [lyrics.novatea.dev](https://lyrics.novatea.dev) in a web browser! Upload your songs and follow the flow illustrated by the sidebar (it goes in order).
### Self-hosting
#### With Docker Compose
Copy the following Compose file to your server or computer, and name it `compose.yaml`:
```yaml
services:
  lyrickit:
    image: ghcr.io/aelithron/lyrickit:latest
    container_name: lyrickit
    ports:
      - "3000:3000"
    restart: unless-stopped
```
Then, simply run `docker compose up -d` in the directory of the file!
#### With `docker run`
Run the following command on your server or computer:
```bash
docker run -d \
  --name lyrickit \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/aelithron/lyrickit:latest
```
## Credits
This project uses some [Font Awesome](https://fontawesome.com) and [Twemoji](https://github.com/twitter/twemoji) icons throughout.
