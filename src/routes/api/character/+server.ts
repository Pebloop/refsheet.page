import {
    changeLoginCode,
    createLogin, createOc,
    createUser,
    getLoginFromEmail,
    getSessionFromToken,
    getUserFromEmail, getUserFromId
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

    const imageUid = crypto.randomUUID();
    await uploadFile(image, `ocs/${user[0].id}/${name}-${imageUid}.png`)
    await createOc(user[0].id, name, `ocs/${user[0].id}/${name}-${imageUid}.png`);

    return new Response(JSON.stringify({ success: true}));
}
