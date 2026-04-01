import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Project } from '@/models/index';

export async function GET() {
  await dbConnect();
  const projects = await Project.find().sort({ featured: -1, order: 1 });
  return NextResponse.json({ success: true, data: projects });
}
