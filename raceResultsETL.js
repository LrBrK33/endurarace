import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import { promisify } from 'util';
import { parse } from 'csv-parse';
import { createInterface } from 'readline';
import { adminConfig } from './config/endurarace-5a58a-firebase-adminsdk-8tje2-2294bb53ac.js';
const parser = promisify(parse);

const app = initializeApp({ credential: cert(adminConfig) }, 'test');
const db = getFirestore(app);

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let eventName = '';
let eventDate = '';
let docName = '';

rl.question('Event name: ', function (name) {
  rl.question('Event date (YYYY-MM-DD): ', function (date) {
    eventName = name;
    eventDate = date;
    docName = `${name}-${date}`;
    console.log(eventName, eventDate, docName);
    rl.close();
  });
});
rl.on('close', function () {
  process.exit(0);
});

async function writeToFirestore(records, db) {
  const batch = db.batch();
  records.forEach((record, i) => {
    var docRef = db
      .collection('events')
      .doc(eventName)
      .collection('results')
      .doc();
    batch.set(docRef, record);
  });
  await batch.commit();
}

async function importCsv(csvFileName) {
  const fileContents = await readFile(csvFileName, 'utf8');
  const records = await parser(fileContents, { columns: true });
  function getMillisFromTime(time) {
    if (time.length > 0) {
      const timeSplit = time.split(':');
      return (
        Number(timeSplit[0]) * 60 * 60 * 1000 +
        Number(timeSplit[1]) * 60 * 1000 +
        Number(timeSplit[2]) * 1000
      );
    }
    return 0;
  }
  // iterate over records, replace lap time strings with time in milliseconds
  records.forEach((record) => {
    record.lap1 = getMillisFromTime(record.lap1);
    record.lap2 = getMillisFromTime(record.lap2);
    record.lap3 = getMillisFromTime(record.lap3);
    record.twoLapTotal = getMillisFromTime(record.twoLapTotal);
    record.total = getMillisFromTime(record.total);
  });
  // console.log(records);
  // try {
  //   await writeToFirestore(records, db);
  // } catch (e) {
  //   console.error(e);
  //   process.exit(1);
  // }
  // console.log(`Wrote ${records.length} records`);
}

importCsv(process.argv[2]).catch((e) => console.error(e));
