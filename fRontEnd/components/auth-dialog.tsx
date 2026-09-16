"use client"

import { useState } from "react"
import { GraduationCapIcon } from "lucide-react"
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
          <span className="mb-1 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCapIcon className="size-6" />
          </span>
          <DialogTitle>{mode === "login" ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription>
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

        <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
          Demo accounts &mdash; Admin: <span className="font-medium text-foreground">admin@schemes.pk / admin123</span>
          <br />
          Student: <span className="font-medium text-foreground">student@example.com / student123</span>
        </p>
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
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field data-invalid={error ? "true" : undefined}>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Button type="submit" size="lg" disabled={submitting}>
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
          <FieldLabel htmlFor="reg-name">Full name</FieldLabel>
          <Input
            id="reg-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ayesha Khan"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="reg-email">Email</FieldLabel>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field data-invalid={error ? "true" : undefined}>
          <FieldLabel htmlFor="reg-password">Password</FieldLabel>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
          />
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? <Spinner data-icon="inline-start" /> : null}
          Create account
        </Button>
      </FieldGroup>
    </form>
  )
}
