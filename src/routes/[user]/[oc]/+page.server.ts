import {getOcFromNameAndUser} from "$lib/db";
import { env } from '$env/dynamic/private'

export const load = async (event: any) => {
    const loggedInUser = event.locals.user;
    const oc = event.params.oc;
    const user = event.params.user;
    const ocData = await getOcFromNameAndUser(oc, user);

    let ocSharedData = null;
    if (ocData.length > 0) {
        ocSharedData = {
            name: oc,
            image: env.R2_URL + ocData[0].refsheet
        }
    }

    return {
        user: user,
        oc: oc,
        loggedInUser: loggedInUser,
        ocData: ocSharedData
    }

};
