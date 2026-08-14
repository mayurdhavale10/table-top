import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  const filePath = path.join(process.cwd(), 'db.json');
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    if (category) {
      const lowerCategory = category.toLowerCase();
      const filteredMenu = data.menu.filter(item => {
        if (lowerCategory === 'veg' || lowerCategory === 'non veg') {
          return item.type?.toLowerCase() === lowerCategory;
        }
        return item.category?.toLowerCase() === lowerCategory;
      });
      return NextResponse.json(filteredMenu);
    }
    
    return NextResponse.json(data.menu);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}
