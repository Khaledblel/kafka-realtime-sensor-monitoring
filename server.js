const express = require('express');
const pool = require('./db');

const app = express();
const port = 3000;

const path = require('path');
app.use(express.static('public'));

app.use(express.json());

app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM kafka_messages ORDER BY id DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM kafka_messages WHERE id = $1',[id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Message non trouvé" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API REST démarrée sur le port ${port}`);
});