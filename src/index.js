export { default as setupHost, sendMessages } from './host';
export { default as setupClient } from './client';

/*
// DEMO

const isHost = window.location.hash === '#1';

if (isHost) {
	const opts = {
		onConnectionRequest: () => true,
		onNewClient: client => {
			console.log('New client connected', client.clientId);
			return true;
		},
		onMessage: data => console.log('Message from Client:', data)
	};
	setupHost(opts).then(magnetURI => {
		console.log('[HOST] Now accepting connections!');
		console.log('http://localhost:3000/#' + magnetURI);
	});

	setInterval(() => {
		sendMessages({ data: 'sent to all clients every second' });
	}, 1000);

	setTimeout(() => {
		console.log('[HOST] 30seconds have passed, not allowing connections anymore!');
		opts.allowConnections = () => false;
	}, 30000);
} else {
	const opts = {
		magnetURI: window.location.hash.substring(1),
		onMessage: data => {
			console.log('Message from Host:', data);
		}
	};
	setupClient(opts).then(({ clientId, sendMessage }) => {
		console.log(`[CLNT] ${clientId} connected to Host`);
		setInterval(() => sendMessage({ data: 'stuff from client to host every second' }), 1000);
	});
}

*/
