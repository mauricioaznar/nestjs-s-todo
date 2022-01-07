import { MongoClient } from 'mongodb';
import { Client as PGClient } from 'pg';
import { series } from 'async';
import { exec } from 'child_process';

export default async function setupDatabase() {
  const mongoUrl = `${process.env.MONGO_URL}`;
  const mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();

  const mongoDb = mongoClient.db(`${process.env.MONGO_DATABASE}`);
  const usersCollection = mongoDb.collection('users');
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

  await mongoClient.close();

  const client = new PGClient({
    user: `${process.env.POSTGRE_USER}`,
    host: `${process.env.POSTGRE_HOST}`,
    password: `${process.env.POSTGRE_PASSWORD}`,
    port: process.env.POSTGRE_PORT,
  });
  await client.connect();

  await client.query(`DROP DATABASE IF EXISTS ${process.env.POSTGRE_DATABASE}`);
  await client.query(`create database ${process.env.POSTGRE_DATABASE}`);

  await client.end();

  // try {
  //   const res = await series([() => exec('npm run migration:run:test')]);
  //   console.log(res);
  // } catch (e) {
  //   console.log(e);
  // }
}
