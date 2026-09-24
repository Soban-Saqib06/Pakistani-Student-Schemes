"use client"

import { useEffect, useState } from "react"
import { AlertCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { api, ApiError } from "@/lib/api"
import { PROVINCES } from "@/lib/types"
import type { EligibilityCategory, Scheme, SchemeInput } from "@/lib/types"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SchemeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scheme: Scheme | null
  categories: EligibilityCategory[]
  onSaved: () => void
}

interface FormState {
  title: string
  description: string
  organization: string
  province: string
  eligibilityID: string
  deadline: string
  officialUrl: string
  benefits: string
  requiredDocuments: string
}

const emptyForm: FormState = {
  title: "",
  description: "",
  organization: "",
  province: "",
  eligibilityID: "",
  deadline: "",
  officialUrl: "",
  benefits: "",
  requiredDocuments: "",
}

function toDateInput(iso?: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export function SchemeFormDialog({ open, onOpenChange, scheme, categories, onSaved }: SchemeFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(scheme)

  useEffect(() => {
    if (!open) return
    if (scheme) {
      setForm({
        title: scheme.title,
        description: scheme.description,
        organization: scheme.organization,
        province: scheme.province,
        eligibilityID: String(scheme.eligibilityID),
        deadline: toDateInput(scheme.deadline),
        officialUrl: scheme.officialUrl,
        benefits: scheme.benefits,
        requiredDocuments: (scheme.requiredDocuments ?? []).join("\n"),
      })
    } else {
      setForm(emptyForm)
    }
    setError(null)
  }, [open, scheme])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.province || !form.eligibilityID) {
      setError("Please fill in province and eligibility.")
      return
    }

    const payload: SchemeInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      organization: form.organization.trim(),
      province: form.province,
      eligibilityID: Number(form.eligibilityID),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      officialUrl: form.officialUrl.trim(),
      benefits: form.benefits.trim(),
      requiredDocuments: form.requiredDocuments
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    setSubmitting(true)
    try {
      if (scheme) {
        await api.updateScheme(scheme.id, payload)
        toast.success("Scheme updated")
      } else {
        await api.createScheme(payload)
        toast.success("Scheme created")
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "You need admin access to do that."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit scheme" : "Add new scheme"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details of this scheme." : "Create a new scholarship or education scheme."}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive flex items-start gap-2.5">
            <AlertCircleIcon className="size-4 shrink-0 mt-0.5 text-destructive" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        ) : null}

        <form id="scheme-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sf-title">Title</FieldLabel>
              <Input id="sf-title" required value={form.title} onChange={(e) => set("title", e.target.value)} />
            </Field>

            <Field>
              <FieldLabel htmlFor="sf-org">Organization</FieldLabel>
              <Input
                id="sf-org"
                required
                value={form.organization}
                onChange={(e) => set("organization", e.target.value)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sf-province">Province / Region</FieldLabel>
                <Select value={form.province} onValueChange={(v) => set("province", v as string)}>
                  <SelectTrigger id="sf-province" className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="sf-elig">Eligibility</FieldLabel>
                <Select value={form.eligibilityID} onValueChange={(v) => set("eligibilityID", v as string)}>
                  <SelectTrigger id="sf-elig" className="w-full">
                    <SelectValue placeholder="Select category">
                      {(val: string) => categories.find((c) => String(c.id) === val)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="sf-deadline">Deadline</FieldLabel>
                <Input
                  id="sf-deadline"
                  type="date"
                  required
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sf-url">Official URL</FieldLabel>
                <Input
                  id="sf-url"
                  type="url"
                  required
                  placeholder="https://…"
                  value={form.officialUrl}
                  onChange={(e) => set("officialUrl", e.target.value)}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="sf-desc">Description</FieldLabel>
              <Textarea
                id="sf-desc"
                required
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="sf-benefits">Benefits</FieldLabel>
              <Textarea
                id="sf-benefits"
                required
                rows={2}
                value={form.benefits}
                onChange={(e) => set("benefits", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="sf-docs">Required documents</FieldLabel>
              <Textarea
                id="sf-docs"
                rows={3}
                placeholder="One document per line"
                value={form.requiredDocuments}
                onChange={(e) => set("requiredDocuments", e.target.value)}
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="scheme-form" disabled={submitting}>
            {submitting ? <Spinner data-icon="inline-start" /> : null}
            {isEdit ? "Save changes" : "Create scheme"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
