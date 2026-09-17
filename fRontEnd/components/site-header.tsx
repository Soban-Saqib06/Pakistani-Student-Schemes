"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookmarkIcon, GraduationCapIcon, InfoIcon, LayoutDashboardIcon, LogOutIcon, MailIcon, SearchIcon } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useAuthModal } from "@/lib/auth-modal-context"
import { initials } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/", label: "Browse", icon: SearchIcon },
  { href: "/categories", label: "Categories", icon: GraduationCapIcon },
  { href: "/bookmarks", label: "Saved", icon: BookmarkIcon },
  { href: "/about", label: "About", icon: InfoIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()
  const { promptAuth } = useAuthModal()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        {/* Brand with subtle emerald detail */}
        <Link href="/" className="group flex items-center gap-2.5 font-bold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            <GraduationCapIcon className="size-5 text-pak-green" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg leading-none font-bold text-foreground">
              Taleem<span className="text-pak-green">Hub</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Pakistan
            </span>
          </div>
        </Link>

        {/* Larger Navigation Tabs */}
        <nav className="ml-4 flex items-center gap-1.5">
          {navLinks.map((link) => {
            const active = pathname === link.href
            const Icon = link.icon
            return (
              <Button
                key={link.href}
                variant={active ? "secondary" : "ghost"}
                size="default"
                className={`h-9 px-3.5 gap-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-secondary text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
                render={<Link href={link.href} />}
              >
                <Icon className="size-4" />
                {link.label}
              </Button>
            )
          })}
          {isAdmin ? (
            <Button
              variant={pathname.startsWith("/admin") ? "secondary" : "ghost"}
              size="default"
              className={`h-9 px-3.5 gap-2 text-sm font-medium transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-secondary text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
              render={<Link href="/admin" />}
            >
              <LayoutDashboardIcon className="size-4" />
              Admin
            </Button>
          ) : null}
        </nav>

        {/* Profile Button with Character */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="group flex items-center gap-2.5 rounded-full border border-border/80 bg-background py-1 pl-1.5 pr-3 text-sm font-medium shadow-2xs hover:border-foreground/30 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-all"
              >
                <Avatar className="size-7 ring-1 ring-border">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="max-w-28 truncate font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {isAdmin ? "Admin" : "Student"}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border/70">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5">
                    <div className="flex flex-col">
                      <span className="truncate font-semibold text-foreground">{user.name}</span>
                      <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/bookmarks")} className="cursor-pointer gap-2 py-2">
                    <BookmarkIcon className="size-4 text-muted-foreground" />
                    Saved schemes
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer gap-2 py-2">
                      <LayoutDashboardIcon className="size-4 text-muted-foreground" />
                      Admin dashboard
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout} className="cursor-pointer gap-2 py-2 text-destructive">
                  <LogOutIcon className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="default" className="h-9 font-medium" onClick={() => promptAuth("login")}>
                Log in
              </Button>
              <Button size="default" className="h-9 font-medium shadow-xs" onClick={() => promptAuth("register")}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
