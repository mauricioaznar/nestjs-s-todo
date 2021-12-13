import mongo, { MongoClient } from 'mongodb';

export default async function setupDatabase() {
  const url = `${process.env.MONGO_URL}`;
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(`${process.env.MONGO_DATABASE}`);
  const usersCollection = db.collection('users');
  await usersCollection.deleteMany({});

  await usersCollection.insertMany([
    {
      password: '$2b$10$WqFirTRLVyzCyI/M679Vr.qEn5.MEmkUOCDIoJEE.xAjSr3b5Tk5.',
      username: 'maria',
      admin: true,
      avatar: null,
    },
    {
      password: '$2b$10$WqFirTRLVyzCyI/M679Vr.qEn5.MEmkUOCDIoJEE.xAjSr3b5Tk5.',
      username: 'john',
      admin: true,
      avatar: null,
    },
  ]);

  await client.close();
}
