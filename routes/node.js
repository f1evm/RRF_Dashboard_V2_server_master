const express = require('express');
const router = express.Router();

const db = require('better-sqlite3')('../db/RRF.db3');

router.get('/:name', (req,res) => {
    const row = db.prepare('SELECT * FROM nodes WHERE name = ?').get(req.params.name);
    res.status(200).send(row);
})
  
router.get('/', (req,res) => {
    const rows = db.prepare('SELECT * FROM nodes').all();
    res.status(200).send(rows);
})
  
router.post('/', (req,res) => {
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
  


module.exports = router;


