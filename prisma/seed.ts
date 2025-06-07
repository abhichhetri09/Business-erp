import { PrismaClient } from "@prisma/client";
import type { User, Project } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Clear existing data
  await prisma.expense.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create Admin Users
  const admin1 = await prisma.user.create({
    data: {
      name: "John Admin",
      email: "admin@company.com",
      password: await hash("admin123", 12),
      role: "ADMIN",
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: "Sarah Admin",
      email: "sarah.admin@company.com",
      password: await hash("admin123", 12),
      role: "ADMIN",
    },
  });

  console.log("Created admin users");

  // Create Manager Users
  const manager1 = await prisma.user.create({
    data: {
      name: "Mike Manager",
      email: "manager@company.com",
      password: await hash("manager123", 12),
      role: "MANAGER",
    },
  });

  const manager2 = await prisma.user.create({
    data: {
      name: "Lisa Manager",
      email: "lisa.manager@company.com",
      password: await hash("manager123", 12),
      role: "MANAGER",
    },
  });

  console.log("Created manager users");

  // Create Employee Users
  const employees = await Promise.all([
    prisma.user.create({
      data: {
        name: "Tom Employee",
        email: "employee@company.com",
        password: await hash("employee123", 12),
        role: "EMPLOYEE",
      },
    }),
    prisma.user.create({
      data: {
        name: "Jane Employee",
        email: "jane.employee@company.com",
        password: await hash("employee123", 12),
        role: "EMPLOYEE",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Developer",
        email: "bob.dev@company.com",
        password: await hash("employee123", 12),
        role: "EMPLOYEE",
      },
    }),
    prisma.user.create({
      data: {
        name: "Alice Designer",
        email: "alice.design@company.com",
        password: await hash("employee123", 12),
        role: "EMPLOYEE",
      },
    }),
  ]);

  console.log("Created employee users");

  // Create default settings for all users
  const allUsers = [admin1, admin2, manager1, manager2, ...employees];

  for (const user of allUsers) {
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        theme: "system",
        language: "en",
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: true,
        workingHours: 8,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: "MM/dd/yyyy",
        timeFormat: "HH:mm",
      },
    });
  }

  console.log("Created default settings for all users");

  // Create Sample Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Website Redesign",
        description: "Company website redesign project",
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        managerId: manager1.id,
        members: {
          connect: [{ id: employees[0].id }, { id: employees[1].id }],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: "Mobile App Development",
        description: "New mobile app for customers",
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        managerId: manager2.id,
        members: {
          connect: [{ id: employees[2].id }, { id: employees[3].id }],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: "Internal Tools",
        description: "Development of internal tools",
        status: "PLANNING",
        startDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        managerId: manager1.id,
        members: {
          connect: [{ id: employees[0].id }, { id: employees[2].id }],
        },
      },
    }),
  ]);

  console.log("Created sample projects");

  // Create Sample Time Entries
  const timeEntries = await Promise.all(
    employees.flatMap((employee: User) =>
      projects.map((project: Project) =>
        prisma.timeEntry.create({
          data: {
            userId: employee.id,
            projectId: project.id,
            date: new Date(),
            hours: Math.floor(Math.random() * 8) + 1,
            description: "Work on project tasks",
          },
        })
      )
    )
  );

  console.log("Created sample time entries");

  // Create Sample Expenses
  const expenses = await Promise.all(
    employees.flatMap((employee: User) =>
      projects.map((project: Project) =>
        prisma.expense.create({
          data: {
            userId: employee.id,
            projectId: project.id,
            amount: Math.floor(Math.random() * 1000) + 100,
            description: "Project related expense",
            date: new Date(),
            status: "PENDING",
          },
        })
      )
    )
  );

  console.log("Created sample expenses");

  console.log("Seeding completed successfully!");
  console.log("\nYou can now log in with these accounts:");
  console.log("Admin: admin@company.com / admin123");
  console.log("Manager: manager@company.com / manager123");
  console.log("Employee: employee@company.com / employee123");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
