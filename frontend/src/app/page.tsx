"use client";
import Playground from "@/components/playground";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  Table,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Download } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [responseData, setResponseData] = useState<any | undefined>();

  const getCurrentResponse = (currentValue: string | undefined) => {
    setResponseData(currentValue);
  };

  const onExport = () => {
    //TODO: export results
  };

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0 ">
      <div className="flex-1 rounded-xl p-3 bg-muted/50">
        <div className="mb-5">
          <Playground onCurrentResponse={getCurrentResponse} />
        </div>

        <Card className="flex-1 sha">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Results</h3>
            {responseData && !responseData?.error ? (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            ) : null}
          </div>
          <div className="p-3">
            {!responseData ? (
              <span className="flex items-center justify-center text-sm">
                No result to display
              </span>
            ) : null}
            {responseData?.data ? (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {responseData?.data?.columns?.map((column: string) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responseData?.data?.rows?.map(
                      (row: any, index: number) => (
                        <TableRow key={index}>
                          {responseData?.data?.columns?.map((col: string) => (
                            <TableHead key={col}>{row[col]}</TableHead>
                          ))}
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : null}

            {responseData?.error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{responseData["error"]}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
