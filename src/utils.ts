import { Song } from "./petition";

export class Utils {
    static normalizeSong(song: Song) {
        const radioEditRe = /[([].*Radio Edit.*[)\]]/gi;
        const featRe = /[([]?feat\.?/gi;
        const ftRe = /[([ ]ft\.?[)\[ ]/gi;
        const parenthesisRe = /[([].*?[)\]]/g;
        const symbolsRe = /[()[\]]/gi;
        const versionedInfo = / - .*/g // The hyphen is commonly used in Spotify to determine versions, like radio version, or to mark it comes from a soundtrack

        song.title = song.title.replace(radioEditRe, '');
        const featIndex = song.title.search(featRe);
        if (featIndex > -1) {
            song.title = song.title.substring(0, featIndex);
        }

        const ftIndex = song.title.search(ftRe);
        if (ftIndex > -1) {
            song.title = song.title.substring(0, ftIndex);
        }
        song.title = song.title.replace(parenthesisRe, '');
        song.title = song.title.replace(versionedInfo, '');
        // Even while we have already replaced parenthesis we still perform this search to avoid unamtched simbols to prevail
        song.title = song.title.replace(symbolsRe, '');
        song.title = song.title.toLocaleLowerCase().trim();
        song.title = song.title.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents and such
        
        song.artist = song.artist.replace(featRe, ' & ');
        song.artist = song.artist.replace(ftRe, ' & ');
        song.artist = song.artist.replace(parenthesisRe, '');
        song.artist = song.artist.replace(symbolsRe, '');
        song.artist = song.artist.toLocaleLowerCase().trim();
        song.artist = song.artist.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents and such



        //Exeptions zone: hardcoded replacements for some important songs/artists
        song.title = song.title.replace('y.m.c.a', 'ymca');
        song.artist = song.artist.replace('kesha', 'ke$ha');
        if (song.artist.includes('high school musical cast')
        || song.title === "get'cha head in the game"
        || (song.title === "breaking free" && song.artist === "troy & gabriella")
        || (song.title === "fabulous" && song.artist === "sharpay evans & ryan")
        || (song.title === "i don't dance" && song.artist === "chad & ryan")
        || (song.title === "bet on it" && song.artist === "troy")
        || (song.title === "HUMUHUMUNUKUNUKUAPUA'A".toLowerCase() && song.artist === "sharpay evans & ryan")) {
            song.artist = 'high school musical';
        }
    }
}