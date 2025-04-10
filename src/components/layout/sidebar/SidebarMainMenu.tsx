
import React from "react"
import { Car, Home } from "lucide-react"

import { SidebarItem } from "@/components/ui/sidebar/sidebar-menu-elements"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"

export function SidebarMainMenu() {
  return (
    <>
      <SidebarItem href="/" icon={Home}>
        Dashboard
      </SidebarItem>
      
      <SidebarMenu icon={Car} title="Transfers">
        <SidebarItem href="/transfers">
          Todos los Transfers
        </SidebarItem>
        <SidebarItem href="/transfers/new">
          Nuevo Transfer
        </SidebarItem>
        <SidebarItem href="/transfers/pending">
          Transfers A Cobrar
        </SidebarItem>
      </SidebarMenu>
      
      <SidebarMenu icon={Car} title="Expenses">
        <SidebarItem href="/expenses">
          Todos los Expenses
        </SidebarItem>
      </SidebarMenu>

      <SidebarItem href="/profits" icon={Car}>
        Profits
      </SidebarItem>

      <SidebarItem href="/collaborators" icon={Car}>
        Collaborators
      </SidebarItem>
    </>
  );
}
