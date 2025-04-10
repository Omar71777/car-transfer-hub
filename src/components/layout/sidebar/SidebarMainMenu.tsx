
import React from "react"
import { Car, Home, FileText, Users, BarChart } from "lucide-react"

import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-base"
import { SidebarMenuButton } from "@/components/ui/sidebar/sidebar-menu-button"

export function SidebarMainMenu() {
  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={window.location.pathname === "/"} tooltip="Dashboard">
          <a href="/">
            <Home />
            <span>Dashboard</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Transfers">
            <a href="/transfers">
              <Car />
              <span>Todos los Transfers</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Nuevo Transfer">
            <a href="/transfers/new">
              <FileText />
              <span>Nuevo Transfer</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Transfers a Cobrar">
            <a href="/transfers/pending">
              <Car />
              <span>Transfers A Cobrar</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Expenses">
            <a href="/expenses">
              <FileText />
              <span>Todos los Expenses</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Profits">
          <a href="/profits">
            <BarChart />
            <span>Profits</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Collaborators">
          <a href="/collaborators">
            <Users />
            <span>Collaborators</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
