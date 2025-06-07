import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const john = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      role: "MANAGER",
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      name: "Jane Smith",
      role: "EMPLOYEE",
    },
  });

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Redesign company website",
      status: "ACTIVE",
      startDate: new Date(),
      managerId: john.id,
      members: {
        connect: [{ id: jane.id }],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App",
      description: "Develop mobile application",
      status: "PLANNING",
      startDate: new Date(),
      managerId: john.id,
      members: {
        connect: [{ id: jane.id }],
      },
    },
  });

  // Create time entries
  await prisma.timeEntry.createMany({
    data: [
      {
        userId: jane.id,
        projectId: project1.id,
        date: new Date(),
        hours: 8,
        description: "Working on homepage",
      },
      {
        userId: jane.id,
        projectId: project2.id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        hours: 6,
        description: "App planning",
      },
    ],
  });

  // Create expenses
  await prisma.expense.createMany({
    data: [
      {
        userId: jane.id,
        projectId: project1.id,
        amount: 150.0,
        description: "Design software license",
        date: new Date(),
        status: "APPROVED",
      },
      {
        userId: john.id,
        projectId: project2.id,
        amount: 300.0,
        description: "Development tools",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        status: "PENDING",
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
