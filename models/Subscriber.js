import { query } from '../config/db.js';

export const Subscriber = {
  // Create new subscriber
  async create(email) {
    const result = await query(
      `INSERT INTO subscribers (email) 
       VALUES ($1) 
       ON CONFLICT (email) DO UPDATE SET status = 'active', updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [email]
    );
    return result.rows[0];
  },

  // Find by email
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM subscribers WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Get all subscribers (Admin)
  async getAll(limit = 100, offset = 0) {
    const result = await query(
      'SELECT * FROM subscribers ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await query('SELECT COUNT(*) FROM subscribers');
    return {
      subscribers: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  },

  // Update status (Unsubscribe)
  async updateStatus(email, status) {
    const result = await query(
      'UPDATE subscribers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING *',
      [status, email]
    );
    return result.rows[0];
  },

  // Delete subscriber (Admin)
  async delete(id) {
    await query('DELETE FROM subscribers WHERE id = $1', [id]);
  }
};
