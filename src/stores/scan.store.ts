import { create } from "zustand"
import { io, Socket } from "socket.io-client"

import { useAuthStore } from "./auth.store"

interface ScanState {
  socket: Socket | null
  isConnected: boolean
  pcStatus: { status: string; location: string } | null
  scannedData: any | null

  connect: () => void
  disconnect: () => void
  sendScanData: (data: any) => void
  updateStatus: (status: string, location: string) => void
  checkStatus: () => void
  clearScannedData: () => void
}

const isMobile = true

export const useScanStore = create<ScanState>((set, get) => ({
  socket: null,
  isConnected: false,
  pcStatus: null,
  scannedData: null,

  connect: () => {
    const token = useAuthStore.getState().token
    const user = useAuthStore.getState().user

    if (!token || !user) return

    // Use relative path through Vite proxy (/api) if no VITE_API_URL is provided.
    // This allows the connection to work over ngrok/local IP since it uses the same host as the frontend.
    const socketUrl = !isMobile ? import.meta.env.VITE_API_URL : window.location.origin
    const socketOptions: any = {
      auth: {
        token: `Bearer ${token}`,
      },
    }

    // If using the same host (relative), we need to specify the path to go through the /api proxy
    if (isMobile) {
      // if (!import.meta.env.VITE_API_URL) {
      socketOptions.path = "/api/socket.io"
    }

    const socket = io(socketUrl, socketOptions)

    // const socket = io(import.meta.env.VITE_API_URL || "http://localhost:7777", {
    //   auth: {
    //     token: `Bearer ${token}`,
    //   },
    // })

    socket.on("connect", () => {
      console.log("WebSocket connected")
      socket.emit("join", { userId: user.id })
      set({ isConnected: true })
    })

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected")
      set({ isConnected: false })
    })

    socket.on("requestStatus", () => {
      // PC responds to status request
      const { updateStatus } = get()
      const currentLocation = window.location.pathname + window.location.search
      updateStatus("ready", currentLocation)
    })

    socket.on("statusUpdated", (data: { status: string; location: string }) => {
      set({ pcStatus: data })
    })

    socket.on("scanDataReceived", (data: any) => {
      set({ scannedData: data })
    })

    set({ socket })
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  sendScanData: (data: any) => {
    const { socket } = get()
    const user = useAuthStore.getState().user
    if (socket && user) {
      socket.emit("scanData", { userId: user.id, scanData: data })
    }
  },

  updateStatus: (status: string, location: string) => {
    const { socket } = get()
    const user = useAuthStore.getState().user
    if (socket && user) {
      socket.emit("statusUpdate", { userId: user.id, status, location })
    }
  },

  checkStatus: () => {
    const { socket } = get()
    const user = useAuthStore.getState().user
    if (socket && user) {
      socket.emit("checkStatus", { userId: user.id })
    }
  },

  clearScannedData: () => {
    set({ scannedData: null })
  },
}))
