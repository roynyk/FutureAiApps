"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import {
  BanknoteIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Wallet,
} from "lucide-react";
import { cn } from "cn";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    href: "/dashboard",
  },
  {
    label: "Transaction",
    icon: <BanknoteIcon />,
    href: "/dashboard/transaction",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Failed to logout: " + error.message);
      } else {
        toast.success("Logout Successfully!");
        router.push("/auth/login");
        router.refresh();
      }
    } catch {
      toast.error("An Expected Error Occured while logout!");
    }
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="gap-2 flex-row items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Wallet className="text-primary size-5!" />
                <h1 className="text-2xl font-bold text-primary">Future App</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className={cn(
                    "py-6 px-5 text-md",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground"
                      : "",
                  )}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>{" "}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex flex-col gap-2">
          {user && (
            <div className="p-4 border rounded-2xl">
              {user.user_metadata?.full_name && (
                <div className="text-primary font-semibold truncate">
                  {user.user_metadata.full_name}
                </div>
              )}
              {user.user_metadata?.email && (
                <div className="truncate text-xs">
                  {user.user_metadata.email}
                </div>
              )}
            </div>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogOut}
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive py-5 cursor-pointer"
                tooltip="Logout"
              >
                <LogOutIcon className="size-4" />
                Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
