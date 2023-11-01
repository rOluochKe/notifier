import { IncomingWebhook } from '@slack/webhook';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const FINANCE_DEPT_WEBHOOK_URL = process.env.FINANCE_DEPT_WEBHOOK_URL;

const userWebhook = new IncomingWebhook(SLACK_WEBHOOK_URL);
const financeDeptWebhook = new IncomingWebhook(
  FINANCE_DEPT_WEBHOOK_URL,
);

const sendUserNotification = async (invoice) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const { number, currency, amount, dueDate } = invoice;
      await userWebhook.send({
        text: `Hi There!\nThe invoice ${number} of ${currency} ${amount} is due on ${dueDate}.`,
      });
      return;
    } catch (error) {
      console.error(
        'Error sending user Slack notification (Attempt ' +
          (attempts + 1) +
          '):',
        error,
      );
      attempts++;
    }
  }

  console.error(
    'Failed to send user Slack notification after ' +
      maxAttempts +
      ' attempts.',
  );
};

const sendFinanceDeptNotification = async (invoice) => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const { number, currency, amount, dueDate } = invoice;
      await financeDeptWebhook.send({
        text: `Attention Finance Department!\nThe invoice ${number} of ${currency} ${amount} is due on ${dueDate}.`,
      });
      return;
    } catch (error) {
      console.error(
        'Error sending finance department Slack notification (Attempt ' +
          (attempts + 1) +
          '):',
        error,
      );
      attempts++;
    }
  }

  console.error(
    'Failed to send finance department Slack notification after ' +
      maxAttempts +
      ' attempts.',
  );
};

export { sendUserNotification, sendFinanceDeptNotification };
