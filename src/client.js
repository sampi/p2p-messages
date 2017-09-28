import WebTorrent from 'webtorrent';
import utMessages from './utMessages';
import constants from './constants';

export default function setup(opts = {}) {
	return new Promise((resolve, reject) => {
		try {
			const clientTorrent = new WebTorrent({
				maxConns: constants.MAX_CONNECTIONS
			});
			clientTorrent.add(
				opts.magnetURI,
				{
					maxWebConns: constants.MAX_CONNECTIONS
				},
				torrent => {
					const wire = torrent.wires[0];
					wire.use(utMessages());
					wire.ut_messages.on('hack_message', opts.onMessage);
					wire.ut_messages.on('hack_client_id', clientId =>
						resolve({
							clientId,
							sendMessage: message => {
								message.clientId = clientId;
								return wire.ut_messages.sendMessage.apply(wire.ut_messages, [
									message
								]);
							}
						})
					);
				}
			);
		} catch (e) {
			console.error('Something went wrong', e);
			reject(e);
		}
	});
}
