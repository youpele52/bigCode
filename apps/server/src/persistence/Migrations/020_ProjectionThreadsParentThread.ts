import * as Effect from "effect/Effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";

export default Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  yield* sql`
    ALTER TABLE projection_threads
    ADD COLUMN parent_thread_id TEXT
  `.pipe(Effect.catchTag("SqlError", () => Effect.void));

  yield* sql`
    ALTER TABLE projection_threads
    ADD COLUMN parent_thread_title TEXT
  `.pipe(Effect.catchTag("SqlError", () => Effect.void));
});
