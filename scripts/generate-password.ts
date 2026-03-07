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

    // const hashedPassword = await bcrypt.hash(password, 10);

    rl.close();
  });
}

generatePassword();
