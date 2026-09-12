import "server-only";
import nodemailer from "nodemailer";
import { env, smtpConfigured } from "./env";
import { logger } from "./logger";

export interface MailInput { 
  to: string; 
  subject: string; 
  text: string; 
  html?: string;
  smtpOverride?: { user: string; pass: string };
}

/** ไม่มี SMTP → เขียนลง log ระดับ info แล้วคืน delivered:false — ระบบต้องไม่ล้มเพราะส่งอีเมลไม่ได้ */
export async function sendMail(input: MailInput): Promise<{ delivered: boolean }> {
  const e = env();
  const useOverride = !!(input.smtpOverride?.user && input.smtpOverride?.pass);
  
  if (!useOverride && !smtpConfigured()) {
    logger.info("mail (no SMTP, logged only)", { to: input.to, subject: input.subject, text: input.text });
    return { delivered: false };
  }
  
  try {
    const transport = nodemailer.createTransport({
      host: useOverride ? "smtp.gmail.com" : e.SMTP_HOST,
      port: useOverride ? 587 : e.SMTP_PORT,
      secure: useOverride ? false : e.SMTP_PORT === 465,
      auth: useOverride 
        ? { user: input.smtpOverride!.user, pass: input.smtpOverride!.pass }
        : (e.SMTP_USER ? { user: e.SMTP_USER, pass: e.SMTP_PASS } : undefined),
    });
    const from = useOverride ? input.smtpOverride!.user : e.SMTP_FROM;
    await transport.sendMail({ from, to: input.to, subject: input.subject, text: input.text, html: input.html });
    return { delivered: true };
  } catch (err) {
    logger.error("mail send failed", { to: input.to, err: err instanceof Error ? err.message : String(err) });
    return { delivered: false };
  }
}
