"use client"

import { useState } from "react"
import { ShieldCheckIcon, UserCircle2Icon } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/lib/auth-context"
import { useAuthModal } from "@/lib/auth-modal-context"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthDialog() {
  const { open, mode, setOpen, setMode } = useAuthModal()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <span className="mb-1 flex size-12 items-center justify-center rounded-md bg-pak-green/10 text-pak-green ring-1 ring-pak-green/20">
            <UserCircle2Icon className="size-6" />
          </span>
          <DialogTitle className="text-xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "login"
              ? "Log in to save schemes and track deadlines."
              : "Sign up to bookmark scholarships and get organised."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "register")}>
          <TabsList className="w-full">
            <TabsTrigger value="login">Log in</TabsTrigger>
            <TabsTrigger value="register">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pt-4">
            <LoginForm onDone={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="register" className="pt-4">
            <RegisterForm onDone={() => setOpen(false)} />
          </TabsContent>
        </Tabs>

        <div className="rounded-md border border-pak-green/25 bg-pak-green/[0.04] px-3.5 py-2.5 text-center text-xs text-muted-foreground">
          <div className="font-semibold text-pak-green mb-0.5 flex items-center justify-center gap-1">
            <ShieldCheckIcon className="size-3.5" /> Demo Credentials
          </div>
          Admin: <span className="font-medium text-foreground">admin@schemes.pk / admin123</span>
          <br />
          Student: <span className="font-medium text-foreground">student@example.com / student123</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success("Logged in successfully")
      onDone()
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={error ? "true" : undefined}>
          <FieldLabel htmlFor="login-email" className="text-sm font-medium">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
        </Field>
        <Field data-invalid={error ? "true" : undefined}>
          <FieldLabel htmlFor="login-password" className="text-sm font-medium">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-1 h-11 bg-pak-green font-semibold text-white shadow-xs hover:bg-pak-green/90 cursor-pointer transition-colors"
        >
          {submitting ? <Spinner data-icon="inline-start" /> : null}
          Log in
        </Button>
      </FieldGroup>
    </form>
  )
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setSubmitting(true)
    try {
      await register(name, email, password)
      toast.success("Account created. You're all set!")
      onDone()
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="reg-name" className="text-sm font-medium">Full name</FieldLabel>
          <Input
            id="reg-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ayesha Khan"
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="reg-email" className="text-sm font-medium">Email</FieldLabel>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
        </Field>
        <Field data-invalid={error ? "true" : undefined}>
          <FieldLabel htmlFor="reg-password" className="text-sm font-medium">Password</FieldLabel>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-1 h-11 bg-pak-green font-semibold text-white shadow-xs hover:bg-pak-green/90 cursor-pointer transition-colors"
        >
          {submitting ? <Spinner data-icon="inline-start" /> : null}
          Create account
        </Button>
      </FieldGroup>
    </form>
  )
}
