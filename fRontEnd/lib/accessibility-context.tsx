"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type FontScale = "normal" | "large" | "xlarge"

interface AccessibilityContextType {
  fontScale: FontScale
  setFontScale: (scale: FontScale) => void
  dyslexiaMode: boolean
  setDyslexiaMode: (enabled: boolean) => void
  toggleDyslexiaMode: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScaleState] = useState<FontScale>("normal")
  const [dyslexiaMode, setDyslexiaModeState] = useState<boolean>(false)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedScale = localStorage.getItem("taleemhub_font_scale") as FontScale | null
      if (savedScale && ["normal", "large", "xlarge"].includes(savedScale)) {
        setFontScaleState(savedScale)
        applyFontScale(savedScale)
      }

      const savedDyslexia = localStorage.getItem("taleemhub_dyslexia")
      if (savedDyslexia === "true") {
        setDyslexiaModeState(true)
        applyDyslexia(true)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  function applyFontScale(scale: FontScale) {
    if (typeof document === "undefined") return
    if (scale === "normal") {
      document.documentElement.removeAttribute("data-font-scale")
    } else {
      document.documentElement.setAttribute("data-font-scale", scale)
    }
  }

  function applyDyslexia(enabled: boolean) {
    if (typeof document === "undefined") return
    if (enabled) {
      document.documentElement.setAttribute("data-dyslexia", "true")
    } else {
      document.documentElement.removeAttribute("data-dyslexia")
    }
  }

  function setFontScale(scale: FontScale) {
    setFontScaleState(scale)
    applyFontScale(scale)
    try {
      localStorage.setItem("taleemhub_font_scale", scale)
    } catch {
      // Ignore
    }
  }

  function setDyslexiaMode(enabled: boolean) {
    setDyslexiaModeState(enabled)
    applyDyslexia(enabled)
    try {
      localStorage.setItem("taleemhub_dyslexia", enabled ? "true" : "false")
    } catch {
      // Ignore
    }
  }

  function toggleDyslexiaMode() {
    setDyslexiaMode(!dyslexiaMode)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        setFontScale,
        dyslexiaMode,
        setDyslexiaMode,
        toggleDyslexiaMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
