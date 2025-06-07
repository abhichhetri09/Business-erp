"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  date: Date;
  hours: number;
  description: string;
  project: {
    name: string;
  };
}

export default function TimeTrackingPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<{
    startTime: Date;
    task: string;
    projectId: string;
  } | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [task, setTask] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch available projects and time entries
    const fetchData = async () => {
      try {
        const [projectsRes, entriesRes] = await Promise.all([
          fetch("/api/projects/available"),
          fetch("/api/time-entries"),
        ]);

        if (!projectsRes.ok || !entriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const projects = await projectsRes.json();
        const entries = await entriesRes.json();

        setProjects(projects);
        setTimeEntries(
          entries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const startTracking = () => {
    if (!task || !selectedProjectId) {
      setError("Please enter both task and project details");
      return;
    }

    setError(null);
    setCurrentEntry({
      startTime: new Date(),
      task,
      projectId: selectedProjectId,
    });
    setIsTracking(true);
  };

  const stopTracking = async () => {
    if (currentEntry) {
      try {
        const endTime = new Date();
        const response = await fetch("/api/time-entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: currentEntry.projectId,
            startTime: currentEntry.startTime,
            endTime,
            description: currentEntry.task,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save time entry");
        }

        const newEntry = await response.json();
        setTimeEntries((prev) => [
          { ...newEntry, date: new Date(newEntry.date) },
          ...prev,
        ]);
        setCurrentEntry(null);
        setIsTracking(false);
        setTask("");
        setSelectedProjectId("");
      } catch (error) {
        console.error("Error saving time entry:", error);
        setError("Failed to save time entry. Please try again.");
      }
    }
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h}h ${m}m ${s}s`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Icons.loading className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Time Tracking</h1>

      <Card>
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm dark:bg-red-900/20">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task</label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What are you working on?"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                disabled={isTracking}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                disabled={isTracking}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            variant={isTracking ? "danger" : "primary"}
            onClick={isTracking ? stopTracking : startTracking}
            leftIcon={
              isTracking ? (
                <Icons.stop className="h-4 w-4" />
              ) : (
                <Icons.play className="h-4 w-4" />
              )
            }
          >
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </Button>
        </div>
      </Card>

      {currentEntry && (
        <Card>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20">
            <h2 className="text-xl font-semibold mb-4">Currently Tracking</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Task:</span> {currentEntry.task}
              </p>
              <p>
                <span className="font-medium">Project:</span>{" "}
                {projects.find((p) => p.id === currentEntry.projectId)?.name}
              </p>
              <p>
                <span className="font-medium">Started:</span>{" "}
                {format(currentEntry.startTime, "HH:mm:ss")}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Time Entries</h2>
          <div className="space-y-4">
            {timeEntries.length === 0 ? (
              <p className="text-gray-500">No time entries yet</p>
            ) : (
              timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b last:border-0 pb-4 last:pb-0 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{entry.description}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {entry.project.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatDuration(entry.hours)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(entry.date, "MMM d, HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
