import { create } from "zustand";

export interface TenantInfoState {
  nameTh: string;
  nameEn: string;
  logoUrl: string | null;
  loaded: boolean;
  setTenantInfo: (info: { nameTh?: string; nameEn?: string; logoUrl?: string | null }) => void;
}

export const useTenantStore = create<TenantInfoState>((set) => ({
  nameTh: "",
  nameEn: "",
  logoUrl: null,
  loaded: false,
  setTenantInfo: (info) =>
    set((state) => ({
      ...state,
      ...info,
      loaded: true,
    })),
}));
