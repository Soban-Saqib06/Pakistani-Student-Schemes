"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { useCategories } from "@/lib/use-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CategoryFormDialog } from "@/components/admin/category-form-dialog"

export function AdminCategories() {
  const { categories, isLoading, mutate } = useCategories()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Eligibility Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage educational categories students filter by.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <PlusIcon className="size-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-64">Category Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  No categories found. Click "Add Category" to create one.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{c.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.description}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={() => void mutate()}
      />
    </div>
  )
}
