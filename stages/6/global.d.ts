import type { Component as QC, HTMLAttributes as QH } from "@builder.io/qwik"

declare global {
  export type Component<T> = QC<T>
  export type HTMLAttributes<T> = QH<T>
}