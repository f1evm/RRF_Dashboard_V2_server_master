/* Configuration du TABLEAU DE BORD RRF - API SERVER*/

/* Serveur */

const PORT = 4443;        // Port Number
const PROTOCOL = "https";    // Http, https protocols
const SRVRNR = 1;         // Server Number
const SRVRNAME = "RRF1"   // Server Name


/* Liste et paramètres des salons hébergés sur ce serveur */

const SALONS = [
  {name: "RRF", 
      file: "./logs/RRF1/svxreflector.log",
  },
  {name: "International", 
      file: "./logs/RRF3/svxreflectorint.log",
  }
];
  

module.exports.PORT=PORT;
module.exports.PROTOCOL=PROTOCOL;
module.exports.SRVRNR=SRVRNR;
module.exports.SRVRNAME=SRVRNAME;
module.exports.SALONS=SALONS;

