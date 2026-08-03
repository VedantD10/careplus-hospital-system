const { getInitialSeedData } = require('../utils/seedData');

class MemoryDatabase {
  constructor() {
    this.resetData();
  }

  resetData() {
    this.data = getInitialSeedData();
    console.log('[DB] CarePlus Database engine initialized with Indian seed data.');
  }

  query(table) {
    return this.data[table] || [];
  }

  findById(table, id) {
    const list = this.data[table] || [];
    return list.find(item => Number(item.id) === Number(id)) || null;
  }

  findWhere(table, predicate) {
    const list = this.data[table] || [];
    return list.filter(predicate);
  }

  findOneWhere(table, predicate) {
    const list = this.data[table] || [];
    return list.find(predicate) || null;
  }

  insert(table, row) {
    if (!this.data[table]) this.data[table] = [];
    const list = this.data[table];
    const newId = list.length > 0 ? Math.max(...list.map(i => Number(i.id) || 0)) + 1 : 1;
    const newRow = { id: newId, created_at: new Date().toISOString(), ...row };
    list.push(newRow);
    return newRow;
  }

  update(table, id, updates) {
    const item = this.findById(table, id);
    if (!item) return null;
    Object.assign(item, updates, { updated_at: new Date().toISOString() });
    return item;
  }

  delete(table, id) {
    const list = this.data[table] || [];
    const index = list.findIndex(item => Number(item.id) === Number(id));
    if (index !== -1) {
      const deleted = list.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
}

const db = new MemoryDatabase();

module.exports = db;
