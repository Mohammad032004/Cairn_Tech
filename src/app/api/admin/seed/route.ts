import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { Admin, Service, Project, Testimonial, Pricing } from '@/models/index';

export async function GET() {
  await dbConnect();

  // Admin
  const existing = await Admin.findOne({ username: 'admin' });
  if (!existing) {
    await Admin.create({ username: 'admin', password: await bcrypt.hash('admin123', 10), email: 'admin@cairntech.com' });
  }

  // Services
  await Service.deleteMany({});
  await Service.create([
    { title: 'Website Development', description: 'Stunning, high-performance websites built with cutting-edge technology. From landing pages to enterprise portals.', icon: 'monitor', features: ['Custom Design', 'Responsive Layout', 'SEO Optimized', 'CMS Integration', 'Fast Load Times'], category: 'main', order: 1 },
    { title: 'App Development', description: 'Native and cross-platform mobile apps delivering seamless experiences across iOS and Android.', icon: 'smartphone', features: ['iOS & Android', 'React Native', 'API Integration', 'Push Notifications', 'Offline Support'], category: 'main', order: 2 },
    { title: 'Maintenance & Support', description: '24/7 monitoring, updates, and technical support to keep your digital products running flawlessly.', icon: 'settings', features: ['24/7 Monitoring', 'Bug Fixes', 'Security Updates', 'Performance Tuning', 'Monthly Reports'], category: 'main', order: 3 },
    { title: 'SEO Optimization', description: 'Rank higher, get found faster. Our SEO strategies drive organic traffic and measurable business growth.', icon: 'trending-up', features: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Analytics Reports', 'Local SEO'], category: 'additional', order: 4 },
    { title: 'UI/UX Design', description: 'Beautiful, intuitive interfaces designed around your users. Every pixel crafted with purpose.', icon: 'layers', features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'], category: 'additional', order: 5 },
    { title: 'Cloud Hosting', description: 'Reliable, scalable hosting with 99.9% uptime guarantee, free SSL and automated daily backups.', icon: 'cloud', features: ['Free SSL', '99.9% Uptime', 'Daily Backups', 'CDN Integration', '24/7 Support'], category: 'additional', order: 6 },
  ]);

  // Projects
  await Project.deleteMany({});
  await Project.create([
    { title: 'ShopEase E-Commerce', description: 'Full-stack e-commerce platform with real-time inventory, Stripe payments, and an admin dashboard.', category: 'Web App', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'], featured: true, order: 1 },
    { title: 'HealthTrack Mobile App', description: 'Cross-platform fitness app with workout tracking, nutrition logs, and AI-driven health insights.', category: 'Mobile App', technologies: ['React Native', 'Firebase', 'ML Kit'], featured: true, order: 2 },
    { title: 'EduLearn LMS', description: 'Learning management system with live classes, quizzes, certification generation, and progress tracking.', category: 'Enterprise', technologies: ['Next.js', 'PostgreSQL', 'WebRTC'], featured: true, order: 3 },
    { title: 'BookNow Appointments', description: 'Smart booking system with calendar sync, automated reminders and multi-provider support.', category: 'Web App', technologies: ['Vue.js', 'Express', 'MySQL'], featured: false, order: 4 },
  ]);

  // Testimonials
  await Testimonial.deleteMany({});
  await Testimonial.create([
    { quote: 'Cairn Tech delivered our e-commerce site 2 weeks ahead of schedule. Quality is outstanding — conversions jumped 40% in the first month.', author: 'Priya Sharma', role: 'CEO', company: 'StyleHub India', rating: 5 },
    { quote: 'The mobile app they built has 4.8 stars on the App Store. Clean code, excellent communication, and they truly understood our vision.', author: 'Rahul Mehta', role: 'Founder', company: 'FitLife App', rating: 5 },
    { quote: 'Our legacy system was a nightmare. Cairn Tech modernized everything in 3 months. The new platform is fast, secure, and a joy to use.', author: 'Anita Verma', role: 'CTO', company: 'EduSpark', rating: 5 },
  ]);

  // Pricing
  await Pricing.deleteMany({});
  await Pricing.create([
    { name: 'Starter', price: '₹4,999', priceValue: 4999, description: 'Perfect for small businesses and personal projects', features: ['5-page Website', 'Mobile Responsive', 'Basic SEO', '1 Month Support', 'Contact Form', 'SSL Certificate'], highlighted: false, order: 1 },
    { name: 'Professional', price: '₹9,999', priceValue: 9999, description: 'Ideal for growing businesses that need more power', features: ['15-page Website', 'CMS Integration', 'Advanced SEO', '3 Months Support', 'E-commerce Ready', 'Analytics Dashboard', 'Custom Domain Setup'], highlighted: true, order: 2 },
    { name: 'Enterprise', price: '₹19,999+', priceValue: 19999, description: 'Full-scale solutions for large organizations', features: ['Unlimited Pages', 'Custom Web App', 'Full SEO Strategy', '12 Months Support', 'API Integrations', 'Dedicated Manager', 'Priority 24/7 Support', 'Custom Features'], highlighted: false, order: 3 },
  ]);

  return NextResponse.json({ success: true, message: 'Database seeded! Admin: admin / admin123' });
}
