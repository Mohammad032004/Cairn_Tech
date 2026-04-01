import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { Admin, Service, Project, Testimonial, Pricing, TeamMember } from '@/models/index';

export async function GET() {
  try {
    await dbConnect();

    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already set up', alreadyExists: true });
    }

    // Create admin
    await Admin.create({
      username: 'admin', password: await bcrypt.hash('admin123', 10),
      email: 'admin@cairntech.com', role: 'admin',
      permissions: { viewBookings:true, viewContacts:true, viewClients:true, editBookings:true, editContacts:true, manageServices:true, managePricing:true, manageProjects:true, manageTeam:true },
    });

    // Services
    const svcCount = await Service.countDocuments();
    if (svcCount === 0) {
      await Service.create([
        { title:'Website Development', description:'Stunning, high-performance websites built with cutting-edge technology.', icon:'monitor', features:['Custom Design','Responsive Layout','SEO Optimized','CMS Integration','Fast Load Times'], category:'main', order:1 },
        { title:'App Development', description:'Native and cross-platform mobile apps delivering seamless experiences.', icon:'smartphone', features:['iOS & Android','React Native','API Integration','Push Notifications','Offline Support'], category:'main', order:2 },
        { title:'Maintenance & Support', description:'24/7 monitoring and technical support to keep your products running.', icon:'settings', features:['24/7 Monitoring','Bug Fixes','Security Updates','Performance Tuning','Monthly Reports'], category:'main', order:3 },
        { title:'SEO Optimization', description:'Rank higher and get found faster with our proven SEO strategies.', icon:'trending-up', features:['Keyword Research','On-Page SEO','Link Building','Analytics Reports','Local SEO'], category:'additional', order:4 },
        { title:'UI/UX Design', description:'Beautiful, intuitive interfaces designed around your users.', icon:'layers', features:['User Research','Wireframing','Prototyping','Design Systems','Usability Testing'], category:'additional', order:5 },
        { title:'Cloud Hosting', description:'Reliable, scalable hosting with 99.9% uptime and free SSL.', icon:'cloud', features:['Free SSL','99.9% Uptime','Daily Backups','CDN Integration','24/7 Support'], category:'additional', order:6 },
      ]);
    }

    // Projects
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.create([
        { title:'ShopEase E-Commerce', description:'Full-stack e-commerce with Stripe payments and admin dashboard.', category:'Web App', technologies:['React','Node.js','MongoDB','Stripe'], featured:true, order:1 },
        { title:'HealthTrack Mobile App', description:'Cross-platform fitness app with AI-driven health insights.', category:'Mobile App', technologies:['React Native','Firebase','ML Kit'], featured:true, order:2 },
        { title:'EduLearn LMS', description:'Learning management system with live classes and certifications.', category:'Enterprise', technologies:['Next.js','PostgreSQL','WebRTC'], featured:true, order:3 },
        { title:'BookNow Appointments', description:'Smart booking system with calendar sync and automated reminders.', category:'Web App', technologies:['Vue.js','Express','MySQL'], featured:false, order:4 },
      ]);
    }

    // Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.create([
        { quote:'Cairn Tech delivered our site 2 weeks early. Conversions jumped 40% in the first month.', author:'Priya Sharma', role:'CEO', company:'StyleHub India', rating:5 },
        { quote:'The mobile app has 4.8 stars on the App Store. Clean code and excellent communication.', author:'Rahul Mehta', role:'Founder', company:'FitLife App', rating:5 },
        { quote:'Modernized our legacy system in 3 months. Fast, secure, and a joy to use.', author:'Anita Verma', role:'CTO', company:'EduSpark', rating:5 },
      ]);
    }

    // Pricing
    const pricingCount = await Pricing.countDocuments();
    if (pricingCount === 0) {
      await Pricing.create([
        { name:'Starter', price:'₹4,999', priceValue:4999, description:'Perfect for small businesses', features:['5-page Website','Mobile Responsive','Basic SEO','1 Month Support','SSL Certificate'], highlighted:false, order:1 },
        { name:'Professional', price:'₹9,999', priceValue:9999, description:'Ideal for growing businesses', features:['15-page Website','CMS Integration','Advanced SEO','3 Months Support','E-commerce Ready','Analytics Dashboard'], highlighted:true, order:2 },
        { name:'Enterprise', price:'₹19,999+', priceValue:19999, description:'Full-scale solutions', features:['Unlimited Pages','Custom Web App','Full SEO Strategy','12 Months Support','API Integrations','Dedicated Manager'], highlighted:false, order:3 },
      ]);
    }

    // Team
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      await TeamMember.create([
        { name:'Aryan Mehta', role:'Founder & CEO', position:'Leadership', bio:'Full-stack engineer with 8+ years building scalable web and mobile products.', initials:'AM', order:1, active:true },
        { name:'Priya Kapoor', role:'Lead Designer', position:'Design', bio:'UX strategist passionate about intuitive, beautiful interfaces.', initials:'PK', order:2, active:true },
        { name:'Rohan Das', role:'Tech Lead', position:'Engineering', bio:'Backend architect specializing in cloud-native systems and API design.', initials:'RD', order:3, active:true },
      ]);
    }

    return NextResponse.json({ success: true, message: 'Setup complete! Login: admin / admin123' });
  } catch (err: any) {
    console.error('Setup error:', err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
