"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { Icons } from "@/components/icons";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedUsers: User[];
}

export default function ProjectsPage() {
  const { user, isAdmin, isManager } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to fetch projects", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        {(isAdmin() || isManager()) && (
          <Button>
            <Icons.projects className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Start Date</th>
                  <th className="text-left p-2">End Date</th>
                  <th className="text-left p-2">Assigned Users</th>
                  {(isAdmin() || isManager()) && (
                    <th className="text-left p-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{project.name}</div>
                        {project.description && (
                          <div className="text-sm text-muted-foreground">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="capitalize">
                        {project.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {project.assignedUsers.map((user) => (
                          <span
                            key={user.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10"
                          >
                            {user.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    {(isAdmin() || isManager()) && (
                      <td className="p-2">
                        <Button variant="ghost" size="sm">
                          <Icons.clipboard className="h-4 w-4" />
                        </Button>
                        {isAdmin() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Icons.close className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
