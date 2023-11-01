import { start } from './index.js';

const startApp = async () => {
  try {
    await start();
  } catch (error) {
    console.error('Error starting the application:', error);
  }
};

startApp();
