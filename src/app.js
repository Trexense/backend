const express = require('express');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./configs/swagger');
const router = require('./routes/index');
const config = require('./configs/index');
const { accessStrategy, refreshStrategy } = require('./configs/passport');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
passport.use('jwt-access', accessStrategy);
passport.use('jwt-refresh', refreshStrategy);

app.use(cors());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
	res.send('Hewoo Wudd');
});

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
	console.log(
		`Swagger UI tersedia di http://localhost:${config.port}/api-docs`
	);
});

app.use(router);
app.use(errorHandler);
