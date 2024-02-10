'use strict';
import fs from "fs";
import bencode from "bencode";
import dgram from "dgram";
import {Buffer} from "buffer";
import url from "URL";

const torrent = bencode.decode(fs.readFileSync("sample.torrent"));
const Url = URL(torrent.announce.toString('utf8'));

const socket = dgram.createSocket('udp4');
const myMsg = Buffer.from('This is a test!', 'utf8');
socket.send(myMsg, 0, myMsg.length, url.port, url.host, () => {});
socket.on('message', msg => {
  console.log('message is', msg);
});

