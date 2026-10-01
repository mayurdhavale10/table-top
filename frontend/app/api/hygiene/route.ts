import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';
import HygieneAudit from '../../../src/models/HygieneAudit';
import { computeHygieneScore } from '../../../src/data/hygieneChecklist';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cafeSlug, responses, evidence, notes } = body;

    if (!cafeSlug || !responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'cafeSlug and responses are required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const { earned, possible, percentage, starRating, hasCriticalFailure } = computeHygieneScore(responses);

    const evidenceMap: Record<string, { url: string; validUntil?: string }> = evidence || {};
    const responseList = Object.entries(responses as Record<string, 'yes' | 'no' | 'na'>).map(([questionId, answer]) => {
      const ev = evidenceMap[questionId];
      return {
        questionId: Number(questionId),
        answer,
        evidenceUrl: ev?.url || undefined,
        validUntil: ev?.validUntil ? new Date(ev.validUntil) : undefined,
      };
    });

    const [audit] = await HygieneAudit.create([{
      cafe_id: (cafe as any)._id,
      responses: responseList,
      earnedScore: earned,
      possibleScore: possible,
      percentage,
      starRating,
      hasCriticalFailure,
      notes: notes || '',
    }]);

    return NextResponse.json({
      success: true,
      auditId: audit._id.toString(),
      earnedScore: earned,
      possibleScore: possible,
      percentage,
      starRating,
      hasCriticalFailure,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create Hygiene Audit Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cafeSlug = req.nextUrl.searchParams.get('cafeSlug');
    if (!cafeSlug) {
      return NextResponse.json({ error: 'cafeSlug query param is required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const audits = await HygieneAudit.find({ cafe_id: (cafe as any)._id })
      .sort({ createdAt: -1 })
      .lean();

    const plain = JSON.parse(JSON.stringify(audits)).map((a: any) => ({ ...a, id: a._id }));

    return NextResponse.json({ audits: plain });
  } catch (error: any) {
    console.error('List Hygiene Audits Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
