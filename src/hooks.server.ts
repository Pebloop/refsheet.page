import * as cookie from 'cookie';
import {getSessionFromToken, getUserFromId} from "./lib/db";

export const handle = async ({ event, resolve }) => {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  const token = cookies['token'] || null;
  event.locals.user = null;

  // is session valid
    if (token) {
      const session = await getSessionFromToken(token);
        if (session && session.length > 0) {
          const user = await getUserFromId(session[0].user_id);
            event.locals.user = user[0];
        }
    }

if (event.url.pathname.startsWith('/api')) {
    return await resolve(event);
}

  if (!event.locals.user) {
    // if the user is not logged in and tries to access a protected route
    // redirect them to the login page
    if (event.url.pathname.startsWith('/new')) {
      return new Response(null, {
        status: 302,
        headers: {
          location: '/login',
        },
      });
      }
  } else {
    // if the user is logged in and tries to access the login page
    // redirect them to the home page
    if (event.url.pathname === '/login' || event.url.pathname === '/' || event.url.pathname === '' || event.url.pathname === null) {
        return new Response(null, {
            status: 302,
            headers: {
                location: "/" + event.locals.user.name,
            },
        });
    }
  }

    return await resolve(event);
};
