import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { Admin } from '@/models/index';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const employees = await Admin.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: employees });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { username, password, email, permissions } = await req.json();
    if (!username || !password) return NextResponse.json({ success: false, message: 'Username and password required' }, { status: 400 });
    const exists = await Admin.findOne({ username });
    if (exists) return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 400 });
    const hashed = await bcrypt.hash(password, 10);
    const emp    = await Admin.create({ username, password: hashed, email, role: 'employee', permissions: permissions || {} });
    const { password: _, ...safe } = emp.toObject();
    return NextResponse.json({ success: true, data: safe });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id, permissions, email, password } = await req.json();
    const updates: any = { email, permissions };
    if (password) updates.password = await bcrypt.hash(password, 10);
    const emp = await Admin.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    return NextResponse.json({ success: true, data: emp });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false }, { status: 401 });
    await dbConnect();
    const { id } = await req.json();
    await Admin.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}
