const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const SECRET = "okinawa2026";
const FILE = "storage.json";

let storage = {};
if (fs.existsSync(FILE)) {
    storage = JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save() {
    fs.writeFileSync(FILE, JSON.stringify(storage));
}

app.post('/save', (req, res) => {
    const { key, data, secret } = req.body;
    if (secret !== SECRET) return res.status(403).send("Forbidden");
    if (!storage[key]) storage[key] = {};
    Object.assign(storage[key], data);
    save();
    res.send("OK");
});

app.get('/get/:key', (req, res) => {
    if (req.headers['x-secret'] !== SECRET) return res.status(403).send("Forbidden");
    const key = decodeURIComponent(req.params.key);
    res.json(storage[key] || null);
});

app.get('/list', (req, res) => {
    if (req.headers['x-secret'] !== SECRET) return res.status(403).send("Forbidden");
    res.json(Object.keys(storage));
});

app.get('/ping', (req, res) => res.send("OK"));

app.listen(3000, () => console.log("Server aktif!"));
