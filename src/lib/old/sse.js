const SSE = require('express-sse')
const Fsm = require('./fsm') 
const { SALONS, SRVRNR, REMOTES } = require('../../config')
const SvxlinkParser = require('./parser')
const EventEmitter = require('events');
const fetch = require("node-fetch");


/* Liste des événements */
const EVENTS = [
	'ReflectorLogic.loginOk',
	'ReflectorLogic.disconnected',
	'ReflectorLogic.talkerStart',
	'ReflectorLogic.talkerStop'
];

var parsers = [];
var sser = [];	// connexions aux remote servers
var sse = new SSE();

var eventEmitter = new EventEmitter();
fsm = new Fsm(eventEmitter);

fsmr = (salon) => {
	var st = fsm;
	var str = {nodes:[], transmitter: st.transmitter};
	st.nodes.map(nd => {
		[,sln,name] = nd;
		if (sln === salon) str.nodes.push(name);
	})
	return str;
}

Fetch = (url) => {
	fetch(url)
	.then(response => response.json())
	.then(data => {
	  return data;
		//console.log('fetch: init : ',{data})
	})
	.catch(err => {
		console.log('slFetch Error : ', err)
		return false;
	})

}



EVENTS.forEach( event => {
	eventEmitter.on(event, data => {
		sse.send(data || [], event)
		//console.log('### ', sln.name, '::>',event, data)
	})
})

SALONS.forEach(sln => {
	if (sln.file && (sln.file !== '')) {
		parsers[sln.name] = new SvxlinkParser(eventEmitter,sln.file, SRVRNR, sln.name);
	} 
})


REMOTES.forEach(rmt => {
	sser[rmt.name] = new EventSource(rmt.host + '/realtime');
	Fetch(rmt.host + '/nodes')
	.then (data => {
		data.nodes.map(nd => {
			eventEmitter.emit('ReflectorLogic.loginOk', nd);
		})
	})
	.catch( err => {
		console.log(err, 'Erreur Fetching remote ', rmt.name);
	})

	sser[rmt.name].addEventListener('ReflectorLogic.loginOK', evt => {
		eventEmitter.emit ('ReflectorLogic.loginOK', evt.data);
	})
	sser[rmt.name].addEventListener('ReflectorLogic.disconnected', evt => {
		eventEmitter.emit ('ReflectorLogic.disconnected', evt.data);
	})
	sser[rmt.name].addEventListener('ReflectorLogic.talkerStart', evt => {
		eventEmitter.emit ('ReflectorLogic.talkerStart', evt.data);
	})
	sser[rmt.name].addEventListener('ReflectorLogic.talkerStop', evt => {
		eventEmitter.emit ('ReflectorLogic.talkerStop', evt.data);
	})
})


module.exports.fsm = fsm
module.exports.fsmr = fsmr
module.exports.sse = sse
