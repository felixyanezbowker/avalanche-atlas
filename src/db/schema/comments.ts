import { pgTable, uuid, timestamp, text, boolean } from "drizzle-orm/pg-core";
import { avalanches } from "./avalanches";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  avalancheId: uuid("avalanche_id").references(() => avalanches.id).notNull(),
  userId: uuid("user_id").notNull(), // References auth.users.id
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
});

