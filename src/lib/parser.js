const sliceFile = require('slice-file');

class SvxlinkParser {
	constructor(EE,path,server,salon) {

		const sf = sliceFile(path)        // reading the svxreflector.log file
		sf.follow(0).on('data', line => {
			var event = null;
			var name = "";
			var IP = "";

			line = line.toString('utf8')
			const log = line.split(': ')

			if (line.includes('Login OK')) {
				name = log[1];
				IP = log[2].substring(14,log[2].indexOf(':'));
				event = "loginOk";
			} else if (line.includes('disconnected')){
				if ( ! log[1].startsWith('Client')){
					name = log[1];
					event = "disconnected";
				}
			} else if (log[2] === "Talker start") {
				name = log[1];
				event = "talkerStart";
			} else if (log[2] === "Talker stop"){
				name = log[1];
				event = "talkerStop";
			}

			if ( event !== null){
				if (event === "loginOk"){
					var args = [server, salon, name, IP];
				} else {
					var args = [server, salon, name];
				}

				EE.emit('ReflectorLogic.' + event, args);
			}

	})
}
}

module.exports = SvxlinkParser;