// cPanel (CloudLinux Node.js Selector / Passenger) startup file.
// The Next.js standalone build lives in ./app — CloudLinux reserves "node_modules" in the
// application root for its own virtual environment, so the bundle cannot sit here directly.
// On start, a pending one-time database import (./import) runs before the site boots.
const path = require('path');

delete process.env.HOSTNAME; // shells export the machine name here; Next would try to bind to it

const setup = require('./setup-db.js');

setup(path.join(__dirname, 'import'), path.join(__dirname, 'app'))
  .catch((err) => console.error('[setup-db]', err))
  .finally(() => require('./app/server.js'));
