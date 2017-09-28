import { Buffer } from 'safe-buffer';
// var debug = require('debug')('ut_messages');
import { EventEmitter } from 'events';
import inherits from 'inherits';

const UT_MESSAGES = 'ut_messages';

export default function() {
	inherits(utMessages, EventEmitter);
	function utMessages(wire) {
		EventEmitter.call(this);
		this._wire = wire;
		this._id = Math.random();
	}

	// Name of the bittorrent-protocol extension
	utMessages.prototype.name = UT_MESSAGES;

	utMessages.prototype.onMessage = function(buf) {
		try {
			var str = buf.toString();
			var data = JSON.parse(str);
			if (data.hack_client_id) {
				this.emit('hack_client_id', data.hack_client_id);
			} else {
			}
			this.emit('hack_message', data);
		} catch (err) {
			// drop invalid messages
			return;
		}
	};
	utMessages.prototype.handleMessage = function() {};

	utMessages.prototype.sendMessage = function(msg) {
		var buf = new Buffer(JSON.stringify(msg));
		this._wire.extended(UT_MESSAGES, buf);
	};

	return utMessages;
}
