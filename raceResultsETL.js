import { db } from './src/firebase.ts';
import { writeBatch } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { parse } from 'csv-parse';
// console.log(csvParse);
// const parse = promisify(csvParse);

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

function writeToFirestore(records) {
  const batchCommits = [];
  let batch = db.batch();
  records.forEach((record, i) => {
    var docRef = db.collection('rainfall').doc(record.SUBDIVISION);
    batch.set(docRef, record);
    if ((i + 1) % 500 === 0) {
      console.log(`Writing record ${i + 1}`);
      batchCommits.push(batch.commit());
      batch = db.batch();
    }
  });
  batchCommits.push(batch.commit());
  return Promise.all(batchCommits);
}

async function importCsv(csvFileName) {
  const fileContents = await readFile(csvFileName, 'utf8');
  const records = await parse(fileContents, { columns: true });
  try {
    await writeToFirestore(records);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log(`Wrote ${records.length} records`);
}

importCsv(process.argv[2]).catch((e) => console.error(e));
