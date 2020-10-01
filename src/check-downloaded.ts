import { Petition } from "./petition";
import fs from 'fs';
import { compareTwoStrings } from 'string-similarity';
import { Utils } from "./utils";

/* Check what songs weren't foind
Q: Isn't there a better way to do this?
A: I'd love to, but nightmare doesn't seem to be very friendly when we're trying to extract data from
the evaluate function. So I can't really know whether a song passed the check or not.
If a way is found, this whole file can be deleted and I'll be more than happy to do it  */
/**
 * 
 * @param req Petition
 * @param internal Do we need the list for programatic reasons (true) or do we want to output to user (false)
 */
export function checkDownloaded(req: Petition, internal = false) {
    // We get all the downloaded songs
    let dir: string[];
    try {
        dir = fs.readdirSync(__dirname + '/' + req.username + '/songs/');
    } catch (e) {
        dir = [];
    }
    const songStrings = dir.map(fileName => fileName.substring(fileName.lastIndexOf('#') + 1, fileName.indexOf('.torrent')).trim());
    // We map it to an object similar to Petition
    const songs = songStrings.map(string => {
        return {
            artist: string.substring(0, string.indexOf(' - ')),
            title: string.substring(string.indexOf(' - ') + 3)
        }
    });
    songs.forEach(Utils.normalizeSong);
    req.songs.forEach(Utils.normalizeSong);
    // We only want the non-dowloaded songs
    const rejectedSongs = req.songs.filter(
        // To check if a song is downloaded or not we search it on the songs we obtained from reading the downloaded songs filename
        petitionSong => songs.find(
            downloadedSong => compareTwoStrings(petitionSong.artist.toLocaleLowerCase(), downloadedSong.artist.toLocaleLowerCase()) > 0.85
            && compareTwoStrings(petitionSong.title.toLocaleLowerCase(), downloadedSong.title.toLocaleLowerCase()) > 0.75
        ) == null // If we didn't found a match (i.e: find result is null) it means we don't have that song so we return true to the filter function so this gets included in the array
    );

    if (internal) {
        req.songs = rejectedSongs;
        return;
    }

    console.log(`We couldn't find ${rejectedSongs.length} song(s)`);
    // Get input fileName
    const jsonFileName = process.argv[2].substring(0, process.argv[2].lastIndexOf('.json'));
    fs.writeFileSync(jsonFileName + '-rejected.json', JSON.stringify(rejectedSongs), {encoding: 'utf-8'});
    console.log('Not-found songs written to ' + jsonFileName + '-rejected.json');
    if (rejectedSongs.length <= 100) {
        console.log('Not-found songs');
        for (const song of rejectedSongs) {
            console.log(`${song.artist} - ${song.title}`);
        }
    }
}