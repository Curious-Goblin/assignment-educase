const express = require('express');
const router = express.Router();
const db = require('../db/connection');

function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadian = (value) => (value * Math.PI) / 180;
    const R = 6371; 
    const distLat = toRadian(lat2 - lat1);
    const distLon = toRadian(lon2 - lon1);

    const a = 
        Math.sin(distLat / 2) * Math.sin(distLat / 2) +
        Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) *
        Math.sin(distLon / 2) * Math.sin(distLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'School added successfully.', schoolId: result.insertId });
    });
});

// List Schools API
router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Latitude and Longitude are required.' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error.' });
        }

        const schoolsWithDistance = results.map((school) => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    });
});

module.exports = router;
