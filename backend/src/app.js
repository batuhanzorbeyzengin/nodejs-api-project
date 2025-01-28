const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const routes = require('./routers/v1');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./helpers/logger.helper');

const app = express();

app.use(helmet(config.helmet));
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use(errorHandler);

app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`, {
        env: config.env,
        cors: {
            origin: config.cors.origin,
            methods: config.cors.methods
        }
    });
});

module.exports = app;
