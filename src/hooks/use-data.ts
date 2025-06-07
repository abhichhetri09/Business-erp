import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  projects: Project[];
  managedProjects: Project[];
  timeEntries: TimeEntry[];
  expenses: Expense[];
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  manager: User;
  members: User[];
  timeEntries: TimeEntry[];
  expenses: Expense[];
}

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  description: string | null;
  user: User;
  project: Project;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: string;
  user: User;
  project: Project;
}

// API functions
async function fetchUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

async function createUser(data: Partial<User>) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  return response.json();
}

async function updateUser({ id, ...data }: Partial<User> & { id: string }) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
}

async function deleteUser(id: string) {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json();
}

async function fetchProjects() {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

async function createProject(data: Partial<Project>) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  return response.json();
}

async function fetchTimeEntries() {
  const response = await fetch("/api/time-entries");
  if (!response.ok) {
    throw new Error("Failed to fetch time entries");
  }
  return response.json();
}

async function createTimeEntry(data: Partial<TimeEntry>) {
  const response = await fetch("/api/time-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create time entry");
  }
  return response.json();
}

async function fetchExpenses() {
  const response = await fetch("/api/expenses");
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}

async function createExpense(data: Partial<Expense>) {
  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create expense");
  }
  return response.json();
}

// Hooks
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    // Refetch data every 5 seconds if window is focused
    refetchInterval: 5000,
    // Consider data fresh for 3 seconds
    staleTime: 3000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Retry failed requests 3 times
    retry: 3,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Invalidate and refetch all user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", data.id] });

      // Update the cache directly
      queryClient.setQueryData(["users"], (oldData: User[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map((user) => (user.id === data.id ? data : user));
      });

      // Update the individual user cache
      queryClient.setQueryData(["users", data.id], data);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      throw error;
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useTimeEntries() {
  return useQuery({
    queryKey: ["timeEntries"],
    queryFn: fetchTimeEntries,
  });
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
    },
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
