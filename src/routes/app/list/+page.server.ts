import { db } from '$lib/server/db/client';
import { lists } from '$lib/server/db/schema';
import { supabase } from '$lib/supabase';
import { fail, redirect, type Actions, type PageServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw redirect(302, '/');

  const result = await db
    .select()
    .from(lists)
    .where(eq(lists.userId, user.id));

  return {
    lists: result
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user || !name) return fail(400);

    await db.insert(lists).values({
      name,
      userId: user.id
    });

    return { success: true };
  }
};
