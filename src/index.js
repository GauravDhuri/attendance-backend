const { join } = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: join(__dirname, '..', '.env') });

// Boot the application
require('./boot/index.js');
