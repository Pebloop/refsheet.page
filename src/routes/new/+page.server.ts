import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
    const user = event.locals.user;

    if (!user) {
        return error(401);
    }

    return {
        user: user
    }

};
