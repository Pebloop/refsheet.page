import {getGalleryOfOc, getOcFromNameAndUser} from "$lib/db";
import { env } from '$env/dynamic/private'

export const load = async (event: any) => {
    const loggedInUser = event.locals.user;
    const oc = event.params.oc;
    const user = event.params.user;
    const ocData = await getOcFromNameAndUser(oc, user);

    let ocSharedData = null;
    if (ocData.length > 0) {
        const gallery = await getGalleryOfOc(ocData[0].id);
        const urls = [];

        for (let i = 0; i < gallery.length; i++) {
            urls.push(env.R2_URL + gallery[i].url);
        }

        ocSharedData = {
            name: oc,
            image: env.R2_URL + ocData[0].refsheet,
            gallery: urls
        }
    }

    return {
        user: user,
        oc: oc,
        loggedInUser: loggedInUser,
        ocData: ocSharedData
    }

};
