require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');
const supabase = require('../src/config/supabase');

async function createAdmin() {
  const email = process.argv[2] || 'admin@cinematch.com';
  const password = process.argv[3] || 'admin123';

  console.log(`Creando administrador: ${email}...`);

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('admins')
    .insert([{ email, password_hash }])
    .select();

  if (error) {
    console.error('Error al crear el admin:', error.message);
  } else {
    console.log('¡Administrador creado con éxito!');
    console.log('Email:', email);
    console.log('Password:', password);
  }
}

createAdmin();
