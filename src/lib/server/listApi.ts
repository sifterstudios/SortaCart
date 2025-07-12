import { db } from '$lib/server/db/client';
import { lists } from '$lib/server/db/schema';
import { supabase } from '$lib/supabase';
import { eq } from 'drizzle-orm';

export async function getLists() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { data: [] };

  const result = await db
    .select()
    .from(lists)
    .where(eq(lists.userId, user.id));

  return { data: result };
}

export async function createList(name: string) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  await db.insert(lists).values({
    name,
    userId: user.id
  });
}
