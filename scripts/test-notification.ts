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

  console.log('🧪 Testing push notification...');
  console.log('📧 Sending to user:', userId);

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

    console.log('\n✅ Result:', result);

    if (result.success) {
      if (result.messageId) {
        console.log('🎉 Push notification sent successfully!');
        console.log('📱 Message ID:', result.messageId);
      } else {
        console.log(
          '💾 Notification saved to Firestore (no push sent - user needs to enable notifications)'
        );
      }
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testNotification();
