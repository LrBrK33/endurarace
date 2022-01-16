import { db } from './src/firebase.ts';
import { writeBatch, batch } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { parse } from 'csv-parse';
const parser = promisify(parse);

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

async function writeToFirestore(records, db) {
  //   const batchCommits = [];
  // const batch = db.batch();
  records.forEach((record, i) => {
    var docRef = db
      .collection('events')
      .doc('dragonslayer-2021-11-21')
      .collection('results')
      .doc();
    batch.set(docRef, record);
    // if ((i + 1) % 500 === 0) {
    //   console.log(`Writing record ${i + 1}`);
    //   batchCommits.push(batch.commit());
    //   batch = db.batch();
    // }
  });
  //   batchCommits.push(batch.commit());
  //   return Promise.all(batchCommits);
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
