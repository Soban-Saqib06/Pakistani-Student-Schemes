"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookmarkIcon, EyeIcon, InfoIcon, LayersIcon, LayoutDashboardIcon, LogOutIcon, SearchIcon, TypeIcon } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { useAuthModal } from "@/lib/auth-modal-context"
import { useAccessibility } from "@/lib/accessibility-context"
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
  { href: "/browse", label: "Browse", icon: SearchIcon },
  { href: "/categories", label: "Categories", icon: LayersIcon },
  { href: "/bookmarks", label: "Saved", icon: BookmarkIcon },
  { href: "/about", label: "About", icon: InfoIcon },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()
  const { promptAuth } = useAuthModal()
  const { fontScale, setFontScale, dyslexiaMode, toggleDyslexiaMode } = useAccessibility()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Brand */}
        <Link href="/" className="group flex flex-col justify-center select-none shrink-0">
          <span className="text-2xl font-black tracking-tight leading-none text-foreground transition-opacity group-hover:opacity-90">
            Taleem<span className="text-pak-green">Hub</span>
          </span>
          <span className="mt-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Pakistan
          </span>
        </Link>

        {/* Larger Navigation Tabs - single clean row on desktop */}
        <nav className="hidden md:flex items-center gap-1.5 md:gap-2">
          {navLinks.map((link) => {
            const active = pathname === link.href
            const Icon = link.icon
            return (
              <Button
                key={link.href}
                variant={active ? "secondary" : "ghost"}
                size="default"
                className={`h-11 px-4 gap-2.5 text-[15px] font-semibold transition-all ${
                  active
                    ? "bg-secondary text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
                render={<Link href={link.href} />}
              >
                <Icon className="size-4.5" />
                {link.label}
              </Button>
            )
          })}
          {isAdmin ? (
            <Button
              variant={pathname.startsWith("/admin") ? "secondary" : "ghost"}
              size="default"
              className={`h-11 px-4 gap-2.5 text-[15px] font-semibold transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-secondary text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
              render={<Link href="/admin" />}
            >
              <LayoutDashboardIcon className="size-4.5" />
              Admin
            </Button>
          ) : null}
        </nav>

        {/* Profile / Accessibility / Auth Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Standalone Accessibility Menu for Logged-Out Visitors */}
          {!user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex size-10 items-center justify-center rounded-md border border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-all shadow-2xs"
                title="Accessibility settings (Text scaling & Dyslexia mode)"
                aria-label="Accessibility settings"
              >
                <TypeIcon className="size-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-border/70 rounded-md">
                <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Accessibility
                </DropdownMenuLabel>
                <div className="px-2 py-2">
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-foreground">
                    <span>Font Size</span>
                    <span className="text-[11px] font-semibold text-pak-green uppercase">{fontScale}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFontScale("normal")}
                      className={`rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        fontScale === "normal"
                          ? "bg-pak-green text-white shadow-xs"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale("large")}
                      className={`rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        fontScale === "large"
                          ? "bg-pak-green text-white shadow-xs"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      115%
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale("xlarge")}
                      className={`rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        fontScale === "xlarge"
                          ? "bg-pak-green text-white shadow-xs"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      130%
                    </button>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <div
                  onClick={toggleDyslexiaMode}
                  className="flex cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <EyeIcon className="size-4 text-pak-green" />
                    <span>Dyslexia-friendly font</span>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      dyslexiaMode
                        ? "bg-pak-green text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {dyslexiaMode ? "On" : "Off"}
                  </span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Current User Button with Accessibility controls inside dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="group flex items-center gap-3 rounded-md border border-border/80 bg-background py-1.5 pl-2 pr-4 text-sm font-semibold shadow-2xs hover:border-foreground/30 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-all"
              >
                <Avatar className="size-8.5 ring-1 ring-border">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="max-w-32 truncate font-semibold text-foreground text-sm">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {isAdmin ? "Admin" : "Student"}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-border/70">
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

                {/* Accessibility Options in User Menu */}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Accessibility
                </DropdownMenuLabel>
                <div className="px-2 py-1.5">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground">
                    <span>Font Size</span>
                    <span className="text-[11px] font-semibold text-pak-green uppercase">{fontScale}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => setFontScale("normal")}
                      className={`rounded-md py-1 text-xs font-semibold transition-all cursor-pointer ${
                        fontScale === "normal"
                          ? "bg-pak-green text-white shadow-xs"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale("large")}
                      className={`rounded-md py-1 text-xs font-semibold transition-all cursor-pointer ${
                        fontScale === "large"
                          ? "bg-pak-green text-white shadow-xs"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      115%
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale("xlarge")}
                      className={`rounded-md py-1 text-xs font-semibold transition-all cursor-pointer ${
                        fontScale === "xlarge"
                          ? "bg-pak-green text-white shadow-xs"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      130%
                    </button>
                  </div>
                </div>

                <div
                  onClick={toggleDyslexiaMode}
                  className="flex cursor-pointer select-none items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <EyeIcon className="size-4 text-pak-green" />
                    <span>Dyslexia font</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      dyslexiaMode
                        ? "bg-pak-green text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {dyslexiaMode ? "On" : "Off"}
                  </span>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout} className="cursor-pointer gap-2 py-2 text-destructive">
                  <LogOutIcon className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2.5">
              <Button variant="ghost" size="default" className="h-10 px-4 text-sm font-semibold" onClick={() => promptAuth("login")}>
                Log in
              </Button>
              <Button size="default" className="h-10 px-4.5 text-sm font-semibold bg-pak-green hover:bg-pak-green/90 text-white shadow-xs" onClick={() => promptAuth("register")}>
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Vertical / Mobile Bar: Out of header navigation and separate Sign up / Log in buttons */}
      <div className="md:hidden border-t border-border/50 bg-background/95 px-4 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex items-center justify-between gap-3 max-w-6xl">
          {/* Mobile Navigation */}
          <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href
              const Icon = link.icon
              return (
                <Button
                  key={link.href}
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-9 px-3 gap-1.5 text-xs font-semibold shrink-0 ${
                    active
                      ? "bg-secondary text-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                  render={<Link href={link.href} />}
                >
                  <Icon className="size-3.5" />
                  <span>{link.label}</span>
                </Button>
              )
            })}
            {isAdmin ? (
              <Button
                variant={pathname.startsWith("/admin") ? "secondary" : "ghost"}
                size="sm"
                className={`h-9 px-3 gap-1.5 text-xs font-semibold shrink-0 ${
                  pathname.startsWith("/admin")
                    ? "bg-secondary text-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
                render={<Link href="/admin" />}
              >
                <LayoutDashboardIcon className="size-3.5" />
                <span>Admin</span>
              </Button>
            ) : null}
          </nav>

          {/* Out-of-Header Auth Buttons in Vertical Mode */}
          {!user ? (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3.5 text-xs font-semibold shadow-2xs"
                onClick={() => promptAuth("login")}
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="h-9 px-3.5 text-xs font-semibold bg-pak-green hover:bg-pak-green/90 text-white shadow-2xs"
                onClick={() => promptAuth("register")}
              >
                Sign up
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
