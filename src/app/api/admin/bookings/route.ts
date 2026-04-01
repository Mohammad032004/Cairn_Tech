import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Booking } from '@/models/index';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const data   = await Booking.find(status ? { status } : {}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function PATCH(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id, ...updates } = await req.json();
    const doc = await Booking.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, data: doc });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id } = await req.json();
    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
