import {
    createImage,
    deleteImage,
    getImageFromUrl,
    getOcFromNameAndUser,
    getSessionFromToken,
    getUserFromId
} from "$lib/db";
import {uploadFile} from "$lib/r2";
import { env } from '$env/dynamic/private'

export async function POST({ request }: { request: Request }) {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const name = formData.get('name') as string;
    const image = formData.get('image') as Blob;

    const [session] = await Promise.all([getSessionFromToken(token)]);
    if (!session || session.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid session'}));
    }
    const [user] = await Promise.all([getUserFromId(session[0].user_id)]);
    if (!user || user.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid email'}));
    }

    const oc = await getOcFromNameAndUser(name, user[0].name);
    if (oc.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid oc'}));
    }

    const imageUid = crypto.randomUUID();
    await uploadFile(image, `ocs/${user[0].id}/${name}-${imageUid}.png`)
    await createImage(oc[0].id, `ocs/${user[0].id}/${name}-${imageUid}.png`);

    return new Response(JSON.stringify({ success: true}));
}

export async function DELETE({ request }: { request: Request }) {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const name = formData.get('name') as string;
    const img = formData.get('image') as string;

    const [session] = await Promise.all([getSessionFromToken(token)]);
    if (!session || session.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid session'}));
    }
    const [user] = await Promise.all([getUserFromId(session[0].user_id)]);
    if (!user || user.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid email'}));
    }

    const oc = await getOcFromNameAndUser(name, user[0].name);
    if (oc.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid oc'}));
    }

    // delete image
    const imageUrl = img.split(env.R2_URL)[1];
    const image = await getImageFromUrl(imageUrl);
    if (image.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid image'}));
    }
    await deleteImage(image[0].id);

    return new Response(JSON.stringify({ success: true}));
}
