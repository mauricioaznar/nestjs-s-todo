module.exports = {
  async up(db, client) {
    return db.collection('users').updateMany({}, { $set: { avatar: '' } });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
