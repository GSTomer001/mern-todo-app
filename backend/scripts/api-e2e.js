// Full-stack integration test: starts the real Express server (server.js)
// with MONGO_URI pointed at an in-memory MongoDB, then exercises the
// REST endpoints end-to-end. Dev-only tool. Writes results to api-e2e.out.
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require(path.join(
  __dirname,
  '../../.mms/node_modules/mongodb-memory-server'
));

const out = path.join(__dirname, 'api-e2e.out');
const base = 'http://localhost:5100/api/todos';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const log = [];
  let mongod;
  try {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri('todoapp');
    process.env.PORT = '5100';

    require('../server'); // boots Express and attaches to the mongoose default connection
    // Wait until the mongoose default connection is ready AND port 5100 responds.
    for (let i = 0; i < 40; i++) {
      let ok = true;
      try {
        if (mongoose.connection.readyState !== 1) ok = false;
      } catch {
        ok = false;
      }
      try {
        const r = await fetch(base);
        if (!r.ok && r.status !== 200) ok = false;
      } catch {
        ok = false;
      }
      if (ok) break;
      await sleep(500);
    }
    log.push('SERVER_UP readyState=' + mongoose.connection.readyState);

    // POST (create)
    const create = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'E2E todo', description: 'via api' }),
    });
    const created = await create.json();
    log.push('POST ' + create.status + ' created=' + created.data.title + ' id=' + created.data._id);

    // GET (list) — should include it
    const listRes = await fetch(base);
    const list = await listRes.json();
    log.push('GET  ' + listRes.status + ' count=' + list.count);

    // PUT (update / complete)
    const upd = await fetch(base + '/' + created.data._id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    const updated = await upd.json();
    log.push('PUT  ' + upd.status + ' completed=' + updated.data.completed);

    // DELETE
    const del = await fetch(base + '/' + created.data._id, { method: 'DELETE' });
    log.push('DELETE ' + del.status + ' msg=' + ((await del.json()).message || ''));

    // POST validation (empty title)
    const bad = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    log.push('BAD  ' + bad.status + ' (expected 400)');

    await mongoose.disconnect();
    await mongod.stop();
    log.push('ALL PASS ✔');
    fs.writeFileSync(out, log.join('\n'));
    process.exit(0);
  } catch (e) {
    log.push('FAIL: ' + e.message);
    if (mongod) {
      try {
        await mongod.stop();
      } catch {}
    }
    try {
      await mongoose.disconnect();
    } catch {}
    fs.writeFileSync(out, log.join('\n'));
    process.exit(1);
  }
})();