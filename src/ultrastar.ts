import Nightmare from 'nightmare';
import { Petition } from './petition';
import * as stringSimilarity from 'string-similarity';
export async function main(req: Petition) {
    require('nightmare-download-manager')(Nightmare);
    let nightmare = new Nightmare({ show: false });
    ///@ts-ignore
    nightmare.on('download', (state, downloadItem) => {
        if (state == 'started') {
            ///@ts-ignore
            nightmare.emit('download', './file.zip', downloadItem);
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
            nightmare.evaluate(() => {
                const artist = document.querySelector('#listado > ul > li:nth-child(1) > h3 > a')?.textContent || '';
                const song = document.querySelector('#listado > ul > li:nth-child(1) > h3 > a:nth-child(2)')?.textContent || '';
                const similarityArt = stringSimilarity.compareTwoStrings(sArtist, artist); 
                const similaritySong = stringSimilarity.compareTwoStrings(song, sTitle); 
                if (similarityArt >= 0.9 && similaritySong >= 0.9) {
                    (document.querySelector('.canciones > li > .acciones > li:nth-child(3) > button') as HTMLElement).click();
                }
                ///@ts-ignore
            }, sArtist, sTitle);
        }

        // .click('.canciones > li > .acciones > li:nth-child(3) > button')
        // .click('.canciones > li:nth-child(2) > .acciones > li:nth-child(3) > button')
        nightmare.click('#descargar_paquete')
        ///@ts-ignore
        .waitDownloadsComplete()
        return nightmare.end();
}
