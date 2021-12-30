module.exports = {
  async up(db, client) {
    return db.collection('todos').updateMany({}, { $set: { items: [] } });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
