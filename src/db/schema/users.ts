import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// This represents the auth.users table from Supabase
// We don't create this table, it's managed by Supabase Auth
// This is just for type references
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

