const {SALONS, REMOTES} = require('../../config');
const fetch = require("node-fetch");

var salons=[];

async function fetchRemoteSalons(){
    await REMOTES.forEach(rmt => {
		fetch(rmt.host + '/salons')
		.then(response => response.json())
		.then (data => {
 //   	    console.log("salons 1 data: ",data);
			data.data.map(sl => {
				if (! salons.includes(sl)){
                salons.push(sl);
    	        }
			})
		})
		.catch( err => {
			console.log(err, 'Erreur Fetching remote ', url);
		})

	})
}

SALONS.forEach(salon => {
    salons.push(salon.name);
})

fetchRemoteSalons();

//console.log("salons 2 : ", salons)

module.exports.salons=salons
