import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { PharmacyType } from "@/types/pharmacy.types"

interface PharmacyState {
  pharmacy: PharmacyType | null
}

export const usePharmacyStore = create<PharmacyState>()(
  persist(
    (set) => ({
      pharmacy: null,
      setPharmacy: ({ pharmacy }) => set({ pharmacy }),

      clearPharmacy: () =>
        set({
          pharmacy: null,
        }),
    }),
    {
      name: "pharmacy-storage",
      // partialize: (state) => ({ token: state.token }), // Only persist token
    },
  ),
)
