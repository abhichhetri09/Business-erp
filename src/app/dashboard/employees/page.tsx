"use client";

import { useEffect, useState } from "react";
import { useUser, UserRole } from "@/contexts/user-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { Icons } from "@/components/icons";
import { Modal } from "@/components/ui/modal";
import { UserForm } from "@/components/users/user-form";
import { useAuth } from "@/hooks/useAuth";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  projects: any[];
  timeEntries: any[];
}

export default function EmployeesPage() {
  const { user, hasPermission } = useUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to fetch employees", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add employee");
      }

      showToast("Employee added successfully!", { type: "success" });
      setIsModalOpen(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error adding employee:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to add employee",
        {
          type: "error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (formData: any) => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update employee");
      }

      showToast("Employee updated successfully!", { type: "success" });
      setIsModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error updating employee:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to update employee",
        {
          type: "error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/employees/${selectedEmployee.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete employee");
      }

      showToast("Employee deleted successfully!", { type: "success" });
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error deleting employee:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to delete employee",
        {
          type: "error",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold">Employee Management</h1>
        {hasPermission(["ADMIN"]) && (
          <Button
            onClick={() => {
              setSelectedEmployee(null);
              setIsModalOpen(true);
            }}
          >
            <Icons.userPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <Input
            placeholder="Search employees..."
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
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Created At</th>
                  {hasPermission(["ADMIN"]) && (
                    <th className="text-left p-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="p-2">{employee.name}</td>
                    <td className="p-2">{employee.email}</td>
                    <td className="p-2">
                      <span className="capitalize">
                        {employee.role.toLowerCase()}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    {hasPermission(["ADMIN"]) && (
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(employee)}
                        >
                          <Icons.clipboard className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteModal(employee)}
                        >
                          <Icons.close className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
      >
        <UserForm
          user={
            selectedEmployee
              ? {
                  id: selectedEmployee.id,
                  name: selectedEmployee.name,
                  email: selectedEmployee.email,
                  role: selectedEmployee.role,
                  password: "", // Empty for existing users
                  projects: [],
                  timeEntries: [],
                }
              : undefined
          }
          onSubmit={selectedEmployee ? handleEditEmployee : handleAddEmployee}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEmployee(null);
        }}
        title="Delete Employee"
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete {selectedEmployee?.name}?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedEmployee(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteEmployee}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
