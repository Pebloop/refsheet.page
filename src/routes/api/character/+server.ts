import {
    changeLoginCode,
    createLogin, createOc,
    createUser,
    getLoginFromEmail, getOcFromNameAndUser,
    getSessionFromToken,
    getUserFromEmail, getUserFromId, updateOc
} from "../../../lib/db";
import {sendMail} from "../../../lib/mail";
import {uploadFile} from "../../../lib/r2";

export async function POST({ request }: { request: Request }) {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const name = formData.get('name') as string;
    const image = formData.get('image') as Blob;

    const session = await getSessionFromToken(token);
    if (!session || session.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid session'}));
    }

    const user = await getUserFromId(session[0].user_id);
    if (!user || user.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid email'}));
    }

    const ocWithSameName = await getOcFromNameAndUser(name, user[0].name);
    if (ocWithSameName.length > 0) {
        return new Response(JSON.stringify({ success: false, error: 'Oc with that name already exists'}));
    }

    const imageUid = crypto.randomUUID();
    await uploadFile(image, `ocs/${user[0].id}/${name}-${imageUid}.png`)
    await createOc(user[0].id, name, `ocs/${user[0].id}/${name}-${imageUid}.png`);

    return new Response(JSON.stringify({ success: true}));
}

export async function PATCH({ request }: { request: Request }) {
    const formData = await request.formData();
    const token = formData.get('token') as string;
    const originalName = formData.get('originalName') as string;
    const name = formData.get('name') as string;
    const image = formData.get('image') as Blob;

    const session = await getSessionFromToken(token);
    if (!session || session.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid session'}));
    }

    const user = await getUserFromId(session[0].user_id);
    if (!user || user.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid email'}));
    }

    const currentOc = await getOcFromNameAndUser(originalName, user[0].name);
    if (!currentOc || currentOc.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid oc'}));
    }

    const ocWithSameName = await getOcFromNameAndUser(name, user[0].name);
    if (ocWithSameName.length > 0) {
        if (ocWithSameName[0].id !== currentOc[0].id) {
            return new Response(JSON.stringify({ success: false, error: 'Oc with that name already exists'}));
        }
    }

    if (image) {
        const imageUid = crypto.randomUUID();
        await uploadFile(image, `ocs/${user[0].id}/${name}-${imageUid}.png`)
        await updateOc(currentOc[0].id, name, `ocs/${user[0].id}/${name}-${imageUid}.png`);
    } else {
        await updateOc(currentOc[0].id, name, currentOc[0].refsheet);
    }

    return new Response(JSON.stringify({ success: true}));
}
