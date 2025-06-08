import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import TimeTrackingPage from "../page";
import { useUser, UserContextType } from "@/contexts/user-context";
import { showToast } from "@/lib/toast";
import "@testing-library/jest-dom";

// Mock the dependencies
jest.mock("@/contexts/user-context");
jest.mock("@/lib/toast");

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockShowToast = showToast as jest.MockedFunction<typeof showToast>;

describe("TimeTrackingPage", () => {
  const mockUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "EMPLOYEE" as const,
  };

  const mockProjects = [
    { id: "1", name: "Project 1" },
    { id: "2", name: "Project 2" },
  ];

  const mockTimeEntries = [
    {
      id: "1",
      date: new Date().toISOString(),
      hours: 2,
      description: "Test task",
      project: { name: "Project 1" },
    },
  ];

  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
      hasPermission: () => true,
      initialized: true,
      checkAuth: jest.fn(),
      updateUserState: jest.fn(),
    } as UserContextType);

    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders time tracking interface after loading", async () => {
    // Create a promise that we can resolve manually
    let resolveProjects: (value: any) => void;
    let resolveEntries: (value: any) => void;

    const projectsPromise = new Promise((resolve) => {
      resolveProjects = resolve;
    });

    const entriesPromise = new Promise((resolve) => {
      resolveEntries = resolve;
    });

    const fetchPromises = [
      projectsPromise.then(() => ({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      })),
      entriesPromise.then(() => ({
        ok: true,
        json: () => Promise.resolve(mockTimeEntries),
      })),
    ];

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => fetchPromises[0])
      .mockImplementationOnce(() => fetchPromises[1]);

    render(<TimeTrackingPage />);

    // Test loading state before resolving promises
    expect(screen.getByTestId("loading-spinner")).toHaveClass("animate-spin");

    // Now resolve the promises
    await act(async () => {
      resolveProjects({});
      resolveEntries({});
      await Promise.all(fetchPromises);
    });

    // Wait for loaded state
    await waitFor(() => {
      expect(screen.getByText("Time Tracking")).toBeInTheDocument();
    });

    expect(screen.getByText("Start Tracking")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("What are you working on?")
    ).toBeInTheDocument();
    expect(screen.getByText("Select a project")).toBeInTheDocument();
  });

  it("starts time tracking when clicking start button", async () => {
    const fetchPromises = [
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      }),
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTimeEntries),
      }),
    ];

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => fetchPromises[0])
      .mockImplementationOnce(() => fetchPromises[1]);

    await act(async () => {
      render(<TimeTrackingPage />);
      await Promise.all(fetchPromises);
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Start Tracking")).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      fireEvent.change(
        screen.getByPlaceholderText("What are you working on?"),
        {
          target: { value: "New task" },
        }
      );
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "1" },
      });
    });

    // Click start button
    await act(async () => {
      fireEvent.click(screen.getByText("Start Tracking"));
    });

    // Verify tracking started
    expect(screen.getByText("Stop Tracking")).toBeInTheDocument();
  });

  it("handles errors during time tracking operations", async () => {
    // Mock console.error to prevent error output in test results
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const errorMessage = "Failed to fetch data";

    const fetchPromises = [
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: errorMessage,
      }),
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: errorMessage,
      }),
    ];

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => fetchPromises[0])
      .mockImplementationOnce(() => fetchPromises[1]);

    await act(async () => {
      render(<TimeTrackingPage />);
      await Promise.all(fetchPromises);
    });

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText("Failed to load data. Please try again.")
      ).toBeInTheDocument();
    });

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("validates form before starting time tracking", async () => {
    const fetchPromises = [
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      }),
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTimeEntries),
      }),
    ];

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => fetchPromises[0])
      .mockImplementationOnce(() => fetchPromises[1]);

    await act(async () => {
      render(<TimeTrackingPage />);
      await Promise.all(fetchPromises);
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Start Tracking")).toBeInTheDocument();
    });

    // Try to start tracking without filling the form
    await act(async () => {
      fireEvent.click(screen.getByText("Start Tracking"));
    });

    // Verify error message
    expect(
      screen.getByText("Please enter both task and project details")
    ).toBeInTheDocument();
  });

  it("stops time tracking when clicking stop button", async () => {
    const fetchPromises = [
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      }),
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTimeEntries),
      }),
    ];

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => fetchPromises[0])
      .mockImplementationOnce(() => fetchPromises[1]);

    await act(async () => {
      render(<TimeTrackingPage />);
      await Promise.all(fetchPromises);
    });

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Start Tracking")).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      fireEvent.change(
        screen.getByPlaceholderText("What are you working on?"),
        {
          target: { value: "New task" },
        }
      );
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "1" },
      });
    });

    // Start tracking
    await act(async () => {
      fireEvent.click(screen.getByText("Start Tracking"));
    });

    // Verify tracking started
    expect(screen.getByText("Stop Tracking")).toBeInTheDocument();

    // Mock the stop tracking API call
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Stop tracking
    await act(async () => {
      fireEvent.click(screen.getByText("Stop Tracking"));
    });

    // Verify tracking stopped and UI updated
    await waitFor(() => {
      expect(screen.getByText("Start Tracking")).toBeInTheDocument();
    });

    // Verify API call was made
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/time/stop",
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
