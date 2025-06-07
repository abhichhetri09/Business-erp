import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { z } from "zod";

// Validation schema
const settingsSchema = z.object({
  id: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
  defaultProjectId: z.string().nullable().optional(),
  workingHours: z.number().min(1).max(24).default(8),
  timeZone: z.string().default("UTC"),
  dateFormat: z.string().default("MM/dd/yyyy"),
  timeFormat: z.string().default("HH:mm"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userId: z.string().optional(),
  defaultProject: z.any().optional(),
});

// Get user settings
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user settings
    let settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        defaultProject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.userSettings.create({
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
        include: {
          defaultProject: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

// Update user settings
export async function PUT(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received settings update:", body);

    // Validate request body
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error.issues);
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    // If defaultProjectId is provided, verify the project exists and user has access
    if (result.data.defaultProjectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: result.data.defaultProjectId,
          OR: [
            {
              members: {
                some: {
                  id: user.id,
                },
              },
            },
            {
              managerId: user.id,
            },
          ],
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Invalid default project" },
          { status: 400 }
        );
      }
    }

    // Remove readonly fields from the update data
    const { id, createdAt, updatedAt, userId, defaultProject, ...updateData } =
      result.data;

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },
      update: updateData,
      create: {
        ...updateData,
        userId: user.id,
      },
      include: {
        defaultProject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("Settings updated successfully:", settings);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}
