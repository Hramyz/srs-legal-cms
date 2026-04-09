import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@srslegal.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@srslegal.com",
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    },
  });
  console.log("✅ Admin user created");

  // Create roles
  const roles = [
    {
      name: "super_admin",
      displayName: "Super Admin",
      description: "Full access to all modules",
      permissions: {
        view_dashboard: true,
        manage_cases: true,
        manage_clients: true,
        manage_lawyers: true,
        manage_finance: true,
        manage_services: true,
        manage_documents: true,
        manage_admin: true,
      },
    },
    {
      name: "admin",
      displayName: "Admin",
      description: "Administrative access",
      permissions: {
        view_dashboard: true,
        manage_cases: true,
        manage_clients: true,
        manage_lawyers: true,
        manage_finance: true,
        manage_services: true,
        manage_documents: true,
        manage_admin: false,
      },
    },
    {
      name: "lawyer",
      displayName: "Lawyer",
      description: "Senior lawyer access",
      permissions: {
        view_dashboard: true,
        manage_cases: true,
        manage_clients: true,
        manage_lawyers: false,
        manage_finance: false,
        manage_services: false,
        manage_documents: true,
        manage_admin: false,
      },
    },
    {
      name: "junior_lawyer",
      displayName: "Junior Lawyer",
      description: "Junior lawyer with limited access",
      permissions: {
        view_dashboard: true,
        manage_cases: true,
        manage_clients: false,
        manage_lawyers: false,
        manage_finance: false,
        manage_services: false,
        manage_documents: true,
        manage_admin: false,
      },
    },
    {
      name: "paralegal",
      displayName: "Paralegal",
      description: "Paralegal support access",
      permissions: {
        view_dashboard: true,
        manage_cases: true,
        manage_clients: true,
        manage_lawyers: false,
        manage_finance: false,
        manage_services: false,
        manage_documents: true,
        manage_admin: false,
      },
    },
    {
      name: "accountant",
      displayName: "Accountant",
      description: "Finance module access",
      permissions: {
        view_dashboard: true,
        manage_cases: false,
        manage_clients: true,
        manage_lawyers: false,
        manage_finance: true,
        manage_services: false,
        manage_documents: true,
        manage_admin: false,
      },
    },
    {
      name: "viewer",
      displayName: "Viewer",
      description: "Read-only access",
      permissions: {
        view_dashboard: true,
        manage_cases: false,
        manage_clients: false,
        manage_lawyers: false,
        manage_finance: false,
        manage_services: false,
        manage_documents: false,
        manage_admin: false,
      },
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log("✅ Roles created");

  // Create service categories
  const categories = [
    { name: "Consultation", slug: "consultation", icon: "💬", sortOrder: 1 },
    { name: "Private Notary Service", slug: "private-notary-service", icon: "📜", sortOrder: 2 },
    { name: "Will Execution", slug: "will-execution", icon: "📋", sortOrder: 3 },
    { name: "Criminal", slug: "criminal", icon: "⚖️", sortOrder: 4 },
    { name: "Employment", slug: "employment", icon: "💼", sortOrder: 5 },
    { name: "Business", slug: "business", icon: "🏢", sortOrder: 6 },
    { name: "Dispute", slug: "dispute", icon: "🤝", sortOrder: 7 },
    { name: "Litigation", slug: "litigation", icon: "🏛️", sortOrder: 8 },
    { name: "Real Property", slug: "real-property", icon: "🏠", sortOrder: 9 },
    { name: "Banking & Finance", slug: "banking-finance", icon: "🏦", sortOrder: 10 },
    { name: "Family Law", slug: "family-law", icon: "👨‍👩‍👧", sortOrder: 11 },
    { name: "Intellectual Property", slug: "intellectual-property", icon: "💡", sortOrder: 12 },
    { name: "Taxes & Fines", slug: "taxes-fines", icon: "💰", sortOrder: 13 },
    { name: "Contract", slug: "contract", icon: "📝", sortOrder: 14 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log("✅ Service categories created");

  // Create sample clients
  const clients = [
    {
      clientId: "SRS-1001",
      firstName: "Ahmed",
      lastName: "Al Mansouri",
      email: "ahmed.mansouri@email.com",
      phone: "+971 50 123 4567",
      city: "Dubai",
      country: "UAE",
    },
    {
      clientId: "SRS-1002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "+971 55 234 5678",
      city: "Abu Dhabi",
      country: "UAE",
    },
    {
      clientId: "SRS-1003",
      firstName: "Mohammed",
      lastName: "Al Rashidi",
      email: "m.rashidi@email.com",
      phone: "+971 52 345 6789",
      city: "Sharjah",
      country: "UAE",
    },
    {
      clientId: "SRS-1004",
      firstName: "Elena",
      lastName: "Petrov",
      email: "elena.petrov@email.com",
      phone: "+971 56 456 7890",
      city: "Dubai",
      country: "UAE",
      isOnline: true,
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { clientId: client.clientId },
      update: {},
      create: client,
    });
  }
  console.log("✅ Sample clients created");

  // Create sample cases
  const cases = [
    {
      caseNumber: "CASE-2024-001",
      title: "Commercial Dispute — Al Fardan Trading Co.",
      type: "Civil",
      status: "In Progress",
      filingDate: new Date("2024-01-15"),
      estimatedValue: 250000,
      court: "Dubai Commercial Court",
    },
    {
      caseNumber: "CASE-2024-002",
      title: "Employment Termination — Johnson vs. TechCorp",
      type: "Employment",
      status: "Pending",
      filingDate: new Date("2024-02-20"),
      estimatedValue: 85000,
      court: "Dubai Labour Court",
    },
  ];

  for (const c of cases) {
    await prisma.case.upsert({
      where: { caseNumber: c.caseNumber },
      update: {},
      create: c,
    });
  }
  console.log("✅ Sample cases created");

  // Create sample services
  const consultationCatId = createdCategories["consultation"];
  const services = [
    {
      name: "Initial Legal Consultation",
      slug: "initial-legal-consultation",
      description: "1-hour consultation with a senior lawyer to discuss your legal matter",
      price: 500,
      duration: "1 hour",
      categoryId: consultationCatId,
    },
    {
      name: "Document Review",
      slug: "document-review",
      description: "Comprehensive review of legal documents and contracts",
      price: 1500,
      duration: "2-3 business days",
      categoryId: createdCategories["contract"],
    },
    {
      name: "Court Representation",
      slug: "court-representation",
      description: "Full legal representation in court proceedings",
      price: 5000,
      duration: "Per hearing",
      categoryId: createdCategories["litigation"],
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log("✅ Sample services created");

  // Create sample orders
  const orders = [
    {
      orderNumber: "ORD-2024-001",
      customerName: "Ahmed Al Mansouri",
      customerEmail: "ahmed.mansouri@email.com",
      customerPhone: "+971 50 123 4567",
      amount: 500,
      status: "Confirmed",
      paymentStatus: "Paid",
    },
    {
      orderNumber: "ORD-2024-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.johnson@email.com",
      customerPhone: "+971 55 234 5678",
      amount: 1500,
      status: "Pending",
      paymentStatus: "Pending",
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {},
      create: order,
    });
  }
  console.log("✅ Sample orders created");

  // Create sample invoice (idempotent: skip if already seeded)
  const sampleInvoiceDescription = "Legal representation — Commercial Dispute";
  const existingInvoice = await prisma.invoice.findFirst({
    where: { description: sampleInvoiceDescription },
  });
  if (!existingInvoice) {
    await prisma.invoice.create({
      data: {
        amount: 5000,
        status: "Paid",
        issueDate: new Date("2024-01-20"),
        dueDate: new Date("2024-02-20"),
        description: sampleInvoiceDescription,
        billableHours: 10,
        hourlyRate: 500,
      },
    });
  }
  console.log("✅ Sample invoice created");

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
