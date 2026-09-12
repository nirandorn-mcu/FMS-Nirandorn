import { create } from "zustand";

export interface TenantInfoState {
  nameTh: string;
  nameEn: string;
  logoUrl: string | null;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactOfficeHours?: string;
  quickExtEdu?: string;
  quickExtFinance?: string;
  quickExtPlan?: string;
  contactFacebook?: string;
  contactLine?: string;
  contactWebsite?: string;
  loaded: boolean;
  setTenantInfo: (info: Partial<TenantInfoState>) => void;
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
