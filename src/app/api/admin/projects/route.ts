import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Project } from '@/models/index';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    return NextResponse.json({ success: true, data: await Project.find().sort({ order: 1, createdAt: -1 }) });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const doc = await Project.create(await req.json());
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id, ...rest } = await req.json();
    const doc = await Project.findByIdAndUpdate(id, rest, { new: true });
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id } = await req.json();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
