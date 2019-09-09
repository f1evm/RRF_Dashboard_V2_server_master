//const salons = require('./salons')
const {SALONS, REMOTES, SRVRNR, EXCLUSIONS} = require('../../config');
const fetch = require("node-fetch");

function fsm(EE, changeHandler = () => {}, init = {}) {
	const states = Object.create(null)

    var salons = [];

    const fetchRemoteSalons = async () => {
		console.log("satrt fetchRemoteSalons")
   
		const promises = await REMOTES.map( async rmt => {
			const res = await fetch(rmt.host + '/salons')
			.then(response => response.json())
			console.log('res = ', res)
			return res
		})
		console.log("promises : ",promises)
		const slns = await Promise.all(promises)
		.then(sln => {
			sln.map(sln1 => {
				sln1.data.map(sl => {
                    if (! salons.includes(sl)){
                    salons.push(sl);
					}
				})
			})
			return salons
		})
 		console.log("salons = ", slns)
		console.log("end fetchRemoteSalons")
    }
	
	
    const initSalons = async () => {
        SALONS.forEach(salon => {
            salons.push(salon.name);
        })
        await fetchRemoteSalons()
		//.then(() => {return salons;})
		.then(()=> {return salons})
    }
    
	const reset = async () => {
		console.log("Enter reset() ")
        var slns = [];
        states.nodes = [];
		states.transmitters = {};
		slns = await initSalons()
		//.then(xy => { console.log ("reset xy : ",xy)})
       // console.log("reset slns ",slns);
        console.log("reset salons ",salons);
        salons.forEach(sln => {
			console.log("reset sln : ", sln)
			states.transmitters[sln] = null;
		})
		console.log("reset transmitters : ", states.transmitters)
		console.log("Fin de reset() ")
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
		var [a,b,c] = nd;
		for (var i = 0; i < arr.length; i++) {
			var [d,e,f] = arr[i];
			if ((a === d) && (b === e) && (c === f)){
				return i;
			}
		}
		return -1;
	}
	
	isExcluded = (nd) => {
		if (nd[0] === SRVRNR){
			const excl = EXCLUSIONS[nd[1]];
			if (excl.includes(nd[2])){
				return true
			}
		}
		return false
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
		if (! isExcluded(data)){
			states.transmitters[data[1]] = data;
//			console.log("talkerStart ",data)
		}
	})

	on('ReflectorLogic.talkerStop', (data) => { // eslint-disable-line no-unused-vars
		if (! isExcluded(data)){
			states.transmitters[data[1]] = null;
//			console.log("talkerStop ",data)
		}
	})

	return states
}


module.exports= fsm;

