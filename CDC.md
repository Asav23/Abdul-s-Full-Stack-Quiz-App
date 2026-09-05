# Change Data Capture in this app

## What CDC is

Change Data Capture is the general practice of recording *every change* to
a system's data as a discrete event, rather than only ever storing current
state. Instead of a database row just silently becoming different (or
disappearing) between two points in time, each insert/update/delete is
captured as its own timestamped fact: what changed, when, and to what.

It's a foundational pattern behind several things that show up constantly
in real systems:

- **Undo.** Any app where deleting or editing something isn't permanent by
  default is running some version of CDC underneath - the old state has to
  be recorded *somewhere* for "undo" to mean anything.
- **Audit trails.** Anywhere "prove what happened and who did it" matters -
  finance, healthcare, anything under compliance requirements - is built on
  a change log, not just current-state tables.
- **Event-driven data pipelines.** Tools like Debezium or AWS DMS tail a
  database's transaction log and turn every row change into a Kafka event,
  so other systems (search indexes, analytics warehouses, caches) can react
  to changes in real time instead of polling.
- **Version history.** Git applies the exact same idea to code: a
  changeset per commit, not just the latest file contents.

## What's implemented here

Two pieces, both scoped to `Quiz`:

1. **Soft delete** ([Quiz.java](src/main/java/com/quizapp/Quiz.java)) - a
   `deleted` flag instead of an actual `DELETE`. "Delete Quiz" in the UI
   just flips this to `true`; the row, its questions, and its collection
   memberships are all untouched and can be restored exactly as they were.
   A separate, explicit "Delete Forever" action
   ([DeletedQuizzes.jsx](frontend/src/pages/DeletedQuizzes.jsx)) is what
   actually removes the row, via `QuizService.purgequiz`.

2. **An append-only event log**
   ([QuizAuditLog.java](src/main/java/com/quizapp/QuizAuditLog.java)) -
   every create, update, delete, and restore writes a `QuizAuditLog` row
   (quiz id, name snapshot, action, timestamp). Nothing in this table is
   ever updated or deleted once written - it's a pure history, readable via
   `GET /api/quizzes/{id}/audit-log` (one quiz) or `GET /api/audit-log`
   (everything, across all quizzes).

## What's deliberately left out

This is a **simplified** version, and the gap is worth being explicit
about rather than overselling it as full CDC:

- **No before/after row images.** The log records *that* a quiz was
  updated, with its current name, not a diff of exactly which questions
  changed or what the previous values were. A full implementation would
  snapshot the entire row (or just the changed columns) on both sides of
  the change.
- **Application-level, not database-level.** This CDC lives in
  `QuizService` - every write path remembers to call `logAction()`. Real
  CDC tooling (Debezium, etc.) taps the database's write-ahead log
  directly, so it captures every change regardless of which code path
  wrote it, including ones a developer forgot to instrument.
- **Single entity.** Only `Quiz` is tracked. `Question`, `Collection`, and
  `Attempt` changes aren't captured at all.

## Why this, alongside the file-based backups

[scripts/backup.ps1](scripts/backup.ps1) and the CDC log solve different
problems and neither replaces the other:

| | Backups | CDC / soft-delete |
|---|---|---|
| Protects against | Catastrophic loss (wiped Docker volume, disk failure) | "Oops, deleted/edited the wrong thing" |
| Granularity | Whole database | One quiz |
| Recovery | Rewinds *everything* to the backup's moment - anything added since is lost | Restores exactly the one item, nothing else is affected |
| Where the data lives | A separate `.sql` file outside the database | Inside the same database/volume |

That last row matters: the audit log and soft-deleted rows disappear right
along with everything else if the volume is wiped, since they live in the
same place. It's not a backup - it's a finer-grained undo for the everyday
case, while the backup scripts remain the only protection for the
disaster-recovery case.
