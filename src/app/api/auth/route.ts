import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { Admin } from '@/models/index';
import { signToken, requireAdmin } from '@/lib/auth';

// Auto-create default admin if DB is empty (runs on first login attempt)
async function ensureDefaultAdmin() {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@cairntech.com',
        role: 'admin',
        permissions: {
          viewBookings: true, viewContacts: true, viewClients: true,
          editBookings: true, editContacts: true, manageServices: true,
          managePricing: true, manageProjects: true, manageTeam: true,
        },
      });
      console.log('✅ Default admin created: admin / admin123');
    }
  } catch (err: any) {
    console.error('ensureDefaultAdmin error:', err.message);
  }
}

// POST /api/auth — Login
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await ensureDefaultAdmin();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }

    const token = signToken({
      id:          admin._id.toString(),
      username:    admin.username,
      role:        admin.role,
      permissions: admin.permissions,
    });

    const response = NextResponse.json({
      success: true,
      token,
      admin: { username: admin.username, role: admin.role, permissions: admin.permissions },
    });

    // Also set HTTP-only cookie for extra security
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err.message);
    return NextResponse.json({ success: false, message: `Server error: ${err.message}` }, { status: 500 });
  }
}

// GET /api/auth — Verify token
export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: true, admin });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }
}

// DELETE /api/auth — Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
