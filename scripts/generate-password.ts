import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function generatePassword() {
  rl.question('Enter password to hash: ', async (password) => {
    if (!password || password.length < 8) {
      console.error('❌ Password must be at least 8 characters long');
      rl.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('\n✅ Password hashed successfully!');
    console.log('\nCopy this hashed password to your seed.ts file:');
    console.log('─'.repeat(80));
    console.log(hashedPassword);
    console.log('─'.repeat(80));
    console.log('\nUpdate prisma/seed.ts with:');
    console.log(`password: '${hashedPassword}',`);

    rl.close();
  });
}

generatePassword();
