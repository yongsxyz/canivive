
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  createdAt: number
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  CLEAR_ALL_TOASTS: "CLEAR_ALL_TOASTS",
  PROCESS_TOAST_QUEUE: "PROCESS_TOAST_QUEUE",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: Omit<ToasterToast, "createdAt">
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["CLEAR_ALL_TOASTS"]
    }
  | {
      type: ActionType["PROCESS_TOAST_QUEUE"]
    }

interface State {
  toasts: ToasterToast[]
  queue: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string, duration: number = TOAST_REMOVE_DELAY) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, duration)

  toastTimeouts.set(toastId, timeout)
}

const processQueue = () => {
  setTimeout(() => {
    dispatch({ type: "PROCESS_TOAST_QUEUE" })
  }, 100)
}

// Clear all timeouts to prevent memory leaks
const clearAllTimeouts = () => {
  toastTimeouts.forEach((timeout) => {
    clearTimeout(timeout)
  })
  toastTimeouts.clear()
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      const now = Date.now()
      if (state.toasts.length === 0) {
        const newToast = { ...action.toast, createdAt: now } as ToasterToast
        addToRemoveQueue(newToast.id, newToast.duration)
        return {
          ...state,
          toasts: [newToast],
          queue: [...state.queue]
        }
      } else {
        return {
          ...state,
          queue: [...state.queue, { ...action.toast, createdAt: now } as ToasterToast]
        }
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
        queue: state.queue.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        // If no toastId is provided, dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, 100) // Use a shorter timeout for mass dismissal
        })
        state.queue.forEach((toast) => {
          addToRemoveQueue(toast.id, 100)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        if (state.queue.length > 0) {
          const [nextToast, ...remainingQueue] = state.queue
          addToRemoveQueue(nextToast.id, nextToast.duration)
          return {
            toasts: [{ ...nextToast, open: true }],
            queue: remainingQueue
          }
        }
        return {
          ...state,
          toasts: [],
          queue: []
        }
      }
      
      // Remove specific toast and show next in queue if available
      const newToasts = state.toasts.filter((t) => t.id !== action.toastId)
      
      if (newToasts.length === 0 && state.queue.length > 0) {
        const [nextToast, ...remainingQueue] = state.queue
        addToRemoveQueue(nextToast.id, nextToast.duration)
        return {
          toasts: [{ ...nextToast, open: true }],
          queue: remainingQueue
        }
      }
      
      return {
        ...state,
        toasts: newToasts,
        queue: state.queue.filter((t) => t.id !== action.toastId),
      }
    
    case "CLEAR_ALL_TOASTS": {
      // Clear all timeouts
      clearAllTimeouts()
      
      return {
        toasts: [],
        queue: []
      }
    }

    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [], queue: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Type that consumers of toast will use without createdAt
type Toast = Omit<ToasterToast, "id" | "createdAt">

function toast({ ...props }: Toast) {
  const id = genId()
  const duration = props.duration ?? TOAST_REMOVE_DELAY

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      duration,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

// Add dismiss function to toast directly
toast.dismiss = (toastId?: string) => {
  dispatch({ type: toastId ? "DISMISS_TOAST" : "CLEAR_ALL_TOASTS", ...(toastId ? { toastId } : {}) })
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (!toastId) {
        // If no toastId is provided, clear all toasts
        dispatch({ type: "CLEAR_ALL_TOASTS" })
      } else {
        dispatch({ type: "DISMISS_TOAST", toastId })
      }
    },
  }
}

export { useToast, toast }
