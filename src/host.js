import WebTorrent from 'webtorrent';
import uuid from './uuid';
import utMessages from './utMessages';
import constants from './constants';

const clients = {};

export default function setup(opts = {}) {
	try {
		const hostTorrent = new WebTorrent({
			maxConns: constants.MAX_CONNECTIONS
		});
		const id = uuid();

		const buf = new Buffer(id);
		buf.name = id;
		return new Promise((resolve, reject) => {
			hostTorrent.seed(buf, torrent => {
				resolve(torrent.magnetURI);
				torrent.on('wire', (wire, addr) => {
					let clientId = null;
					wire.use(utMessages());
					wire.peerExtendedMapping.ut_messages = 2; //HACK!
					if (opts.onConnectionRequest()) {
						clientId = wire.peerId;
						clients[clientId] = {
							clientId,
							sendMessage: wire.ut_messages.sendMessage.bind(wire.ut_messages)
						};
						setTimeout(() => {
							wire.ut_messages.on('hack_message', opts.onMessage);
							clients[clientId].sendMessage({
								hack_client_id: clientId
							});
						}, constants.CLIENT_SETUP_TIMEOUT);

						opts.onNewClient(clients[clientId]);
					} else {
						console.log('Client rejected from pool.');
					}
					wire.on('end', () => {
						if (clientId) {
							console.log(`${clientId} disconnected.`);
							clients[clientId].sendMessage = () => {};
						}
					});
				});
				torrent.on('error', () => console.log('error', arguments));
				torrent.on('warn', () => console.log('warn', arguments));
			});
		});
	} catch (e) {
		console.error('Something went wrong', e);
	}
}

export function sendMessages(data) {
	Object.keys(clients).forEach(clientId => {
		clients[clientId].sendMessage(data);
	});
}

export function getClients() {
	return clients;
}
