"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Playground from "@/components/playground";
import { ThemeToggleMenu } from "@/components/theme-toggle-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Connection One</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeToggleMenu />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-1 rounded-xl bg-muted/50 p-3">
            <div className="mb-5">
              <Playground onCurrentResponse={getCurrentResponse} />
            </div>

            <Card className="flex-1 shadow-none">
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
                          {responseData?.data?.columns?.map(
                            (column: string) => (
                              <TableHead key={column}>{column}</TableHead>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {responseData?.data?.rows?.map(
                          (row: any, index: number) => (
                            <TableRow key={index}>
                              {responseData?.data?.columns?.map(
                                (col: string) => (
                                  <TableHead key={col}>{row[col]}</TableHead>
                                )
                              )}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
