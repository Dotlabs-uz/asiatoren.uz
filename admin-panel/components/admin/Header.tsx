"use client"

import { useAuthContext } from "@/components/admin/AuthProvider"
import { User } from "lucide-react"

export function Header() {
  const { user } = useAuthContext()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold md:text-xl">Админ Панель</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {user?.email || "Пользователь"}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

