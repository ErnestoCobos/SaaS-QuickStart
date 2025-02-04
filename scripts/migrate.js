import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
const { Pool } = pg;

// Configuración de ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificar variables de entorno requeridas
console.log('Variables de entorno disponibles:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')));

const requiredEnvVars = ['DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Variable de entorno ${envVar} no encontrada`);
    process.exit(1);
  }
}

async function migrate() {
  console.log('Iniciando proceso de migración...');
  
  // Crear pool de conexión
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true
    }
  });

  try {
    // Probar conexión
    await pool.query('SELECT NOW()');
    console.log('✓ Conexión a la base de datos establecida');

    // Leer y ejecutar migraciones
    const migrationsDir = path.join(__dirname, '../src/lib/migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    console.log(`\nEncontradas ${sqlFiles.length} migraciones para ejecutar`);

    for (const file of sqlFiles) {
      console.log(`\nAplicando migración: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf-8');
      
      try {
        await pool.query('BEGIN');
        await pool.query(sql);
        await pool.query('COMMIT');
        console.log(`✓ Migración aplicada exitosamente: ${file}`);
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    }

    console.log('\n✓ Todas las migraciones han sido aplicadas exitosamente');
  } catch (error) {
    console.error('\n✗ Error al ejecutar migraciones:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar migraciones
console.log('Ambiente:', process.env.NODE_ENV || 'development');
migrate().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
