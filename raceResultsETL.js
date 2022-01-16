import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { parse } from 'csv-parse';
import { adminConfig } from './config/endurarace-5a58a-firebase-adminsdk-8tje2-2294bb53ac.js';
const parser = promisify(parse);

const app = initializeApp({ credential: cert(adminConfig) }, 'test');
const db = getFirestore(app);

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

async function writeToFirestore(records, db) {
  const batch = db.batch();
  records.forEach((record, i) => {
    var docRef = db
      .collection('events')
      .doc('dragonslayer-2021-11-21')
      .collection('results')
      .doc();
    batch.set(docRef, record);
  });
  await batch.commit();
}

async function importCsv(csvFileName) {
  const fileContents = await readFile(csvFileName, 'utf8');
  const records = await parser(fileContents, { columns: true });
  try {
    await writeToFirestore(records, db);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log(`Wrote ${records.length} records`);
}

importCsv(process.argv[2]).catch((e) => console.error(e));
