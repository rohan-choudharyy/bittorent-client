import fs from 'fs/promises';
import bencode from 'bencode';
import tracker from './tracker.js';

async function main() {
  try {
    const torrentData = await fs.readFile('puppy.torrent');
    const torrent = bencode.decode(torrentData);

    await tracker.getPeers(torrent, (peers) => {
      console.log('List of peers: ', peers);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
