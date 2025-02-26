class Database {
  static instance;

  constructor() {
    this.supabaseClient = null;
  }

  // Static method to get the Singleton instance
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async initSupabase() {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabaseUrl = 'https://ehmyrpauukhjpghepted.supabase.co';
      const supabaseKey = process.env.SUPABASE_KEY;
      this.supabaseClient = createClient(supabaseUrl, supabaseKey);

      // Check if the connection is working
      const { data, error } = await this.supabaseClient
        .from('users')
        .select('*')
        .limit(1);

      if (error) throw new Error(`Supabase connection failed: ${error.message}`);
      
      return this.supabaseClient;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { Database };
