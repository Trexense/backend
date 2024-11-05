const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const router = require('./routes/index');
const config = require('./configs/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Route untuk Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
	res.send('Hewoo Wudd');
});


app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
	console.log(`Swagger UI tersedia di http://localhost:${config.port}/api-docs`);
});

app.use(router);
app.use(errorHandler);
