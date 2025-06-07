import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const attendanceData = [
  {
    id: 1,
    employeeName: "John Doe",
    date: "2024-02-14",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    status: "Present",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    date: "2024-02-14",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    status: "Present",
  },
  // Add more attendance records as needed
];

export default function AttendancePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Attendance</h1>
      <Card>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employeeName}
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {record.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
