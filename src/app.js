const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const router = require('./routes/index');
const config = require('./configs/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.send('Hewoo Wudd');
});

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
});

app.use(router);
app.use(errorHandler);
