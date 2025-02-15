import {changeLoginCode, createLogin, createUser, getLoginFromEmail, getUserFromEmail} from "../../../lib/db";
import {sendMail} from "../../../lib/mail";

export async function POST({ request }: { request: Request }) {
    const {email} = await request.json();
    const user = await getUserFromEmail(email);

    console.log(user);
    if (!user || user.length === 0) {
        const username = email.split('@')[0];
        await createUser(email, username);
    }

    // send session email
    const sessionCode = Math.random().toString().substring(2, 9);
    await sendMail(
        {
            to: email,
            subject: 'Connect to refsheet.page',
            text: 'Connection to refsheet.page',
            html: '<h1>Connection to refsheet.page</h1><p>Here\'s your session code : ' + sessionCode + '.</p>',
        }
    )
    let login = await getLoginFromEmail(email);
    if (!login || login.length === 0) {
        await createLogin(email, sessionCode);
    } else {
        await changeLoginCode(email, sessionCode);
    }

    return new Response(JSON.stringify({ success: true}));
}
