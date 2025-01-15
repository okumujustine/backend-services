"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Table,
  Key,
  Link2,
  Database,
  Lock,
  Zap,
  Table2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarMenu } from "@/components/ui/sidebar";

export function SchemaExplorer() {
  const [expandedSchemas, setExpandedSchemas] = useState<
    Record<number, Boolean>
  >({});
  const [expandedTables, setExpandedTables] = useState<Record<string, Boolean>>(
    {}
  );

  const schemas = [
    {
      id: 1,
      title: "Schema one",
      tables: [
        {
          id: 1,
          title: "table one",
          columns: [
            { name: "id", type: "uuid", nullable: false, isPrimary: true },
            { name: "email", type: "text", nullable: false, isPrimary: false },
            { name: "name", type: "text", nullable: true, isPrimary: false },
          ],
        },
        {
          id: 2,
          title: "table two",
          columns: [
            { name: "id", type: "uuid", nullable: false, isPrimary: true },
            {
              name: "user_id",
              type: "uuid",
              nullable: false,
              isPrimary: false,
            },
            { name: "title", type: "text", nullable: false, isPrimary: false },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Schema two",
      tables: [
        { id: 1, title: "table three", columns: [] },
        { id: 2, title: "table four", columns: [] },
      ],
    },
  ];

  const isExpandedSchema = (schemaId: number) => {
    return expandedSchemas[schemaId] == true;
  };

  const isExpandedTable = (schemaTableId: string) => {
    return expandedTables[schemaTableId] == true;
  };

  const expandSchemas = (schemaId: number) => {
    setExpandedSchemas((prevSchemas) => {
      const isCurrentlyExpanded = prevSchemas[schemaId] ?? false;

      return {
        ...prevSchemas,
        [schemaId]: !isCurrentlyExpanded,
      };
    });
  };

  const expandTable = (tableId: string) => {
    setExpandedTables((prevTables) => {
      const isCurrentlyExpanded = prevTables[tableId] ?? false;

      return {
        ...prevTables,
        [tableId]: !isCurrentlyExpanded,
      };
    });
  };

  const constructExpenadedTableKey = (table: any) => {
    return `${table.title}_${table.id}`;
  };

  return (
    <div className="p-2 space-y-1">
      {schemas.map((schema) => (
        <div className="space-y-1" key={schema.title}>
          <div
            className="flex items-center cursor-pointer hover:bg-accent h-9 px-2 rounded-sm"
            onClick={() => expandSchemas(schema.id)}
          >
            <Database className="h-4 w-4 mr-2" />
            <span className="text-sm">{schema.title}</span>
            {isExpandedSchema(schema.id) ? (
              <ChevronDown className="h-3 w-3 ml-auto" />
            ) : (
              <ChevronRight className="h-3 w-3 ml-auto" />
            )}
          </div>

          {isExpandedSchema(schema.id) &&
            schema.tables.map((table) => (
              <div
                className="ml-4 space-y-1"
                key={table.title}
                onClick={() => expandTable(constructExpenadedTableKey(table))}
              >
                <div className="flex items-center cursor-pointer text-xs">
                  <Table2 className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span>{table.title}</span>
                  {isExpandedTable(constructExpenadedTableKey(table)) ? (
                    <ChevronDown className="h-3 w-3 ml-auto" />
                  ) : (
                    <ChevronRight className="h-3 w-3 ml-auto" />
                  )}
                </div>
                {isExpandedTable(constructExpenadedTableKey(table)) &&
                  table.columns.map((column) => (
                    <div className="space-y-1" key={column.name}>
                      <div
                        key={column.name}
                        className="flex items-center text-xs text-muted-foreground py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer"
                      >
                        {column.isPrimary && (
                          <Key className="h-3 w-3 mr-1 text-primary" />
                        )}
                        <span className="font-medium">{column.name}</span>
                        <span className="ml-2 opacity-75">({column.type})</span>
                        {!column.nullable && (
                          <span className="ml-1 text-[10px] text-muted-foreground">
                            NOT NULL
                          </span>
                        )}
                        {column.isPrimary && (
                          <span className="ml-1 text-[10px] text-primary">
                            PK
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
