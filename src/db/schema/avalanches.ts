import { pgTable, uuid, timestamp, text, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const slopeAspectEnum = pgEnum("slope_aspect", ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]);
export const triggerTypeEnum = pgEnum("trigger_type", ["natural", "accidental", "remote", "unknown"]);

export const avalanches = pgTable("avalanches", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  reportedAt: timestamp("reported_at", { withTimezone: true }).notNull(),
  locationName: text("location_name"),
  region: text("region").notNull(),
  elevationM: integer("elevation_m"),
  slopeAspect: slopeAspectEnum("slope_aspect").notNull(),
  avalancheSize: integer("avalanche_size").notNull(),
  avalancheSizeLabel: text("avalanche_size_label"),
  triggerType: triggerTypeEnum("trigger_type").notNull(),
  mapUrl: text("map_url"),
  photoUrl: text("photo_url"),
  additionalComments: text("additional_comments"),
  reporterId: uuid("reporter_id").notNull(), // References auth.users.id
  reporterName: text("reporter_name"),
  isPublic: boolean("is_public").default(true).notNull(),
});

