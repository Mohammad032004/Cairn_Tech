import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Testimonial } from '@/models/index';

export async function GET() {
  await dbConnect();
  const data = await Testimonial.find({ active: true });
  return NextResponse.json({ success: true, data });
}
