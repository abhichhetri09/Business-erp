"use client";

import { useState, useCallback } from "react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-data";
import { LoadingPage } from "@/components/ui/loading";
import { UserForm } from "@/components/users/user-form";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow } from "@/components/ui/table";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
}

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  description: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: Project[];
  timeEntries: TimeEntry[];
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
}

export default function EmployeesPage() {
  const { data: users, isLoading, error, refetch } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const refreshData = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  }, [refetch]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center text-red-700 dark:text-red-400">
            <span className="font-medium">Error loading employees</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={refreshData}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleCreateSubmit = async (data: UserFormData) => {
    try {
      await createUser.mutateAsync(data);
      showToast("Employee created successfully");
      setIsCreating(false);
      await refreshData();
    } catch (error) {
      showToast("Failed to create employee", { type: "error" });
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateSubmit = async (data: UserFormData) => {
    if (!editingUser) return;
    try {
      await updateUser.mutateAsync(
        {
          id: editingUser.id,
          ...data,
        },
        {
          onSuccess: async () => {
            showToast("Employee updated successfully");
            setEditingUser(null);
            await refreshData();
          },
          onError: (error: Error) => {
            showToast(error.message || "Failed to update employee", {
              type: "error",
            });
            console.error("Failed to update user:", error);
          },
        }
      );
    } catch (error) {
      showToast("An unexpected error occurred", { type: "error" });
      console.error("Unexpected error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser.mutateAsync(id);
      showToast("Employee deleted successfully");
      await refreshData();
    } catch (error) {
      showToast("Failed to delete employee", { type: "error" });
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={refreshData}
            className="mr-2"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {isCreating && (
        <div className="mb-6">
          <UserForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreating(false)}
            isLoading={createUser.isPending}
          />
        </div>
      )}

      {editingUser && (
        <div className="mb-6">
          <UserForm
            user={editingUser}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setEditingUser(null)}
            isLoading={updateUser.isPending}
          />
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Projects</th>
              <th className="text-left p-4 font-medium">Time Entries</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">{user.projects.length}</td>
                <td className="p-4">{user.timeEntries.length}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
