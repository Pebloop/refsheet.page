import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '$env/dynamic/private'
import {imagesTable, loginTable, ocsTable, sessionsTable, usersTable} from "./schema";
import {and, eq} from "drizzle-orm";

const client = postgres(env.DATABASE_URL, { prepare: false })
const db = drizzle({ client });

// Login

export function createLogin(email: string, sessionCode: string) {
    return db.insert(loginTable).values({ email, sessionCode })
}

export function getLoginFromEmail(email: string) {
    return db.select().from(loginTable).where(eq(loginTable.email, email))
}

export function changeLoginCode(email: string, sessionCode: string) {
    return db.update(loginTable).set({ sessionCode }).where(eq(loginTable.email, email))
}

// Sessions

export function getSessionFromToken(token: string) {
    return db.select().from(sessionsTable).where(eq(sessionsTable.token, token))
}

export function createSession(user_id: number, token: string) {
    return db.insert(sessionsTable).values({ user_id, token })
}

export function deleteSession(token: string) {
    return db.delete(sessionsTable).where(eq(sessionsTable.token, token))
}

// Users

export function getUserFromEmail(email: string) {
    return db.select().from(usersTable).where(eq(usersTable.email, email))
}

export function getUserFromId(id: number) {
    return db.select().from(usersTable).where(eq(usersTable.id, id))
}

export function getUserFromName(name: string) {
    return db.select().from(usersTable).where(eq(usersTable.name, name))
}

export function createUser(email: string, name: string) {
    return db.insert(usersTable).values({ email, name })
}

export function deleteUser(id: number) {
    return db.delete(usersTable).where(eq(usersTable.id, id))
}

export function getUsers() {
    return db.select().from(usersTable)
}

// OCs

export function getOcsFromUserId(user_id: number) {
    return db.select().from(ocsTable).where(eq(ocsTable.user_id, user_id))
}

export function getOcFromId(id: number) {
    return db.select().from(ocsTable).where(eq(ocsTable.id, id))
}

export async function getOcFromNameAndUser(name: string, userName: string) {
    const user = await db.select().from(usersTable).where(eq(usersTable.name, userName))

    if (!user || user.length === 0) {
        return []
    }

    return db.select().from(ocsTable).where(and(eq(ocsTable.name, name), eq(ocsTable.user_id, user[0].id)));
}

export function createOc(user_id: number, name: string, refsheet: string) {
    return db.insert(ocsTable).values({ user_id, name, refsheet })
}

export function updateOc(id: number, name: string, refsheet: string) {
    return db.update(ocsTable).set({ name, refsheet }).where(eq(ocsTable.id, id))
}

// Gallery

export function getGalleryOfOc(oc_id: number) {
    return db.select().from(imagesTable).where(eq(imagesTable.ocs_id, oc_id))
}

export function createImage(ocs_id: number, url: string) {
    return db.insert(imagesTable).values({ ocs_id, url })
}

export function getImageFromUrl(url: string) {
    return db.select().from(imagesTable).where(eq(imagesTable.url, url))
}
export function deleteImage(id: number) {
    return db.delete(imagesTable).where(eq(imagesTable.id, id))
}
