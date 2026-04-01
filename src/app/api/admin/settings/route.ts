import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { Admin } from '@/models/index';
import { requireAdmin, signToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const user = requireAdmin(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { currentPassword, newPassword, newUsername, email } = await req.json();

    const admin = await Admin.findById(user.id);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }

    // Handle password change
    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, admin.password);
      if (!match) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
      }
      if (newPassword && newPassword.length >= 6) {
        admin.password = await bcrypt.hash(newPassword, 10);
      } else if (newPassword) {
        return NextResponse.json({ success: false, message: 'New password must be at least 6 characters' }, { status: 400 });
      }
    }

    // Handle username change
    if (newUsername && newUsername.trim() && newUsername.trim() !== admin.username) {
      const exists = await Admin.findOne({ username: newUsername.trim() });
      if (exists) {
        return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 400 });
      }
      admin.username = newUsername.trim();
    }

    // Handle email update
    if (email && email.trim()) {
      admin.email = email.trim();
    }

    await admin.save();

    // Issue fresh token with updated info
    const newToken = signToken({ id: admin._id.toString(), username: admin.username, role: admin.role });
    const response = NextResponse.json({ success: true, message: 'Settings updated successfully', token: newToken });
    response.cookies.set('admin_token', newToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
      path:     '/',
    });

    return response;
  } catch (err: any) {
    console.error('Settings update error:', err.message);
    return NextResponse.json({ success: false, message: `Server error: ${err.message}` }, { status: 500 });
  }
}
