"use client";
import { useState } from "react";
import { Plus, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

interface CreateTableFormProps {
  onSubmit: (tableName: string, columns: Column[]) => void;
  schemas: string[];
  tables: Record<string, string[]>;
  selectedSchema: string;
}

export function CreateTableForm({ onSubmit, schemas, tables, selectedSchema }: CreateTableFormProps) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<Column[]>([
    { name: "id", type: "uuid", nullable: false, isPrimary: true }
  ]);

  // Create a list of unique table references with schema information
  const tableReferences = Object.entries(tables).flatMap(([schema, schemaTables]) =>
    schemaTables.map(table => ({
      id: `${schema}.${table}`,
      schema,
      table,
      display: `${table} (${schema})`
    }))
  );

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "text", nullable: true, isPrimary: false }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof Column, value: string | boolean) => {
    setColumns(
      columns.map((col, i) =>
        i === index ? { ...col, [field]: value } : col
      )
    );
  };

  const updateForeignKey = (index: number, reference: string | null, column: string | null) => {
    setColumns(
      columns.map((col, i) =>
        i === index
          ? {
              ...col,
              foreignKey: reference && column ? {
                table: reference.split('.')[1],
                column
              } : undefined,
              type: reference && column ? "uuid" : col.type,
              nullable: reference && column ? true : col.nullable,
            }
          : col
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tableName, columns);
  };

  // Mock data for available columns (in a real app, this would come from your database)
  const mockTableColumns = {
    users: ["id", "email", "name"],
    posts: ["id", "title", "content"],
    comments: ["id", "text", "user_id"],
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="tableName">Table Name</Label>
          <Input
            id="tableName"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="users"
            className="mt-1"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Columns</h3>
            <Button type="button" variant="outline" size="sm" onClick={addColumn}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>

          {columns.map((column, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <Label>Name</Label>
                  <Input
                    value={column.name}
                    onChange={(e) => updateColumn(index, "name", e.target.value)}
                    placeholder="Column name"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Label>Type</Label>
                  <Select
                    value={column.type}
                    onValueChange={(value) => updateColumn(index, "type", value)}
                    disabled={!!column.foreignKey}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="integer">Integer</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="uuid">UUID</SelectItem>
                      <SelectItem value="timestamp">Timestamp</SelectItem>
                      <SelectItem value="jsonb">JSONB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Switch
                    checked={column.nullable}
                    onCheckedChange={(checked) => updateColumn(index, "nullable", checked)}
                    disabled={column.isPrimary}
                  />
                  <Label>Nullable</Label>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Switch
                    checked={column.isPrimary}
                    onCheckedChange={(checked) => updateColumn(index, "isPrimary", checked)}
                    disabled={index === 0 || !!column.foreignKey}
                  />
                  <Label>Primary</Label>
                </div>
                <div className="col-span-2 flex justify-end">
                  {index !== 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Foreign Key Selection */}
              {index !== 0 && (
                <div className="grid grid-cols-12 gap-4 items-end mt-2">
                  <div className="col-span-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="h-4 w-4" />
                      <Label>References Table</Label>
                    </div>
                    <Select
                      value={column.foreignKey ? `${selectedSchema}.${column.foreignKey.table}` : "none"}
                      onValueChange={(reference) => {
                        updateForeignKey(
                          index,
                          reference === "none" ? null : reference,
                          column.foreignKey?.column || "id"
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Reference</SelectItem>
                        {tableReferences.map((ref) => (
                          <SelectItem key={ref.id} value={ref.id}>
                            {ref.display}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {column.foreignKey?.table && (
                    <div className="col-span-5">
                      <Label>References Column</Label>
                      <Select
                        value={column.foreignKey.column}
                        onValueChange={(col) =>
                          updateForeignKey(
                            index,
                            `${selectedSchema}.${column.foreignKey!.table}`,
                            col
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTableColumns[column.foreignKey.table as keyof typeof mockTableColumns]?.map(
                            (col) => (
                              <SelectItem key={col} value={col}>
                                {col}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full">
          Create Table
        </Button>
      </form>
    </Card>
  );
}