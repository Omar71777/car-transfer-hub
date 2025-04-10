import React from "react"
import { Car, Home } from "lucide-react"

import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-button"
import { SidebarMenuSub } from "@/components/ui/sidebar/sidebar-menu-elements"

export function SidebarMainMenu() {
  return (
    <>
      <SidebarMenuItem href="/" icon={Home}>
        Dashboard
      </SidebarMenuItem>
      
      <SidebarMenuSub icon={Car} label="Transfers">
        <SidebarMenuItem href="/transfers">
          Todos los Transfers
        </SidebarMenuItem>
        <SidebarMenuItem href="/transfers/new">
          Nuevo Transfer
        </SidebarMenuItem>
        <SidebarMenuItem href="/transfers/pending">
          Transfers A Cobrar
        </SidebarMenuItem>
      </SidebarMenuSub>
      
      <SidebarMenuSub icon={Car} label="Expenses">
        <SidebarMenuItem href="/expenses">
          Todos los Expenses
        </SidebarMenuItem>
      </SidebarMenuSub>

      <SidebarMenuItem href="/profits" icon={Car}>
        Profits
      </SidebarMenuItem>

      <SidebarMenuItem href="/collaborators" icon={Car}>
        Collaborators
      </SidebarMenuItem>
    </>
  );
}
