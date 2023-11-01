import 'dotenv/config';
import { MongoClient } from 'mongodb';
import {
  sendUserNotification,
  sendFinanceDeptNotification,
} from './notification.js';

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
const invoicesDueInADay = 86400000;

async function getDB() {
  try {
    await client.connect();
    return client.db('kaende');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export const start = async () => {
  try {
    console.log('Connecting to DB...');
    const db = await getDB();

    const runNotificationCycle = async () => {
      const invoices = await db
        .collection('invoices')
        .find({})
        .toArray();
      const tasks = invoices.map(
        (invoice) =>
          new Promise((resolve) => {
            const { dueDate } = invoice;
            const today = Date.now();
            if (today <= dueDate) {
              sendUserNotification(invoice)
                .then(() => sendFinanceDeptNotification(invoice))
                .then(resolve)
                .catch(() => resolve());
            } else {
              resolve();
            }
          }),
      );
      await Promise.all(tasks);
    };

    console.log('Starting notification cycle...');
    setInterval(runNotificationCycle, invoicesDueInADay);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
