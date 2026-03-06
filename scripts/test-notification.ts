/**
 * Test script to send a notification
 *
 * Usage:
 * 1. Make sure user has enabled notifications in the app
 * 2. Get their userId from the database
 * 3. Run: npx tsx scripts/test-notification.ts
 */

import { sendPushNotification } from '../lib/firebase-admin';

async function testNotification() {
  // Replace with actual user ID who has enabled notifications
  const userId = 'cmm3crqnq0000ywuzu4swg9dn';

  try {
    const result = await sendPushNotification({
      userId,
      title: '🧪 Test Notification',
      body: 'This is a test push notification from your Addis Life app!',
      type: 'system',
      link: '/admin',
      data: {
        test: 'true',
        timestamp: new Date().toISOString(),
      },
    });

    if (result.success) {
      if (result.messageId) {
      } else {
      }
    } else {
    }
  } catch {}
}

testNotification();
