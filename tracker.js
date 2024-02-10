import dgram from 'dgram';
import { URL } from 'url';

export async function getPeers(torrent, callback) {
  try {
    const socket = dgram.createSocket('udp4');
    const announceUrl = new URL(torrent.announce.toString('utf8'));

    // 1. Send connect request
    await udpSend(socket, buildConnReq(), announceUrl);

    socket.on('message', async (response) => {
      if (respType(response) === 'connect') {
        // 2. Receive and parse connect response
        const connResp = parseConnResp(response);
        // 3. Send announce request
        await udpSend(socket, buildAnnounceReq(connResp.connectionId), announceUrl);
      } else if (respType(response) === 'announce') {
        // 4. Parse announce response
        const announceResp = parseAnnounceResp(response);
        // 5. Pass peers to callback
        callback(announceResp.peers);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function udpSend(socket, message, url) {
  await socket.send(message, 0, message.length, url.port, url.hostname);
}


export default getPeers;