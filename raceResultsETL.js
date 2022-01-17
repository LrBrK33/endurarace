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

async function writeToFirestore(results, db) {
  const batch = db.batch();
  // write each result to Firestore
  results.forEach((result, i) => {
    var resultsRef = db
      .collection('events')
      .doc(docName)
      .collection('results')
      .doc();
    batch.set(resultsRef, result);
  });
  // write event info to Firestore
  var eventInfoRef = db.collection('events').doc(docName);
  batch.set(eventInfoRef, { eventName, eventDate });
  await batch.commit();
}

async function importCsv(csvFileName) {
  const fileContents = await readFile(csvFileName, 'utf8');
  const results = await parser(fileContents, { columns: true });
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

  // iterate over results, replace lap time strings with time in milliseconds
  results.forEach((result) => {
    result.lap1 = getMillisFromTime(result.lap1);
    result.lap2 = getMillisFromTime(result.lap2);
    result.lap3 = getMillisFromTime(result.lap3);
    result.twoLapTotal = getMillisFromTime(result.twoLapTotal);
    result.total = getMillisFromTime(result.total);
  });
  try {
    await writeToFirestore(results, db);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log(`Wrote ${results.length} results`);
  rl.close();
}

// terminal prompts
rl.question('Event name: ', function (name) {
  rl.question('Event date (YYYY-MM-DD): ', function (date) {
    eventName = name;
    eventDate = date;
    docName = `${name}-${date}`;
    importCsv(process.argv[2]).catch((e) => console.error(e));
  });
});

rl.on('close', function () {
  process.exit(0);
});
