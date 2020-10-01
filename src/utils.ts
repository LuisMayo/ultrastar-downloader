import { Song } from "./petition";

export class Utils {
    static normalizeSong(song: Song) {
        const radioEditRe = /[([].*Radio Edit.*[)\]]/gi;
        // const featReExludingParenthesis= /[([]?feat\.?([^([])+/i
        const featRe = /[([]?feat\.?/gi;
        const ftRe = /[([ ]ft\.?[)\[ ]/gi;
        const ostRe = /([([][^([]*)?((B\.?S\.?O)|(O\.?S\.?T\.?))[^)\]]*[)\]]?/gi;
        const parenthesisRe = /[([].*?[)\]]/g;
        const symbolsRe = /[()[\]]/gi;
        const versionedInfo = / - .*/g // The hyphen is commonly used in Spotify to determine versions, like radio version, or to mark it comes from a soundtrack

        song.title = song.title.replace(radioEditRe, '');
        song.title = song.title.replace(ostRe, '');
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

        song.artist = song.artist.replace(featRe, ' & ');
        song.artist = song.artist.replace(ftRe, ' & ');
        song.artist = song.artist.replace(parenthesisRe, '');
        song.artist = song.artist.replace(symbolsRe, '');
        song.artist = song.artist.toLocaleLowerCase().trim();



        //Exeptions zone: hardcoded replacements for some important songs/artists
        song.title = song.title.replace('y.m.c.a', 'ymca');
        song.artist = song.artist.replace('kesha', 'ke$ha');
    }
}