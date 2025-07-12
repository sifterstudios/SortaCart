import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Uses the same DATABASE_URL as drizzle.config.ts
const queryClient = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(queryClient);
