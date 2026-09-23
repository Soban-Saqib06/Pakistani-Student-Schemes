"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import { useCategories, useSchemes } from "@/lib/use-data"
import { formatDate, getDeadlineInfo } from "@/lib/format"
import type { Scheme } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SchemeFormDialog } from "@/components/admin/scheme-form-dialog"

export function AdminSchemes() {
  const { categories } = useCategories()
  const { result, isLoading, mutate } = useSchemes({
    activeOnly: false,
    sortBy: "recent",
    pageNumber: 1,
    pageSize: 100,
  })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Scheme | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Scheme | null>(null)
  const [deleting, setDeleting] = useState(false)

  const schemes = result?.data ?? []

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(scheme: Scheme) {
    setEditing(scheme)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.deleteScheme(deleteTarget.id)
      toast.success("Scheme deleted")
      setDeleteTarget(null)
      void mutate()
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "You need admin access to do that."
          : "Could not delete scheme."
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading schemes…"
            : `${result?.totalCount ?? schemes.length} schemes total`}
        </p>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          Add scheme
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Region</TableHead>
              <TableHead className="hidden lg:table-cell">Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : schemes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No schemes yet. Add your first one.
                </TableCell>
              </TableRow>
            ) : (
              schemes.map((scheme) => {
                const info = getDeadlineInfo(scheme.deadline)
                return (
                  <TableRow key={scheme.id}>
                    <TableCell className="max-w-xs">
                      <div className="truncate font-medium">{scheme.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{scheme.organization}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{scheme.province}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {formatDate(scheme.deadline)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={info.status === "expired" ? "outline" : info.status === "closing" ? "destructive" : "secondary"}>
                        {info.status === "expired" ? "Closed" : info.status === "closing" ? "Closing" : "Open"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => openEdit(scheme)}>
                          <PencilIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete"
                          className="text-destructive"
                          onClick={() => setDeleteTarget(scheme)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <SchemeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        scheme={editing}
        categories={categories}
        onSaved={() => mutate()}
      />

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this scheme?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                void confirmDelete()
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
