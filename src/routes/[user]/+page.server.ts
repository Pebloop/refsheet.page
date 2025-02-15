import type { PageLoad } from './$types';
import {getOcsFromUserId, getUserFromName} from "../../lib/db";
import { env } from '$env/dynamic/private'
import {error} from "@sveltejs/kit";

export const load: PageLoad = async (event: any) => {
    const loggedInUser = event.locals.user;
    const user = event.params.user;

    let ocs: any = [];

    if (loggedInUser) {
        const currentUser = await getUserFromName(user);

        if (!currentUser || currentUser.length === 0) {
            return error(404, 'User not found');
        }

        const oc = await getOcsFromUserId(currentUser[0].id);

        for (let i = 0; i < oc.length; i++) {
            ocs.push({
                name: oc[i].name,
                image: env.R2_URL + oc[i].refsheet
            });
        }
    }

    return {
        loggedInUser: loggedInUser,
        user: user,
        ocs: ocs
    }

};
