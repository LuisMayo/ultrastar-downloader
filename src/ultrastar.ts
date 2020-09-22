import Nightmare from 'nightmare';
import { Petition } from './petition';
import * as stringSimilarity from 'string-similarity';
export async function main(req: Petition) {
    require('nightmare-download-manager')(Nightmare);
    let nightmare = new Nightmare({ show: true});
    ///@ts-ignore
    nightmare.on('download', (state, downloadItem) => {
        if (state == 'started') {
            ///@ts-ignore
            nightmare.emit('download', __dirname + '/file.zip', downloadItem);
        }
    });
    nightmare
        ///@ts-ignore
        .downloadManager();
    nightmare.goto('https://ultrastar-es.org/foro/ucp.php?mode=login')
        .type('#username', req.username)
        .type('#password', req.password)
        .type('#password', '\u000d')
        .wait('#username_logged_in')
        for (let song of req.songs) {
            nightmare.goto(`https://ultrastar-es.org/es/canciones?busqueda=${song.artist.replace(' ','+')}+-+${song.title.replace(' ','+')}`);
            const sArtist = song.artist;
            const sTitle = song.title;
            //@ts-ignore
            nightmare.evaluate((sArtist, sTitle) => {
                const compareTwoStrings = function(first: string, second: string) {
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
                alert(sArtist);
                alert(sTitle);
                debugger;
                const artist = document.querySelector('#listado > ul > li:nth-child(1) > h3 > a')?.textContent || '';
                const song = document.querySelector('#listado > ul > li:nth-child(1) > h3 > a:nth-child(2)')?.textContent || '';
                const similarityArt = compareTwoStrings(sArtist.toLocaleLowerCase(), artist.toLocaleLowerCase()); 
                const similaritySong = compareTwoStrings(song.toLocaleLowerCase(), sTitle.toLocaleLowerCase()); 
                if (similarityArt >= 0.9 && similaritySong >= 0.9) {
                    (document.querySelector('.canciones > li > .acciones > li:nth-child(3) > button') as HTMLElement).click();
                }
            }, sArtist, sTitle);
            nightmare.wait(5000);
        }

        // .click('.canciones > li > .acciones > li:nth-child(3) > button')
        // .click('.canciones > li:nth-child(2) > .acciones > li:nth-child(3) > button')
        nightmare.click('#descargar_paquete')
        ///@ts-ignore
        .waitDownloadsComplete()
        return nightmare.end();
}
