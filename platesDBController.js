// platesDBController.js

const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const router = express.Router();
const db = new sqlite3.Database('platesDB.db');

router.use(bodyParser.json());

router.post('/add-plate', (req, res) => {
    const { licensePlate, variant, issuedDate, recordedDate, passengers, grade, plateType, notes } = req.body;

    db.run(
        'INSERT INTO platesDB (LicensePlate, Variant, IssuedDate, RecordedDate, Passengers, Grade, plateType, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [licensePlate, variant, issuedDate, recordedDate, passengers, grade, plateType, notes],
        (err) => {
            if (err) {
                console.error('Error adding plate:', err);
                return res.status(500).json({ error: 'Internal server error.', details: err.message });
            }

            res.json({ message: 'Plate added successfully.' });
        }
    );
});


// platesDBController.js

router.get('/view-all-plates', (req, res) => {
    db.all('SELECT * FROM platesDB', (err, rows) => {
        if (err) {
            console.error('Error fetching plates:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        res.json({ plates: rows }); // Wrap the array of plates in an object
    });
});


router.get('/search-plate', (req, res) => {
    const searchTerm = req.query.search;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required.' });
    }

    db.get(
        'SELECT * FROM platesDB WHERE LicensePlate = ?',
        [searchTerm],
        (err, row) => {
            if (err) {
                console.error('Error searching for plate:', err);
                return res.status(500).json({ error: 'Internal server error.' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Plate not found.' });
            }

            res.json({ plate: row });
        }
    );
});

module.exports = router;
