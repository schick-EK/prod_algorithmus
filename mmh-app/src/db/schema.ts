import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name"),
  password_hash: text("password_hash").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const studies = sqliteTable("studies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  owner_id: text("owner_id"),
  name: text("name").notNull(),
  address: text("address"),
  start_date: text("start_date"),
  end_date: text("end_date"),
  timezone: text("timezone").notNull().default("Europe/Berlin"),
  confidence_level: text("confidence_level", { enum: ["90", "95", "98", "99"] }).notNull().default("95"),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const workAreas = sqliteTable("work_areas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  study_id: text("study_id").notNull().references(() => studies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  cycle_time: real("cycle_time"),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const stations = sqliteTable("stations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  work_area_id: text("work_area_id").notNull().references(() => workAreas.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category", { enum: ["Mitarbeiter", "Maschine"] }).notNull(),
  employee_count: integer("employee_count"),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const shifts = sqliteTable("shifts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  work_area_id: text("work_area_id").notNull().references(() => workAreas.id, { onDelete: "cascade" }),
  name: text("name"),
  start_time: text("start_time").notNull(),
  end_time: text("end_time").notNull(),
  weekdays: text("weekdays", { mode: "json" }).$type<number[]>().notNull().$defaultFn(() => [1, 2, 3, 4, 5]),
  breaks: text("breaks", { mode: "json" }).$type<{ start: string; end: string }[]>().notNull().$defaultFn(() => []),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const activityTypes = sqliteTable("activity_types", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  study_id: text("study_id").notNull().references(() => studies.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  gruppe: text("gruppe", { enum: ["HT", "NT", "VS", "FK"] }).notNull(),
  category: text("category"),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const stationActivityTypes = sqliteTable(
  "station_activity_types",
  {
    station_id: text("station_id").notNull().references(() => stations.id, { onDelete: "cascade" }),
    activity_type_id: text("activity_type_id").notNull().references(() => activityTypes.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.station_id, t.activity_type_id] }),
  })
);

export const targetShares = sqliteTable("target_shares", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  work_area_id: text("work_area_id").notNull().references(() => workAreas.id, { onDelete: "cascade" }),
  category: text("category", { enum: ["Mitarbeiter", "Maschine"] }).notNull(),
  gruppe: text("gruppe", { enum: ["HT", "NT", "VS", "FK"] }).notNull(),
  share: real("share").notNull().default(0),
});

export const plannedRounds = sqliteTable("planned_rounds", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  work_area_id: text("work_area_id").notNull().references(() => workAreas.id, { onDelete: "cascade" }),
  planned_at: integer("planned_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  conducted_at: integer("conducted_at", { mode: "timestamp" }),
  observer_id: text("observer_id"),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const observations = sqliteTable("observations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  study_id: text("study_id").notNull().references(() => studies.id, { onDelete: "cascade" }),
  work_area_id: text("work_area_id").notNull().references(() => workAreas.id, { onDelete: "cascade" }),
  station_id: text("station_id").references(() => stations.id, { onDelete: "set null" }),
  activity_type_id: text("activity_type_id").notNull().references(() => activityTypes.id, { onDelete: "cascade" }),
  observer_id: text("observer_id"),
  observed_at: integer("observed_at", { mode: "timestamp" }).notNull(),
  planned_round_id: text("planned_round_id").references(() => plannedRounds.id, { onDelete: "set null" }),
});

export const roundNotes = sqliteTable("round_notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  planned_round_id: text("planned_round_id").notNull().references(() => plannedRounds.id, { onDelete: "cascade" }),
  station_id: text("station_id").notNull().references(() => stations.id, { onDelete: "cascade" }),
  note: text("note"),
  no_anomalies: integer("no_anomalies", { mode: "boolean" }).notNull().default(false),
  created_at: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
