import type { Dictionary } from "@/shared/lib/i18n/translate";
import { MESSAGES as core } from "./messages/core";
import { MESSAGES as identity } from "@/features/identity/messages";
import { MESSAGES as sample } from "@/features/sample/messages";
import { MESSAGES as advancePayment } from "@/features/advance-payment/messages";
import { MESSAGES as studentPetition } from "@/features/student-petition/messages";
import { MESSAGES as projectBudget } from "@/features/project-budget/messages";

/** พจนานุกรม UI ทั้งระบบ — feature ใหม่เพิ่มบรรทัด import ที่นี่ · key ต้องไม่ซ้ำข้าม feature */
export const UI_MESSAGES: Dictionary = { ...core, ...identity, ...sample, ...advancePayment, ...studentPetition, ...projectBudget };
