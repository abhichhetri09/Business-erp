"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
}

interface UserSettings {
  id: string;
  theme: "light" | "dark" | "system";
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  defaultProjectId: string | null;
  workingHours: number;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const DATE_FORMATS = [
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
];

const TIME_FORMATS = [
  { value: "HH:mm", label: "24-hour" },
  { value: "hh:mm a", label: "12-hour" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeZones, setTimeZones] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes] = await Promise.all([
          fetch("/api/user/settings"),
          fetch("/api/projects/available"),
        ]);

        if (!settingsRes.ok || !projectsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [settingsData, projectsData] = await Promise.all([
          settingsRes.json(),
          projectsRes.json(),
        ]);

        setSettings(settingsData);
        setProjects(projectsData);

        // Get time zones
        const zones = Intl.supportedValuesOf("timeZone");
        setTimeZones(zones);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to load settings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSettings(data);
      // Show success message
      setError("Settings saved successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save settings. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Icons.loading className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md dark:bg-red-900/20">
          Failed to load settings
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button
          variant="primary"
          onClick={handleSave}
          leftIcon={
            isSaving ? (
              <Icons.loading className="h-4 w-4 animate-spin" />
            ) : undefined
          }
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div
          className={cn(
            "p-4 rounded-md",
            error === "Settings saved successfully!"
              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          )}
        >
          {error}
        </div>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: e.target.value as "light" | "dark" | "system",
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Language</label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive push notifications in browser
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pushNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Weekly Digest</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive weekly summary of activities
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      weeklyDigest: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Time Tracking</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Default Project</label>
              <select
                value={settings.defaultProjectId || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultProjectId: e.target.value || null,
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">No default project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This project will be pre-selected when you start time tracking
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">
                Working Hours per Day
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={settings.workingHours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    workingHours: Math.min(
                      24,
                      Math.max(1, parseInt(e.target.value) || 8)
                    ),
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Used for calculating overtime and work-life balance metrics
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Regional Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Time Zone</label>
              <select
                value={settings.timeZone}
                onChange={(e) =>
                  setSettings({ ...settings, timeZone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                {timeZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                  setSettings({ ...settings, dateFormat: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                {DATE_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Time Format</label>
              <select
                value={settings.timeFormat}
                onChange={(e) =>
                  setSettings({ ...settings, timeFormat: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              >
                {TIME_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
