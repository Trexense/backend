const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const router = require('./routes/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('Hewoo Wudd');
});

app.listen(3000, () => {
	console.log('Server running on port 3000');
});

app.use(router);
app.use(errorHandler);
