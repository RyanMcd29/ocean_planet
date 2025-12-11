import { db } from './server/db';
import { diveSites } from '@shared/schema';

async function main() {
  const rows = await db
    .select({ name: diveSites.name, lat: diveSites.latitude, lng: diveSites.longitude })
    .from(diveSites)
    .limit(10);
  for (const row of rows) {
    console.log(row.name, row.lat, row.lng, typeof row.lat, typeof row.lng);
  }
  await db.end?.();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
