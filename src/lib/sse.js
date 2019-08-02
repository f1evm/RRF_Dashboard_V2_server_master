const SSE = require('express-sse')
const Fsm = require('./fsm') 
const { SALONS, SRVRNR } = require('../../config')
const SvxlinkParser = require('./parser')
const EventEmitter = require('events');


/* Liste des événements */
const EVENTS = [
	'ReflectorLogic.loginOk',
	'ReflectorLogic.disconnected',
	'ReflectorLogic.talkerStart',
	'ReflectorLogic.talkerStop'
];

var parsers = [];
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

EVENTS.forEach( event => {
	eventEmitter.on(event, data => {
		sse.send(data || [], event)
		//console.log('### ', sln.name, '::>',event, data)
	})
})

SALONS.forEach(sln => {
	if (sln.file !== '') {
		parsers[sln.name] = new SvxlinkParser(eventEmitter,sln.file, SRVRNR, sln.name);
	} else {

	}
})

module.exports.fsm = fsm
module.exports.fsmr = fsmr
module.exports.sse = sse
