import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../src/lib/mongodb';
import Cafe from '../../../../src/models/Cafe';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    // In a production app, password should be hashed (e.g. bcrypt.compare)
    const cafe = await Cafe.findOne({ username, password }).lean();

    if (!cafe) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Success - return the slug so frontend can redirect to /admin/[slug]
    return NextResponse.json({ 
      success: true, 
      slug: cafe.slug,
      name: cafe.name 
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
