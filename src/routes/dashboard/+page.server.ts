import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import {getOcsFromUserId} from "../../lib/db";

export const load: PageLoad = async (event) => {
    const user = event.locals.user;

    if (!user) {
        return error(401);
    }

    const ocs = await getOcsFromUserId(user.id);

    return {
        ocs: ocs
    }

};
