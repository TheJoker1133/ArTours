const bcrypt = require('bcryptjs');

async function run() {
  const password = 'Admin'; // ← CAMBIA esto por la contraseña que quieras
  const hash = await bcrypt.hash(password, 10);
  console.log('Password en texto plano:', password);
  console.log('Hash bcrypt generado:\n', hash);
}

run();
