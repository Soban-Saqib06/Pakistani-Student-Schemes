"use client"

import { useState } from "react"
import { UserCircle2Icon } from "lucide-react"
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
      </DialogContent>
    </Dialog>
  )
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEmailError(null)

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!isEmailValid) {
      setEmailError("Please enter a valid email address.")
      return
    }

    setSubmitting(true)
    try {
      await login(email.trim(), password)
      toast.success("Logged in successfully")
      onDone()
    } catch (err) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Login failed"
      if (msg.toLowerCase().includes("email") && !msg.toLowerCase().includes("password")) {
        setEmailError(msg)
      } else {
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const hasEmailIssue = Boolean(emailError || error)
  const hasPasswordIssue = Boolean(error)

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={hasEmailIssue ? "true" : undefined}>
          <FieldLabel htmlFor="login-email" className="text-sm font-medium">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(null)
              setError(null)
            }}
            placeholder="you@example.com"
            aria-invalid={hasEmailIssue ? true : undefined}
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
          {emailError ? <FieldError>{emailError}</FieldError> : null}
        </Field>
        <Field data-invalid={hasPasswordIssue ? "true" : undefined}>
          <FieldLabel htmlFor="login-password" className="text-sm font-medium">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            aria-invalid={hasPasswordIssue ? true : undefined}
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
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEmailError(null)
    setPasswordError(null)

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!isEmailValid) {
      setEmailError("Please enter a valid email address.")
      return
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.")
      return
    }

    setSubmitting(true)
    try {
      await register(name.trim(), email.trim(), password)
      toast.success("Account created. You're all set!")
      onDone()
    } catch (err) {
      const msg = err instanceof ApiError || err instanceof Error ? err.message : "Registration failed"
      if (msg.toLowerCase().includes("email")) {
        setEmailError(msg)
      } else if (msg.toLowerCase().includes("password")) {
        setPasswordError(msg)
      } else {
        setError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
        <Field data-invalid={emailError ? "true" : undefined}>
          <FieldLabel htmlFor="reg-email" className="text-sm font-medium">Email</FieldLabel>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(null)
            }}
            placeholder="you@example.com"
            aria-invalid={emailError ? true : undefined}
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
          {emailError ? <FieldError>{emailError}</FieldError> : null}
        </Field>
        <Field data-invalid={(passwordError || error) ? "true" : undefined}>
          <FieldLabel htmlFor="reg-password" className="text-sm font-medium">Password</FieldLabel>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(null)
              setError(null)
            }}
            aria-invalid={(passwordError || error) ? true : undefined}
            className="h-10 text-sm transition-all focus-visible:border-pak-green focus-visible:ring-2 focus-visible:ring-pak-green/20"
          />
          {passwordError ? <FieldError>{passwordError}</FieldError> : null}
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
