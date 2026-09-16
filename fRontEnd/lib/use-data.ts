"use client"

import useSWR from "swr"
import { api } from "./api"
import type { SchemeSearchParams } from "./types"

export function useCategories() {
  const { data, error, isLoading } = useSWR("categories", () => api.listCategories(), {
    revalidateOnFocus: false,
  })
  return { categories: data ?? [], error, isLoading }
}

export function useSchemes(params: SchemeSearchParams) {
  const key = ["schemes", params] as const
  const { data, error, isLoading, mutate } = useSWR(key, ([, p]) => api.searchSchemes(p), {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })
  return { result: data, error, isLoading, mutate }
}

export function useScheme(id: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ["scheme", id] : null,
    ([, schemeId]) => api.getScheme(schemeId),
    { revalidateOnFocus: false },
  )
  return { scheme: data, error, isLoading, mutate }
}
