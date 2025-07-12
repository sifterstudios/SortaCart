import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

// Use Supabase's `auth.users` table — don't redefine it here
// Just reference the user ID as `text`, since Supabase uses UUID strings

export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // references auth.users.id (implicitly)
  name: text('name').notNull(),
  categoryOrder: text('category_order').array().notNull(), // e.g. ["fruit", "veg"]
});

export const lists = pgTable('lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // references auth.users.id
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),     // references auth.users.id
  listId: uuid('list_id').notNull(),     // references lists.id
  storeId: uuid('store_id'),             // optional: user might not assign yet
  name: text('name').notNull(),
  category: text('category'),            // inferred via mapping or fuzzy match
});
