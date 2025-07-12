import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createServerClient } from '@supabase/ssr';

// 1. Wrap Paraglide first
const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
    });
  });

// 2. Wrap Supabase around that
export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => event.cookies.set(key, value, options),
        remove: (key, options) => event.cookies.delete(key, options)
      }
    }
  );

  event.locals.supabase = supabase;

  const {
    data: { session }
  } = await supabase.auth.getSession();

  event.locals.session = session;
  event.locals.user = session?.user ?? null;

  // Now pass to Paraglide middleware
  return handleParaglide({ event, resolve });
};
