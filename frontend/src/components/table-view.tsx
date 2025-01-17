"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TableViewProps {
  schema: string;
  table: string | null;
}

interface Column {
  name: string;
  type: string;
}

interface Row {
  [key: string]: any;
}

export function TableView({ schema, table }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Mock data for demonstration
  const columns: Column[] = [
    { name: "id", type: "uuid" },
    { name: "name", type: "text" },
    { name: "email", type: "text" },
    { name: "created_at", type: "timestamp" },
  ];

  const rows: Row[] = Array.from({ length: 10 }, (_, i) => ({
    id: `uuid-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredRows.map((_, i) => i)));
    }
  };

  if (!table) {
    return (
      <Card className="flex items-center justify-center h-[500px] text-muted-foreground">
        Select a table to view its data
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
          {selectedRows.size > 0 && (
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredRows.length}
                  onChange={toggleAllRows}
                  className="h-4 w-4"
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.name}>
                  <div className="flex items-center gap-2">
                    {column.name}
                    <span className="text-xs text-muted-foreground">
                      ({column.type})
                    </span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => toggleRow(index)}
                    className="h-4 w-4"
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.name}>{row[column.name]}</TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}