// test-db.ts
import db from "./src/db-config"; // adjust if db-config is elsewhere

(async () => {
  try {
    const r = await (db as any).raw("select 1+1 as result");
    console.log("DB OK", r.rows || r);
    process.exit(0);
  } catch (e: any) {
    console.error("DB test failed", e.message || e);
    process.exit(1);
  }
})();
