"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AwardIcon, LayersIcon, ShieldAlertIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AdminSchemes } from "@/components/admin/admin-schemes"
import { AdminCategories } from "@/components/admin/admin-categories"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("schemes")

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-base text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-md bg-destructive/10 text-destructive mb-4">
          <ShieldAlertIcon className="size-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Access Required</h1>
        <p className="mt-2 text-base text-muted-foreground">
          You need an account with the <strong>Admin</strong> role to access the scheme management dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="lg" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2 border-b border-border/60 pb-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-pak-green/30 bg-pak-green/10 px-3 py-1.5 text-sm font-semibold text-pak-green">
          Admin Portal
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Portal Administration</h1>
        <p className="text-base text-muted-foreground">
          Create, edit, and organize scholarships, grants, and eligibility criteria.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-11 p-1">
          <TabsTrigger value="schemes" className="gap-2 text-sm font-medium">
            <AwardIcon className="size-4" />
            Schemes & Grants
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 text-sm font-medium">
            <LayersIcon className="size-4" />
            Eligibility Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schemes" className="outline-none">
          <AdminSchemes />
        </TabsContent>

        <TabsContent value="categories" className="outline-none">
          <AdminCategories />
        </TabsContent>
      </Tabs>
    </div>
  )
}
