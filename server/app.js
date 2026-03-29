const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: process.env.NODE_ENV === 'development' ? 10000 : 100 });
app.use('/api', limiter);

app.use('/api/v1', routes);
app.use(errorHandler);

module.exports = app;
