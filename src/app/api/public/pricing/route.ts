import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Pricing } from '@/models/index';

export async function GET() {
  await dbConnect();
  const data = await Pricing.find({ active: true }).sort({ order: 1 });
  return NextResponse.json({ success: true, data });
}
