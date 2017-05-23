'use strict';
const express = require('express');

//constants
const PORT = 3142;

const app = express();
app.get('/', (req, res) => {
	console.log('root');
	res.send('Goodbye, Cruel World!');
});

app.get('/test', (req, res) => {
	res.send(`<h1>This is the toast of tests!</h1>`);
});

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);
