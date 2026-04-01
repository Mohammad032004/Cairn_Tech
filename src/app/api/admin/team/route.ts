import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { TeamMember } from '@/models/index';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const data = await TeamMember.find({ active: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const doc = await TeamMember.create(await req.json());
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id, ...rest } = await req.json();
    const doc = await TeamMember.findByIdAndUpdate(id, rest, { new: true });
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id } = await req.json();
    await TeamMember.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
