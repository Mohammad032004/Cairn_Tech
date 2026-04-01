import mongoose, { Schema, model, models } from 'mongoose';

// ─── Admin (supports role: 'admin' | 'employee') ──────────
const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:    { type: String },
  role:     { type: String, enum: ['admin', 'employee'], default: 'admin' },
  permissions: {
    viewBookings:   { type: Boolean, default: true },
    viewContacts:   { type: Boolean, default: true },
    viewClients:    { type: Boolean, default: true },
    editBookings:   { type: Boolean, default: false },
    editContacts:   { type: Boolean, default: false },
    manageServices: { type: Boolean, default: false },
    managePricing:  { type: Boolean, default: false },
    manageProjects: { type: Boolean, default: false },
    manageTeam:     { type: Boolean, default: false },
  },
}, { timestamps: true });

// ─── Contact ──────────────────────────────────────────────
const ContactSchema = new Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String },
  serviceType: { type: String },
  message:     { type: String, required: true },
  urgency:     { type: String, enum: ['normal', 'urgent', 'very-urgent'], default: 'normal' },
  status:      { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
}, { timestamps: true });

// ─── Booking ──────────────────────────────────────────────
const BookingSchema = new Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true },
  plan:           { type: String, required: true },
  planPrice:      { type: Number, default: 0 },
  finalAmount:    { type: Number, default: 0 },   // negotiated final
  pendingAmount:  { type: Number, default: 0 },   // remaining unpaid
  paidAmount:     { type: Number, default: 0 },
  requirements:   { type: String },
  projectDesc:    { type: String },
  urgency:        { type: String, enum: ['normal', 'urgent', 'very-urgent'], default: 'normal' },
  status:         { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
}, { timestamps: true });

// ─── Project ──────────────────────────────────────────────
const ProjectSchema = new Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  category:     { type: String, enum: ['Web App', 'Mobile App', 'Enterprise', 'Other'], default: 'Web App' },
  technologies: [String],
  image:        { type: String, default: '' },
  liveUrl:      { type: String, default: '' },
  featured:     { type: Boolean, default: false },
  order:        { type: Number, default: 0 },
}, { timestamps: true });

// ─── Service ──────────────────────────────────────────────
const ServiceSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String, default: 'code' },
  features:    [String],
  category:    { type: String, enum: ['main', 'additional'], default: 'main' },
  order:       { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

// ─── Testimonial ──────────────────────────────────────────
const TestimonialSchema = new Schema({
  quote:   { type: String, required: true },
  author:  { type: String, required: true },
  role:    { type: String },
  company: { type: String },
  rating:  { type: Number, min: 1, max: 5, default: 5 },
  active:  { type: Boolean, default: true },
}, { timestamps: true });

// ─── Pricing ──────────────────────────────────────────────
const PricingSchema = new Schema({
  name:        { type: String, required: true },
  price:       { type: String, required: true },
  priceValue:  { type: Number, default: 0 },
  description: { type: String },
  features:    [String],
  highlighted: { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

// ─── TeamMember (for About page, managed by admin) ────────
const TeamMemberSchema = new Schema({
  name:     { type: String, required: true },
  role:     { type: String, required: true },
  position: { type: String },
  bio:      { type: String },
  image:    { type: String, default: '' },
  initials: { type: String },
  order:    { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

export const Admin       = models.Admin       || model('Admin', AdminSchema);
export const Contact     = models.Contact     || model('Contact', ContactSchema);
export const Booking     = models.Booking     || model('Booking', BookingSchema);
export const Project     = models.Project     || model('Project', ProjectSchema);
export const Service     = models.Service     || model('Service', ServiceSchema);
export const Testimonial = models.Testimonial || model('Testimonial', TestimonialSchema);
export const Pricing     = models.Pricing     || model('Pricing', PricingSchema);
export const TeamMember  = models.TeamMember  || model('TeamMember', TeamMemberSchema);
