import * as dotenv from 'dotenv';
import { join } from 'path';

const projectDir = process.cwd();
dotenv.config({ path: join(projectDir, '.env.local') });

async function seed() {
  const { default: connectToDatabase } = await import("./src/lib/mongodb");
  const { default: Cafe } = await import("./src/models/Cafe");

  await connectToDatabase();
  console.log("Connected to MongoDB.");

  const cafe = await Cafe.findOneAndUpdate(
    { slug: "sips-and-bites" },
    { $set: { username: "sips", password: "bites123" } },
    { new: true }
  );

  if (cafe) {
    console.log("Updated Sips & Bites with credentials.");
  } else {
    console.log("Cafe not found.");
  }

  process.exit(0);
}

seed();
