
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { ReactNode, forwardRef } from "react";

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: ReactNode;
  path?: string;
  status?: "active" | "pending" | "completed" | "inactive";
  isChild?: boolean;
  isSubmenu?: boolean;
  isOpen?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  (
    {
      icon,
      title,
      path,
      isChild = false,
      isSubmenu = false,
      isOpen = false,
      status = "inactive",
      className,
      collapsed = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const isActive = status === "active";
    
    const defaultClasses = cn(
      "flex items-center transition-colors duration-200",
      collapsed ? "justify-center" : "justify-between",
      isChild ? "pl-10 pr-3 py-2" : "px-3 py-2",
      {
        "cursor-pointer hover:bg-white/5": true,
        "hover:text-white": !isActive,
        "bg-primary-foreground/20 text-white dark:bg-white/10 rounded-md": isActive,
        "text-white/80": !isActive,
        "justify-center": collapsed,
      },
      className
    );

    const content = (
      <div
        className={defaultClasses}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        <div className={cn("flex items-center gap-2", { "justify-center": collapsed })}>
          {icon && <div className="shrink-0 w-5 h-5">{icon}</div>}
          {!collapsed && <div className={cn("text-sm font-medium", { "font-semibold": isActive })}>{title}</div>}
        </div>
        {isSubmenu && !collapsed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", {
              "rotate-90": isOpen,
              "rotate-0": !isOpen,
            })}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </div>
    );

    if (path) {
      return <Link href={path}>{content}</Link>;
    }

    return content;
  }
);

SidebarItem.displayName = "SidebarItem";

export { SidebarItem };
