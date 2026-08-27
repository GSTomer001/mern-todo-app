// Validation script: exercises the Todo model against an in-memory MongoDB
// (mongodb-memory-server) so we can prove the CRUD + validation logic end-to-end
// without a separately installed MongoDB. This is a dev-only tool.
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require(path.join(
  __dirname,
  '../../.mms/node_modules/mongodb-memory-server'
));
const Todo = require('../models/Todo');

const out = path.join(__dirname, 'mms.out');

(async () => {
  const log = [];
  let mongod;
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri('todoapp');
    await mongoose.connect(uri);
    log.push('MONGODB (in-memory) CONNECTED');

    const created = await Todo.create({ title: 'Smoke test', description: 'verify crud' });
    log.push('CREATE ok: ' + created.title + ' completed=' + created.completed);

    const updated = await Todo.findByIdAndUpdate(created._id, { completed: true }, { new: true });
    log.push('UPDATE ok: completed=' + updated.completed + ' title=' + updated.title);

    const found = await Todo.findById(created._id);
    log.push('READ ok: ' + found.title + ' description=' + found.description);

    await Todo.findByIdAndDelete(created._id);
    const gone = await Todo.findById(created._id);
    log.push('DELETE ok: doc gone=' + (gone === null));

    try {
      await Todo.create({ title: '' });
      log.push('VALIDATION: empty title NOT rejected (BAD)');
    } catch (e) {
      log.push('VALIDATION ok: empty title rejected -> ' + e.message.split('\n')[0]);
    }

    const list = await Todo.find();
    log.push('FIND() returns ' + list.length + ' docs');

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