# ultrastar-downloader-server
Given a list of songs. It downloads a zip containing all torrents from ultrastar of said list of songs.
The song format must follow the following typing

```typescript
export interface Petition {
    songs: Song[],
    username: string;
    password: string;
}

export interface Song {
    title: string;
    artist: string;
}
```

In case you don't know where to gather this songs list, there is a little webapp which will export your Spotify songs into said format. [Link](https://luismayo.github.io/spotify-ultrastar-downloader/exportify.html)/[Source](https://github.com/LuisMayo/spotify-ultrastar-downloader)

## Getting Started

### Prerequisites
 - Node.js
 - An X server (if you are in a Linux system) (if you are using a GUI-based OS you have no problem)

### Installing
1. Git clone the repo on your machine

```
git clone https://github.com/LuisMayo/ultrastar-downloader-server.git
```

2. cd into folder and npm install

```
cd ultrastar-downloader-server;
npm i;
```

3. Compile the project using `npm run build`
4. Launch the project with `node build YOUR-FILE.json`

## About headless enviorenments
Due to the libraries needed used in this project, an X-server is required always.
I personally recommend using the no-display xvbf server. Once you installed it(details about how-to can be found on the internet or checking the Dockerfile) just run de project with `xvfb-run node build/index.js YOUR-FILE.json`

## Contributing
Since this is a tiny project we don't have strict rules about contributions. Just open a Pull Request to fix any of the project issues or any improvement you have percieved on your own. Any contributions which improve or fix the project will be accepted as long as they don't deviate too much from the project objectives. If you have doubts about whether the PR would be accepted or not you can open an issue before coding to ask for my opinion
