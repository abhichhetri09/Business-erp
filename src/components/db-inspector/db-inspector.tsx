"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow } from "@/components/ui/table";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface TableInfo {
  name: string;
  rowCount: number;
}

const DEFAULT_TABLES = [
  { name: "User", rowCount: 0 },
  { name: "Project", rowCount: 0 },
  { name: "TimeEntry", rowCount: 0 },
  { name: "Expense", rowCount: 0 },
];

export function DbInspector() {
  const [tables, setTables] = useState<TableInfo[]>(DEFAULT_TABLES);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/db/tables");
      if (!response.ok) throw new Error("Failed to fetch tables");
      const data = await response.json();
      setTables(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      // Keep showing the default tables with 0 counts on error
      setTables(DEFAULT_TABLES);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/db/tables/${tableName}`);
      if (!response.ok) throw new Error(`Failed to fetch ${tableName} data`);
      const data = await response.json();
      setTableData(data);
      setSelectedTable(tableName);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      // Show empty table data on error
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTableList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {tables.map((table) => (
        <Card
          key={table.name}
          className={cn(
            "p-4 cursor-pointer transition-colors",
            selectedTable === table.name
              ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800"
              : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
            isLoading && "opacity-70 pointer-events-none"
          )}
          onClick={() => fetchTableData(table.name)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CircleStackIcon className="h-5 w-5 text-gray-400" />
              <h3 className="font-medium">{table.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm px-2 py-1 rounded-full",
                  table.rowCount > 0
                    ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}
              >
                {table.rowCount} rows
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="p-8 text-center">
      <CircleStackIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        This table is currently empty. Data will appear here once records are
        added.
      </p>
    </Card>
  );

  const renderTableData = () => {
    if (!selectedTable) return null;

    if (!tableData.length) {
      return renderEmptyState();
    }

    const columns = Object.keys(tableData[0]);

    return (
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <th key={column} className="text-left p-4 font-medium">
                  {column}
                </th>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {columns.map((column) => (
                  <td key={column} className="p-4">
                    {typeof row[column] === "object"
                      ? JSON.stringify(row[column])
                      : String(row[column] ?? "-")}
                  </td>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <CircleStackIcon className="h-8 w-8 text-gray-400" />
          <h1 className="text-3xl font-bold">Database Inspector</h1>
        </div>
        <Button
          onClick={fetchTables}
          disabled={isLoading}
          variant="primary"
          size="md"
          leftIcon={
            isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <CircleStackIcon className="h-4 w-4" />
            )
          }
        >
          {isLoading ? "Refreshing..." : "Refresh Tables"}
        </Button>
      </div>

      {error && (
        <Card className="p-4 mb-6 border-red-200 bg-red-50 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {renderTableList()}
      {selectedTable && renderTableData()}
    </div>
  );
}
