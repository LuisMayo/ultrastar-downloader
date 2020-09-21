import Nightmare from 'nightmare';
require('nightmare-download-manager')(Nightmare);
async function main() {
    let nightmare = new Nightmare({ show: true });
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
        .type('#username', 'Luigi003')
        .type('#password', 'pokemon')
        .type('#password', '\u000d')
        .wait('#username_logged_in')
        .goto('https://ultrastar-es.org/es/canciones?busqueda=phineas+y+ferb')
        .evaluate(() => {
            return document.querySelector('.canciones > li > h3 > a')?.textContent
        })
        // .click('.canciones > li > .acciones > li:nth-child(3) > button')
        // .click('.canciones > li:nth-child(2) > .acciones > li:nth-child(3) > button')
        // .click('#descargar_paquete')
        ///@ts-ignore
        // .waitDownloadsComplete()
        return nightmare.end();
}

main().then(() => { });
