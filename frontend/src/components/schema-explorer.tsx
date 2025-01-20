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
  OptionIcon,
  LucideView,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { customTanstackey } from "@/tangstack/const";
import { fetchSchemas } from "@/server/db/getSchemaStructure";

export function SchemaExplorer() {
  // TODO: handle errors

  const [expandedSchemas, setExpandedSchemas] = useState<
    Record<number, Boolean>
  >({});
  const [expandedTables, setExpandedTables] = useState<Record<string, Boolean>>(
    {}
  );

  const { isLoading, data } = useQuery({
    queryKey: [customTanstackey.DB_SCHEMAS],
    queryFn: () => fetchSchemas(),
  });
  const schemas: I_Schema[] = data?.result;

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
      {!isLoading && schemas &&
        schemas.map((schema) => (
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
                  className="mx-4 space-y-1"
                  key={table.title}
                  onClick={() => expandTable(constructExpenadedTableKey(table))}
                >
                  <div className="flex items-center justify-between text-xs">
                    
                    <div className="flex items-center">
                      <Table2 className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span>{table.title}</span>
                    </div>

                    <div className="flex items-center">
                      <div onClick={(e) => {
                        e.stopPropagation()
                        console.log("view table details")
                      }}><LucideView className="h-3 w-3 mx-2 cursor-pointer"/> </div>
                      {isExpandedTable(constructExpenadedTableKey(table)) ? (
                        <ChevronDown className="h-3 w-3 ml-auto cursor-pointer" />
                      ) : (
                        <ChevronRight className="h-3 w-3 ml-auto cursor-pointer" />
                      )}
                    </div>
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
                          <span className="ml-2 opacity-75">
                            ({column.type})
                          </span>
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
