import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Booking } from '@/models/index';

const PLAN_PRICES: Record<string, number> = {
  Starter: 4999, Professional: 9999, Enterprise: 19999,
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, plan, requirements, urgency } = await req.json();

    if (!name || !name.trim()) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
    if (!email || !email.trim()) return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    if (!plan || !plan.trim()) return NextResponse.json({ success: false, message: 'Plan selection is required' }, { status: 400 });

    await Booking.create({
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      plan:      plan.trim(),
      planPrice: PLAN_PRICES[plan] || 0,
      requirements: requirements?.trim() || '',
      urgency:   urgency || 'normal',
    });

    return NextResponse.json({ success: true, message: 'Booking confirmed! We will contact you shortly.' });
  } catch (err: any) {
    console.error('Booking error:', err.message);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
