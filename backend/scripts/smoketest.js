// Throwaway smoke test: exercises the Todo model + controller logic
// directly against a running MongoDB, then disconnects.
const mongoose = require('mongoose');
const Todo = require('../models/Todo');

(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoapp';
  const log = [];
  try {
    await mongoose.connect(uri);
    log.push('MONGO_CONNECTED');

    const created = await Todo.create({ title: 'Smoke test', description: 'verify crud' });
    log.push('CREATE ok -> ' + created.title);

    created.completed = true;
    const updated = await Todo.findByIdAndUpdate(
      created._id,
      { completed: true },
      { new: true }
    );
    log.push('UPDATE completed=' + updated.completed);

    const found = await Todo.findById(created._id);
    log.push('READ ok -> ' + found.title);

    await Todo.findByIdAndDelete(created._id);
    const gone = await Todo.findById(created._id);
    log.push('DELETE ok, doc gone=' + (gone === null));

    await mongoose.disconnect();
    log.push('ALL PASS');
    require('fs').writeFileSync(__dirname + '/smoke.out', log.join('\n'));
    process.exit(0);
  } catch (e) {
    log.push('FAIL: ' + e.message);
    require('fs').writeFileSync(__dirname + '/smoke.out', log.join('\n'));
    process.exit(1);
  }
})();