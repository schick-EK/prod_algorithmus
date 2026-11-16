import assert from "node:assert/strict";
import { test } from "node:test";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../src/db/schema";
import {
  loadObservationEvidence,
  manualEvidenceInput,
  saveEvidenceRevision,
} from "../src/lib/annotation/evidence-store";
import { annotate } from "../src/lib/annotation/pipeline";

function setup() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(`
    CREATE TABLE activity_types (id TEXT PRIMARY KEY, label TEXT NOT NULL, gruppe TEXT NOT NULL);
    CREATE TABLE observations (id TEXT PRIMARY KEY, study_id TEXT, work_area_id TEXT, station_id TEXT, planned_round_id TEXT, observed_at INTEGER, activity_type_id TEXT);
    CREATE TABLE round_notes (id TEXT PRIMARY KEY, planned_round_id TEXT, station_id TEXT, note TEXT);
    CREATE TABLE observation_evidence (id TEXT PRIMARY KEY, observation_id TEXT NOT NULL REFERENCES observations(id) ON DELETE CASCADE, revision INTEGER NOT NULL, input TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(observation_id, revision));
    INSERT INTO activity_types VALUES ('ACT', 'Ursprüngliche Ablaufart', 'VS');
    INSERT INTO observations VALUES ('OBS', 'STUDY', 'AREA', 'STATION', 'ROUND', 1794387600, 'ACT');
    INSERT INTO round_notes VALUES ('NOTE', 'ROUND', 'STATION', 'Gemeinsame Notiz: Maschine steht.');
  `);
  return { sqlite, db: drizzle(sqlite, { schema }) };
}

function fields() {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    machine_status: "stopped",
    operator_activity: "waiting",
    material_status: "unknown",
    quality: "medium",
    process_step_id: "ASSEMBLY",
    memo_status: "available",
    memo_text: "Material fehlt.",
  }))
    form.set(key, value);
  return form;
}

test("individual evidence persists, feeds AP3, and keeps original records and revisions", () => {
  const { sqlite, db } = setup();
  try {
    const original = loadObservationEvidence(db, "OBS")!;
    assert.equal(original.revision, 0);
    assert.equal(original.input.memo.scope, "station_round");
    const input = manualEvidenceInput(original.legacy, fields(), 1);
    assert.equal(saveEvidenceRevision(db, input, 0), 1);
    const first = loadObservationEvidence(db, "OBS")!;
    assert.equal(first.input.memo.scope, "observation");
    assert.equal(first.input.memo.text, "Material fehlt.");
    assert.equal(first.legacy.memo.text, "Gemeinsame Notiz: Maschine steht.");
    assert.equal(first.source.activity_label, "Ursprüngliche Ablaufart");
    assert.equal(
      first.source.observed_at.toISOString(),
      original.source.observed_at.toISOString(),
    );
    assert.equal(annotate(first.input).decision.status, "ABSTAIN_UNCALIBRATED");
    const next = fields();
    next.set("memo_text", "Information fehlt.");
    saveEvidenceRevision(db, manualEvidenceInput(first.legacy, next, 2), 1);
    const second = loadObservationEvidence(db, "OBS")!;
    assert.equal(second.revision, 2);
    assert.equal(second.history.length, 2);
    assert.notEqual(
      annotate(first.input).annotation_id,
      annotate(second.input).annotation_id,
    );
    const stored = sqlite
      .prepare("SELECT input FROM observation_evidence WHERE revision = 1")
      .get() as { input: string };
    assert.equal(JSON.parse(stored.input).memo.text, "Material fehlt.");
  } finally {
    sqlite.close();
  }
});

test("stale editors cannot overwrite a newer revision", () => {
  const { sqlite, db } = setup();
  try {
    const base = loadObservationEvidence(db, "OBS")!.legacy;
    const input = manualEvidenceInput(base, fields(), 1);
    saveEvidenceRevision(db, input, 0);
    assert.throws(
      () => saveEvidenceRevision(db, input, 0),
      /inzwischen geändert/,
    );
    assert.equal(loadObservationEvidence(db, "OBS")!.history.length, 1);
  } finally {
    sqlite.close();
  }
});

test("evidence is bound to observation, study, context, timestamp and individual memo source", () => {
  const { sqlite, db } = setup();
  try {
    const input = manualEvidenceInput(
      loadObservationEvidence(db, "OBS")!.legacy,
      fields(),
      1,
    );
    for (const mutate of [
      (i: typeof input) => {
        i.provenance.study_id = "FOREIGN";
      },
      (i: typeof input) => {
        i.context.workcenter_id = "FOREIGN";
      },
      (i: typeof input) => {
        i.observed_at = "2026-11-12T09:00:00.000Z";
      },
      (i: typeof input) => {
        i.memo.source_ids = ["OTHER_SOURCE"];
      },
    ]) {
      const changed = structuredClone(input);
      mutate(changed);
      assert.throws(() => saveEvidenceRevision(db, changed, 0));
    }
    assert.equal(loadObservationEvidence(db, "OBS")!.revision, 0);
    assert.equal(loadObservationEvidence(db, "MISSING"), null);
  } finally {
    sqlite.close();
  }
});

test("missingness is explicit and blank fields do not copy shared notes", () => {
  const { sqlite, db } = setup();
  try {
    const form = fields();
    form.set("machine_status", "");
    form.set("missingness_machine_status", "capture_failed");
    form.set("memo_status", "not_recorded");
    form.set("memo_text", "");
    const input = manualEvidenceInput(
      loadObservationEvidence(db, "OBS")!.legacy,
      form,
      1,
    );
    assert.equal(input.structured_features.machine_status, null);
    assert.equal(input.missingness.machine_status, "capture_failed");
    assert.equal(input.missingness.material_status, "not_known");
    assert.equal(input.memo.text, null);
    assert.deepEqual(input.memo.source_ids, []);
    form.set("memo_text", "Text ohne passenden Status");
    assert.throws(() => manualEvidenceInput(input, form, 2), /Status/);
  } finally {
    sqlite.close();
  }
});
