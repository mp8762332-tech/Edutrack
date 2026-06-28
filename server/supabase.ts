/**
 * Supabase Client SDK Integration
 * Provides database connection for Vercel/Supabase deployment
 * Replaces local Drizzle/MySQL logic
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

let supabaseClient: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 */
export function initSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  console.log("✅ Supabase client initialized");
  return supabaseClient;
}

/**
 * Get Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabaseClient();
  }
  return supabaseClient;
}

/**
 * Query builder helper
 */
export class SupabaseQuery {
  private client: SupabaseClient;

  constructor() {
    this.client = getSupabaseClient();
  }

  /**
   * Select from table
   */
  async select<T>(table: string, columns: string = "*", filters?: Record<string, any>): Promise<T[]> {
    let query = this.client.from(table).select(columns);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error selecting from ${table}:`, error);
      throw error;
    }

    return (data as T[]) || [];
  }

  /**
   * Select single row
   */
  async selectOne<T>(table: string, filters: Record<string, any>): Promise<T | null> {
    let query = this.client.from(table).select("*").limit(1);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error(`Error selecting from ${table}:`, error);
      throw error;
    }

    return (data?.[0] as T) || null;
  }

  /**
   * Insert into table
   */
  async insert<T>(table: string, data: any): Promise<T | null> {
    const { data: result, error } = await this.client.from(table).insert([data]).select();

    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }

    return (result?.[0] as T) || null;
  }

  /**
   * Insert multiple rows
   */
  async insertMany<T>(table: string, data: any[]): Promise<T[]> {
    const { data: result, error } = await this.client.from(table).insert(data).select();

    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }

    return (result as T[]) || [];
  }

  /**
   * Update table
   */
  async update<T>(table: string, data: any, filters: Record<string, any>): Promise<T | null> {
    let query = this.client.from(table).update(data);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });

    const { data: result, error } = await query.select();

    if (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }

    return (result?.[0] as T) || null;
  }

  /**
   * Delete from table
   */
  async delete(table: string, filters: Record<string, any>): Promise<boolean> {
    let query = this.client.from(table).delete();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });

    const { error } = await query;

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }

    return true;
  }

  /**
   * Count rows
   */
  async count(table: string, filters?: Record<string, any>): Promise<number> {
    let query = this.client.from(table).select("*", { count: "exact", head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) {
      console.error(`Error counting ${table}:`, error);
      throw error;
    }

    return count || 0;
  }

  /**
   * Paginated query
   */
  async paginate<T>(
    table: string,
    page: number = 1,
    limit: number = 50,
    filters?: Record<string, any>
  ): Promise<{ data: T[]; total: number; page: number; limit: number; pages: number }> {
    const offset = (page - 1) * limit;

    let query = this.client.from(table).select("*", { count: "exact" });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error(`Error paginating ${table}:`, error);
      throw error;
    }

    const total = count || 0;
    const pages = Math.ceil(total / limit);

    return {
      data: (data as T[]) || [],
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Raw query (use with caution)
   */
  async raw<T>(sql: string, params?: any[]): Promise<T[]> {
    const { data, error } = await this.client.rpc("execute_raw_sql", {
      sql,
      params: params || [],
    });

    if (error) {
      console.error("Error executing raw SQL:", error);
      throw error;
    }

    return (data as T[]) || [];
  }
}

/**
 * Supabase Auth Helper
 */
export class SupabaseAuth {
  private client: SupabaseClient;

  constructor() {
    this.client = getSupabaseClient();
  }

  /**
   * Sign up user
   */
  async signUp(email: string, password: string): Promise<any> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Sign up error:", error);
      throw error;
    }

    return data;
  }

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }

    return data;
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<any> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();

    if (error) {
      console.error("Get user error:", error);
      throw error;
    }

    return user;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email);

    if (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }
}

/**
 * Supabase Storage Helper
 */
export class SupabaseStorage {
  private client: SupabaseClient;
  private bucket: string;

  constructor(bucket: string = "documents") {
    this.client = getSupabaseClient();
    this.bucket = bucket;
  }

  /**
   * Upload file
   */
  async uploadFile(path: string, file: File | Buffer): Promise<string> {
    const { data, error } = await this.client.storage.from(this.bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    return data?.path || "";
  }

  /**
   * Download file
   */
  async downloadFile(path: string): Promise<Blob> {
    const { data, error } = await this.client.storage.from(this.bucket).download(path);

    if (error) {
      console.error("Download error:", error);
      throw error;
    }

    return data;
  }

  /**
   * Delete file
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).remove([path]);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }

  /**
   * Get public URL
   */
  getPublicUrl(path: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  /**
   * List files
   */
  async listFiles(prefix?: string): Promise<any[]> {
    const { data, error } = await this.client.storage.from(this.bucket).list(prefix);

    if (error) {
      console.error("List error:", error);
      throw error;
    }

    return data || [];
  }
}

/**
 * Initialize all Supabase services
 */
export function initSupabase(): void {
  try {
    initSupabaseClient();
    console.log("✅ Supabase initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Supabase:", error);
    throw error;
  }
}

// Export instances
export const supabaseQuery = new SupabaseQuery();
export const supabaseAuth = new SupabaseAuth();
export const supabaseStorage = new SupabaseStorage();
