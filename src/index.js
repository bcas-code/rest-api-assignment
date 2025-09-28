const express = require('express');
const { randomUUID, randomBytes } = require('crypto'); // added for ID generation
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

// In-memory users store
const users = [];
const genId = () => (typeof randomUUID === 'function' ? randomUUID() : randomBytes(16).toString('hex'));

// 1) Create a User
app.post('/users', (req, res) => {
    const { name, email } = req.body || {};
    if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required' });
    }
    const user = { id: genId(), name, email };
    users.push(user);
    return res.status(201).json(user);
});

// 2) Retrieve a User
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'user not found' });
    }
    return res.status(200).json(user);
});

// 3) Update a User
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body || {};
    if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required' });
    }
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ error: 'user not found' });
    }
    users[idx] = { ...users[idx], name, email };
    return res.status(200).json(users[idx]);
});

// 4) Delete a User
app.delete('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ error: 'user not found' });
    }
    users.splice(idx, 1);
    return res.status(204).send();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing
