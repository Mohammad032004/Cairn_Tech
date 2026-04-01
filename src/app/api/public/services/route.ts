import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Service } from '@/models/index';

export async function GET() {
  await dbConnect();
  const services = await Service.find({ active: true }).sort({ order: 1 });
  return NextResponse.json({ success: true, data: services });
}
