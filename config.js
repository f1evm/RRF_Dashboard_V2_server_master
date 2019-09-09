/* Configuration du TABLEAU DE BORD RRF - API SERVER*/

/* Serveur */

const PORT = 4440;        // Port Number
const PROTOCOL = "http";    // Http, https protocols
const SRVRNR = 1;         // Server Number
const SRVRNAME = "RRF1"   // Server Name


/* Liste et paramètres des salons hébergés sur ce serveur */

const SALONS = [
  {name: "RRF", 
      file: "./logs/RRF1/svxreflector.log"
  }
];

const EXCLUSIONS = {"RRF": ["RRF"]}

/* Liste des serveurs distants */

const REMOTES = [
  {
    srvNum: 3,
    srvName: "RRF3",
    host: "http://rrf3.f5nlg.ovh:4443"
}
]

module.exports.PORT=PORT;
module.exports.PROTOCOL=PROTOCOL;
module.exports.SRVRNR=SRVRNR;
module.exports.SRVRNAME=SRVRNAME;
module.exports.SALONS=SALONS;
module.exports.REMOTES=REMOTES;
module.exports.EXCLUSIONS=EXCLUSIONS;

