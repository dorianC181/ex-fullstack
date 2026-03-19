import { createPool, type Pool } from "mariadb";
import { hash } from "bcrypt";

export const pool: Pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

export async function schemaExist(): Promise<boolean> {
  const connection = await pool.getConnection();

  try {
    const tables = await connection.query("SHOW TABLES");
    const tableKey = "Tables_in_" + process.env.DB_NAME;
    const usersTableExists = tables.some((table: any) => table[tableKey] === "users");
    return usersTableExists;
  } finally {
    connection.end();
  }
}

export async function createSchema(): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL
      )
    `);

    const passwordHash = await hash("ioupi", 10);

    await connection.query(
      "INSERT INTO users(name, passwordHash) VALUES (?, ?)",
      ["remy", passwordHash]
    );
  } finally {
    connection.end();
  }
}

export async function deleteSchema(): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.query("DROP TABLE users");
  } finally {
    connection.end();
  }
}