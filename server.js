// Dashboard RRF server.js

const express = require('express');
var {  sse, fsm, fsmr } = require('./src/lib/sse');
//const { SALONS, REMOTES } = require('./config');
var salons = require('./src/lib/salons');

const port = process.env.PORT || require('./config').PORT;
var cors = require('cors');
var server = express();

const db = require('better-sqlite3')('./db/RRF.db3');

//server.use(express.static('client/build'));

// api ancienne version V1 - Nodes connectés sur salon "name"
server.get('/api/svxlink/:name', function(req, res, next){
  res.status(200).send(fsmr(req.params.name))
})
// api V2 - Nodes connectés tous salons sur le serveur
server.get('/nodes', cors(), function(req, res,next){
  res.status(200).send(fsm);
})

//server.get('/realtime/:name', function(req, res){ sse.init(req, res); } )
server.get('/realtime', cors(), function(req, res){ sse.init(req, res); } )

server.get('/salons', (req, res) => {
  res.json({salons: salons})
})

// API nodes database
server.get('/db/node/:name', (req,res) => {
  const row = db.prepare('SELECT * FROM nodes WHERE name = ?').get(req.params.name);
  res.status(200).send(row);
})

server.get('/db/nodes', (req,res) => {
  const rows = db.prepare('SELECT * FROM nodes').all();
  res.status(200).send(rows);
  } )

  server.post('/db/node', (req,res) => {
    const node = {
        name: req.body.name,
        description: req.body.description,
        lat: req.body.lat,
        lon: req.body.lon,
        sysop: req.body.sysop
      };
    const sql = 'INSERT INTO nodes (name, description, lat, lon,sysop) VALUES (...node)';
    db.run(sql, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": node,
          "id" : this.lastID
      })
    });
  })

// console.log that your server is up and running
server.listen(port, () => console.log(`Listening on port ${port}`));

