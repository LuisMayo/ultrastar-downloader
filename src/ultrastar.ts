import Nightmare from 'nightmare';
import { Petition, Song } from './petition';
import { Utils } from './utils';

export async function main(req: Petition) {
    require('nightmare-download-manager')(Nightmare);
    const rejectedList: string[] = [];
    ///@ts-ignore
    let nightmare = new Nightmare({ show: true, height: 800 });
    ///@ts-ignore
    nightmare.on('download', (state, downloadItem) => {
        if (state == 'started') {
            ///@ts-ignore
            nightmare.emit('download', __dirname + '/' + req.username + '/songs/' + downloadItem.filename, downloadItem);
        }
    });
    nightmare
        ///@ts-ignore
        .downloadManager();
    nightmare.goto('https://ultrastar-es.org/foro/ucp.php?mode=login')
        .type('#username', req.username)
        .type('#password', req.password)
        .type('#password', '\u000d')
        .wait('#username_logged_in') // Login
    for (let song of req.songs) {
        Utils.normalizeSong(song);
        //Look for the song
        nightmare.goto(`https://ultrastar-es.org/es/canciones?busqueda=${song.artist.replace(/ /g, '+').replace(/&/g, '%26')}+-+${song.title.replace(/ /g, '+').replace(/&/g, '%26')}`);
        const sArtist = song.artist;
        const sTitle = song.title;
        //@ts-ignore
        nightmare.evaluate((sArtist, sTitle) => {
            //// WE CANNOT USE NODE FUNCTIONS INSIDE NIGHTMARE, SO WE JUST COPY-PASTE THEM
            const compareTwoStrings = function (first: string, second: string) {
                /*MIT License
                                Copyright (c) 2018 Akash Kurdekar*/
                first = first.replace(/\s+/g, '')
                second = second.replace(/\s+/g, '')

                if (!first.length && !second.length) return 1;                   // if both are empty strings
                if (!first.length || !second.length) return 0;                   // if only one is empty string
                if (first === second) return 1;       							 // identical
                if (first.length === 1 && second.length === 1) return 0;         // both are 1-letter strings
                if (first.length < 2 || second.length < 2) return 0;			 // if either is a 1-letter string

                let firstBigrams = new Map();
                for (let i = 0; i < first.length - 1; i++) {
                    const bigram = first.substring(i, i + 2);
                    const count = firstBigrams.has(bigram)
                        ? firstBigrams.get(bigram) + 1
                        : 1;

                    firstBigrams.set(bigram, count);
                };

                let intersectionSize = 0;
                for (let i = 0; i < second.length - 1; i++) {
                    const bigram = second.substring(i, i + 2);
                    const count = firstBigrams.has(bigram)
                        ? firstBigrams.get(bigram)
                        : 0;

                    if (count > 0) {
                        firstBigrams.set(bigram, count - 1);
                        intersectionSize++;
                    }
                }

                return (2.0 * intersectionSize) / (first.length + second.length - 2);
            }

            const normalizeSong = function (song: Song) {
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
                song.title = song.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                song.artist = song.artist.replace(featRe, ' & ');
                song.artist = song.artist.replace(ftRe, ' & ');
                song.artist = song.artist.replace(parenthesisRe, '');
                song.artist = song.artist.replace(symbolsRe, '');
                song.artist = song.artist.toLocaleLowerCase().trim();
                song.artist = song.artist.normalize("NFD").replace(/[\u0300-\u036f]/g, "");



                //Exeptions zone: hardcoded replacements for some important songs/artists
                song.title = song.title.replace('y.m.c.a', 'ymca');
                song.artist = song.artist.replace('kesha', 'ke$ha');
            }

            //// END of copied functions
            const artist = document.querySelector('#listado > ul > li:nth-child(1) > h3 > a')?.textContent || '';
            const title = document.querySelector('#listado > ul > li:nth-child(1) > h3 > a:nth-child(2)')?.textContent || '';
            const song = { artist, title };
            normalizeSong(song);
            let similarityArt = compareTwoStrings(sArtist, song.artist);
            const similaritySong = compareTwoStrings(song.title, sTitle);

            // Apart from comparing the title and artist I also want to compare all the different artists since sometimes only one of them is listed
            const requestedArtists = sArtist.split('&').map((artist: string) => artist.trim());
            const foundArtists = artist.split('&').map((artist: string) => artist.trim());
            for (const requestedArtist of requestedArtists) {
                for (const foundArtist of foundArtists) {
                    similarityArt = Math.max(similarityArt, compareTwoStrings(requestedArtist, foundArtist));
                }
            }
            if (similarityArt >= 0.80 && similaritySong >= 0.75) { // Is it actually the song we want?
                (document.querySelector('.canciones > li > .acciones > li > a') as HTMLElement).click(); // Download it
            }
        }, sArtist, sTitle);
    }
    ///@ts-ignore
    nightmare.waitDownloadsComplete()
    return nightmare.end();
}
