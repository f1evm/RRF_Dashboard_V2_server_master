function fsm(EE, changeHandler = () => {}, init = {}) {
	const states = Object.create(null)

	function reset() {
		states.nodes = [];
		states.transmitter = ''
	}

	reset()

	Object.assign(states, init)

	function on(event, handler) {
		if (typeof EE.addEventListener === 'function') {
			EE.addEventListener(event, evt => {
				handler(JSON.parse(evt.data))
			})
		} else {
			EE.on(event, handler)
		}
	}

	// node = [server, salon, name, IP];

	nodeIndex = (arr, nd) => {	
		for (var i = 0; i < arr.length; i++) {
			var [,,ndname] = nd;
			var [,,arrname] = arr[i];
			if (ndname === arrname){
				return i;
			}
		}
		return -1;
	}
	
	on('ReflectorLogic.loginOk', (data) => {
		const idx = nodeIndex(states.nodes, data);
		if (idx <0 ) {
			states.nodes.unshift(data);
		}
	})

	on('ReflectorLogic.disconnected', (data) => {
		const idx = nodeIndex(states.nodes, data);
		if (idx > -1) {
			states.nodes.splice(idx, 1)
		}
	})

	on('ReflectorLogic.talkerStart', (data) => {
		var name = data[2];
		if (((name.indexOf('RRF') !== 0) && (name.indexOf('GW-E') !== 0)) || (states.transmitter === '')){
			states.transmitter = name;
		} 
	})

	on('ReflectorLogic.talkerStop', (data) => { // eslint-disable-line no-unused-vars
		states.transmitter = '';
	})

	return states
}


module.exports= fsm;

