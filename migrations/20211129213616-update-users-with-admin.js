module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    return db.collection('users').updateMany({}, { $set: { admin: false } });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
