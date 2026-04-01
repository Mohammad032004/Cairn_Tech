import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Contact, Booking, Project, Service } from '@/models/index';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [totalContacts, totalBookings, totalProjects, totalServices, newContacts, pendingBookings] = await Promise.all([
      Contact.countDocuments(),
      Booking.countDocuments(),
      Project.countDocuments(),
      Service.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Booking.countDocuments({ status: 'pending' }),
    ]);

    const bookings = await Booking.find().select('planPrice plan status createdAt name email finalAmount').sort({ createdAt: -1 });
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((s, b) => s + (b.finalAmount || b.planPrice || 0), 0);

    const recentBookings  = bookings.slice(0, 5);
    const recentContacts  = await Contact.find().sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      success: true,
      data: {
        totalContacts, totalBookings, totalProjects, totalServices,
        newContacts, pendingBookings, totalRevenue,
        recentBookings, recentContacts,
      },
    });
  } catch (err: any) {
    console.error('Dashboard error:', err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
