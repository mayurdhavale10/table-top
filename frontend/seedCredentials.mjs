import connectToDatabase from "./src/lib/mongodb.js";
import Cafe from "./src/models/Cafe.js";

async function seed() {
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
