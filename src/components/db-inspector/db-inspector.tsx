"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CircleStackIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClipboardIcon,
  ChevronRightIcon,
  ChevronDownIcon as ChevronExpandIcon,
  TableCellsIcon,
  FunnelIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";

interface TableInfo {
  name: string;
  rowCount: number;
}

interface SortConfig {
  column: string;
  direction: "asc" | "desc";
}

interface ExpandedCell {
  rowIndex: number;
  column: string;
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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedCells, setExpandedCells] = useState<ExpandedCell[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );

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

  const handleSort = (column: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.column === column &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedData = [...tableData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue === null || aValue === undefined)
        return direction === "asc" ? 1 : -1;
      if (bValue === null || bValue === undefined)
        return direction === "asc" ? -1 : 1;

      return direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    setTableData(sortedData);
    setSortConfig({ column, direction });
  };

  const handleRowSelect = (index: number) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(index);
      return isSelected ? prev.filter((i) => i !== index) : [...prev, index];
    });
  };

  const handleCellExpand = (rowIndex: number, column: string) => {
    setExpandedCells((prev) => {
      const isExpanded = prev.some(
        (cell) => cell.rowIndex === rowIndex && cell.column === column
      );
      return isExpanded
        ? prev.filter(
            (cell) => cell.rowIndex !== rowIndex || cell.column !== column
          )
        : [...prev, { rowIndex, column }];
    });
  };

  const handleCopyCellValue = async (value: any) => {
    try {
      const textValue =
        typeof value === "object"
          ? JSON.stringify(value, null, 2)
          : String(value);

      await navigator.clipboard.writeText(textValue);
      showToast("Copied to clipboard!", { type: "success" });
    } catch (error) {
      showToast("Failed to copy value", { type: "error" });
    }
  };

  const handleFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const filteredData = tableData.filter((row) => {
    return Object.entries(columnFilters).every(([column, filterValue]) => {
      if (!filterValue) return true;

      const cellValue = row[column];
      const stringValue =
        typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : String(cellValue ?? "");

      return stringValue.toLowerCase().includes(filterValue.toLowerCase());
    });
  });

  const renderTableList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {tables.map((table) => (
        <motion.div
          key={table.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 transform hover:scale-102 hover:shadow-lg",
              selectedTable === table.name
                ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 ring-2 ring-primary-500/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
              isLoading && "opacity-70 pointer-events-none"
            )}
            onClick={() => fetchTableData(table.name)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
                  <TableCellsIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {table.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Table
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm px-3 py-1 rounded-full font-medium",
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
        </motion.div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="p-8 text-center">
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <TableCellsIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        This table is currently empty. Data will appear here once records are
        added to the database.
      </p>
      <Button variant="outline" onClick={() => setSelectedTable(null)}>
        View Other Tables
      </Button>
    </Card>
  );

  const renderTableData = () => {
    if (!selectedTable) return null;

    if (!tableData.length) {
      return renderEmptyState();
    }

    const columns = Object.keys(tableData[0]);
    const hasFilters = Object.values(columnFilters).some(
      (filter) => filter !== ""
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
              <TableCellsIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedTable}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredData.length} of {tableData.length} rows
                {hasFilters && " (filtered)"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColumnFilters({})}
                className="flex items-center gap-2"
              >
                <XCircleIcon className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTable(null)}
              className="flex items-center gap-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Tables
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div style={{ height: "600px" }} className="overflow-auto">
            <div className="relative">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-white dark:bg-gray-800 border-b">
                    <th className="p-4 w-10">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === filteredData.length}
                          onChange={() => {
                            setSelectedRows(
                              selectedRows.length === filteredData.length
                                ? []
                                : filteredData.map((_, i) => i)
                            );
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </th>
                    {columns.map((column) => (
                      <th key={column} className="text-left p-4">
                        <div className="space-y-2">
                          <div
                            className="flex items-center gap-2 cursor-pointer select-none group"
                            onClick={() => handleSort(column)}
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {column}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {sortConfig?.column === column ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUpIcon className="h-4 w-4 text-primary-500" />
                                ) : (
                                  <ChevronDownIcon className="h-4 w-4 text-primary-500" />
                                )
                              ) : (
                                <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder={`Filter ${column}...`}
                              value={columnFilters[column] || ""}
                              onChange={(e) =>
                                handleFilterChange(column, e.target.value)
                              }
                              className="text-sm pr-8"
                            />
                            <FunnelIcon className="h-4 w-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredData.map((row, rowIndex) => (
                      <motion.tr
                        key={rowIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "border-b transition-colors",
                          selectedRows.includes(rowIndex)
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <td className="p-4 w-10">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(rowIndex)}
                              onChange={() => handleRowSelect(rowIndex)}
                              className="rounded border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        </td>
                        {columns.map((column) => {
                          const value = row[column];
                          const isObject =
                            typeof value === "object" && value !== null;
                          const isExpanded = expandedCells.some(
                            (cell) =>
                              cell.rowIndex === rowIndex &&
                              cell.column === column
                          );

                          return (
                            <td
                              key={column}
                              className="p-4 whitespace-pre-wrap break-words max-w-md group"
                            >
                              <div className="flex items-start gap-2">
                                {isObject && (
                                  <button
                                    onClick={() =>
                                      handleCellExpand(rowIndex, column)
                                    }
                                    className="mt-1 hover:text-primary-500 transition-colors"
                                  >
                                    {isExpanded ? (
                                      <ChevronExpandIcon className="h-4 w-4" />
                                    ) : (
                                      <ChevronRightIcon className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                                <div className="flex-1">
                                  {isObject ? (
                                    <motion.div
                                      initial={false}
                                      animate={{
                                        height: isExpanded ? "auto" : "1.5rem",
                                      }}
                                      className="overflow-hidden"
                                    >
                                      <pre className="text-sm">
                                        {isExpanded
                                          ? JSON.stringify(value, null, 2)
                                          : JSON.stringify(value)}
                                      </pre>
                                    </motion.div>
                                  ) : (
                                    <span className="text-gray-900 dark:text-gray-100">
                                      {String(value ?? "-")}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleCopyCellValue(value)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-500"
                                >
                                  <ClipboardIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedRows.length} of {filteredData.length} rows selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedRows([])}
                  disabled={selectedRows.length === 0}
                  className="flex items-center gap-2"
                >
                  <XCircleIcon className="h-4 w-4" />
                  Clear Selection
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const selectedData = selectedRows.map(
                      (i) => filteredData[i]
                    );
                    handleCopyCellValue(selectedData);
                  }}
                  disabled={selectedRows.length === 0}
                  className="flex items-center gap-2"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  Copy Selected
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/40">
            <CircleStackIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Database Inspector
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Browse and inspect your database tables
            </p>
          </div>
        </div>
        <Button
          onClick={fetchTables}
          disabled={isLoading}
          variant="primary"
          size="lg"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <CircleStackIcon className="h-5 w-5" />
              Refresh Tables
            </>
          )}
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {renderTableList()}
      {selectedTable && renderTableData()}
    </div>
  );
}
