"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, Folder, LogOut, Menu, X, FileText, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/firebase/auth"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigation = [
  {
    name: "Дэшборд",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Товары",
    href: "/products",
    icon: Package,
  },
  {
    name: "Категории",
    href: "/categories",
    icon: Folder,
  },
  {
  name: "Заявки",
    href: "/applications",
    icon: FileText,
  },
  {
    name: "Медия",
    href: "/media",
    icon: ImageIcon,
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const NavContent = () => (
    <nav className="flex flex-col space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
      
      <Button
        variant="ghost"
        className="mt-4 w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5 mr-1" />
        Выход
      </Button>
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:border-r bg-background">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <NavContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 bg-background border"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-5 border-b">
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

