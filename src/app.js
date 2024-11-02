const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hewoo Wudd');
});

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
