// Dashboard RRF server.js

const express = require('express');
var {  sse, fsm, fsmr } = require('./src/lib/sse');
const SALONS = require('./config').SALONS;
const port = process.env.PORT || require('./config').PORT;

var server = express();

//server.use(express.static('client/build'));

// api ancienne version V1 - Nodes connectés sur salon "name"
server.get('/api/svxlink/:name', function(req, res, next){
  res.status(200).send(fsmr(req.params.name))
})
// api V2 - Nodes connectés tous salons sur le serveur
server.get('/nodes', function(req, res,next){
  res.status(200).send(fsm)
})

server.get('/realtime/:name', function(req, res){ sse.init(req, res); } )

server.get('/salons', (req, res) => {
  var slns= [];
  SALONS.forEach( sl => {
    slns.push(sl.name)
  })
  res.json({ data: slns })
})

// console.log that your server is up and running
server.listen(port, () => console.log(`Listening on port ${port}`));

