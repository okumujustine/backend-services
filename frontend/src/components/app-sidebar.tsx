"use client"

import { useState } from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  DatabaseZapIcon,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  PlaySquare,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { DBConnectionSwitcher } from "@/components/db-connection-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SchemaExplorer } from "./schema-explorer"
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [selectedSchema, setSelectedSchema] = useState("public");

  const schemas = ["public", "auth", "storage"];
  const tables = {
    public: ["users", "posts", "comments"],
    auth: ["users", "sessions"],
    storage: ["objects", "buckets"]
  };

  const connections = [
    {
      name: "Database one",
      type: "connection 1",
    },
    {
      name: "Database two",
      type: "connection 2",
    }
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DBConnectionSwitcher connections={connections} />
      </SidebarHeader>
      <SidebarContent>
        <SchemaExplorer/>
        <Link href="/dashboard/api/graphql/console" className="mx-4 space-y-1">
          <div className="flex items-center">
            <PlaySquare className="h-4 w-4 mr-2 "/>
            <span>graphql</span>
          </div>
        </Link>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
