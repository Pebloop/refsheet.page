import {
    changeLoginCode,
    createLogin,
    createSession,
    createUser,
    getLoginFromEmail,
    getUserFromEmail
} from "../../../lib/db";
import {encodeBase32LowerCaseNoPadding, encodeHexLowerCase} from "@oslojs/encoding";

function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function POST({ request }: { request: Request }) {
    const {email, code} = await request.json();
    const user = await getUserFromEmail(email);

    if (!user || user.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'User not found'}));
    }

    let login = await getLoginFromEmail(email);
    if (!login || login.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Login not found'}));
    }

    if (login[0].sessionCode !== code) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid code'}));
    }

    // create session
    console.log(user);
    const token = generateSessionToken();
    await createSession(user[0].id, token);

    return new Response(JSON.stringify({ success: true, token, user: user[0].name}));
}
