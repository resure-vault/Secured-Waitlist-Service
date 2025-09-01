import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.PG,
})

export async function getCount(): Promise<number> {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM waitlist_emails')
    return parseInt(result.rows[0].count, 10) || 0
  } catch (error) {
    console.error('Error fetching count:', error)
    return 0
  }
}

export { pool }
