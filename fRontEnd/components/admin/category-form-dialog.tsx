"use client"

import { useState } from "react"
import { toast } from "sonner"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function CategoryFormDialog({ open, onOpenChange, onSaved }: CategoryFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function reset() {
    setName("")
    setDescription("")
    setErrors({})
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "Category name is required"
    if (!description.trim()) errs.description = "Category description is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await api.createCategory({
        name: name.trim(),
        description: description.trim(),
      })
      toast.success("Eligibility category created successfully")
      reset()
      onSaved()
      onOpenChange(false)
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        toast.error("Failed to create category")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Eligibility Category</DialogTitle>
            <DialogDescription>
              Create a new eligibility category (e.g. Undergraduate, Need-Based, PhD).
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="cat-name">Category Name</FieldLabel>
                <Input
                  id="cat-name"
                  placeholder="e.g. Undergraduate STEM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name ? <FieldError>{errors.name}</FieldError> : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="cat-desc">Description</FieldLabel>
                <Textarea
                  id="cat-desc"
                  rows={3}
                  placeholder="Briefly describe the criteria for this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description ? <FieldError>{errors.description}</FieldError> : null}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner data-icon="inline-start" /> : null}
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
