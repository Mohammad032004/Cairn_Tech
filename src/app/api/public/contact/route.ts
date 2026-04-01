import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Contact } from '@/models/index';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, message, urgency, phone, serviceType } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    await Contact.create({
      name:        name.trim(),
      email:       email.trim().toLowerCase(),
      message:     message.trim(),
      urgency:     urgency || 'normal',
      phone:       phone?.trim() || '',
      serviceType: serviceType?.trim() || '',
    });

    return NextResponse.json({ success: true, message: "Thanks! We'll get back to you within 24 hours." });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
