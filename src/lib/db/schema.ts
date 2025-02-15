import {integer, pgTable, text, varchar} from "drizzle-orm/pg-core";

export const loginTable = pgTable("login", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull(),
    sessionCode: varchar({ length: 255 }).notNull(),
});

export const sessionsTable = pgTable("sessions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull(),
    token: varchar({ length: 255 }).notNull(),
});

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
});

export const ocsTable = pgTable("ocs", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    refsheet: text().notNull(),
});

export const imagesTable = pgTable("images", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    ocs_id: integer().notNull(),
    url: text().notNull(),
});
