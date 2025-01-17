"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TableView } from "@/components/table-view";
import { CreateTableForm } from "@/components/create-table-form";

export default function TablesPage() {
  const [selectedSchema, setSelectedSchema] = useState("public");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Mock data for demonstration
  const schemas = ["public", "auth", "storage"];
  const tables = {
    public: ["users", "posts", "comments"],
    auth: ["users", "sessions"],
    storage: ["objects", "buckets"],
  };

  const handleCreateTable = (tableName: string, columns: any[]) => {
    // TODO: Implement actual table creation
    console.log("Creating table:", tableName, columns);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 p-4">

        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Create a table
          </h1>
        </div>

        <CreateTableForm
          onSubmit={handleCreateTable}
          schemas={schemas}
          tables={tables}
          selectedSchema={selectedSchema}
        />
      </div>
    </div>
  );
}
