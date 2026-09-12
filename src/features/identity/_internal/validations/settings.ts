import { z } from "zod";
import { PALETTE_IDS } from "@/shared/lib/palette";

export const updateSettingsSchema = z.object({
  nameTh: z.string().trim().min(1).max(255),
  nameEn: z.string().trim().min(1).max(255),
  logoUrl: z.string().trim().max(500).refine((val) => {
    if (!val) return true;
    if (val.startsWith("/")) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "URL โลโก้ไม่ถูกต้อง" }).default(""),
  palette: z.enum(PALETTE_IDS),
  smtpEmail: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }).optional().or(z.literal("")),
  smtpPassword: z.string().optional().or(z.literal("")),
  contactAddress: z.string().trim().max(1000).optional().or(z.literal("")),
  contactPhone: z.string().trim().max(100).optional().or(z.literal("")),
  contactEmail: z.string().trim().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }).optional().or(z.literal("")),
  contactOfficeHours: z.string().trim().max(255).optional().or(z.literal("")),
  quickExtEdu: z.string().trim().max(100).optional().or(z.literal("")),
  quickExtFinance: z.string().trim().max(100).optional().or(z.literal("")),
  quickExtPlan: z.string().trim().max(100).optional().or(z.literal("")),
  contactFacebook: z.string().trim().max(255).optional().or(z.literal("")),
  contactLine: z.string().trim().max(100).optional().or(z.literal("")),
  contactWebsite: z.string().trim().max(255).optional().or(z.literal("")),
});
export const updateProfileSchema = z.object({ name: z.string().trim().min(1).max(255), locale: z.enum(["th", "en"]) });
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
