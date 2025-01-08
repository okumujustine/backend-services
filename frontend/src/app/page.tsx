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
import { executeQueryRequest } from "@/server/db/executeQueryRequest";
import { useState } from "react";
import { FaPlay, FaPlus, FaTimes } from "react-icons/fa";

export default function Page() {
  const [value, setValue] = useState<string | undefined>("");
  const [responseData, setResponseData] = useState<any | undefined>();

  const onExecuteQuery = async () => {
    setResponseData(undefined);
    if (!value) return;

    const resp = await executeQueryRequest(value);
    setResponseData(resp);
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

            <Button className="mb-1" onClick={onExecuteQuery}>
              <FaPlay  />
              Execute
            </Button>
            <div className="mb-5">
              <Playground value={value} setValue={setValue} />
            </div>
            {responseData?.error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{responseData["error"]}</AlertDescription>
              </Alert>
            ) : null}

            {responseData && responseData?.execution_time ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {responseData?.data?.columns?.map((column: string) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responseData?.data?.rows?.map((row: any, index: number) => (
                    <TableRow key={index}>
                      {responseData?.data?.columns?.map((col: string) => (
                        <TableHead key={col}>{row[col]}</TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
