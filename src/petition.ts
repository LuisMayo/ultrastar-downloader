export interface Petition {
    songs: Song[],
    username: string;
    password: string;
}

export interface Song {
    title: string;
    artist: string;
}
