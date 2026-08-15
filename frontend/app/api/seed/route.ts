import { NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';
import MenuItem from '../../../src/models/MenuItem';
import { cafes, menuItems } from '../../../src/data/saasDb';

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data
    await Cafe.deleteMany({});
    await MenuItem.deleteMany({});

    // Insert cafes and keep track of their new MongoDB ObjectIds
    const insertedCafes = [];
    for (const cafe of cafes) {
      const newCafe = await Cafe.create({
        slug: cafe.slug,
        name: cafe.name,
        location: cafe.location,
        theme: cafe.theme,
      });
      insertedCafes.push({ oldId: cafe.id, newId: newCafe._id });
    }

    // Insert menu items using the new ObjectIds
    for (const item of menuItems) {
      const parentCafe = insertedCafes.find(c => c.oldId === item.cafe_id);
      if (parentCafe) {
        await MenuItem.create({
          cafe_id: parentCafe.newId,
          category: item.category,
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          type: item.type,
        });
      }
    }

    return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
