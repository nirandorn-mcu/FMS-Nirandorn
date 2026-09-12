import { LayoutDashboard, Settings, Layers, Banknote, GraduationCap, FolderKanban, FileText, BookOpen, type LucideIcon } from "lucide-react";
import { hasPermission, P } from "@/features/identity";
import { SAMPLE_P } from "@/features/sample";
import { ADVANCE_P } from "@/features/advance-payment";
import { PETITION_P } from "@/features/student-petition";
import { PROJECT_P } from "@/features/project-budget";
import { DOC_P } from "@/features/document-flow";
import { P as CURRICULUM_P } from "@/features/curriculum/permissions";

export interface NavItem {
  /** i18n key */
  title: string;
  href: string;
  icon?: LucideIcon;
  /** ต้องมีสิทธิ์นี้ถึงเห็น — ไม่มี = ทุกคนที่ login เห็น */
  permission?: string;
  children?: NavItem[];
}
export interface NavGroup { label: string; items: NavItem[] }
export interface NavCrumb { title: string; href: string }

export const sidebarGroups: NavGroup[] = [
  { label: "nav.group.overview", items: [{ title: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "doc.nav",
    items: [{ title: "doc.nav", href: "/documents", icon: FileText, permission: DOC_P.docRead }],
  },
  {
    label: "project.nav",
    items: [{ title: "project.nav", href: "/projects", icon: FolderKanban, permission: PROJECT_P.projectRead }],
  },
  {
    label: "petition.nav",
    items: [{ title: "petition.nav", href: "/petitions", icon: GraduationCap, permission: PETITION_P.petitionRead }],
  },
  {
    label: "advance.nav",
    items: [{ title: "advance.nav", href: "/advance-payment", icon: Banknote, permission: ADVANCE_P.advanceRead }],
  },
  {
    label: "nav.group.sample",
    items: [{ title: "sample.nav", href: "/sample", icon: Layers, permission: SAMPLE_P.sampleRead }],
  },
  {
    label: "curriculums.title",
    items: [{ title: "curriculums.title", href: "/curriculums", icon: BookOpen, permission: CURRICULUM_P.curriculumRead }],
  },

  {
    label: "nav.group.settings",
    items: [{
      title: "nav.settings", href: "/settings", icon: Settings,
      children: [
        { title: "nav.settings", href: "/settings", permission: P.settingsManage },
        { title: "nav.users", href: "/users", permission: P.usersRead },
        { title: "nav.roles", href: "/users/roles", permission: P.rolesManage },
      ],
    }],
  },
];

type Ctx = Parameters<typeof hasPermission>[0];

function visibleItem(item: NavItem, ctx: Ctx): NavItem | null {
  if (item.permission && !hasPermission(ctx, item.permission)) return null;
  if (!item.children) return item;
  const children = item.children.filter((c) => !c.permission || hasPermission(ctx, c.permission));
  return children.length ? { ...item, children } : null;
}

export function visibleGroups(ctx: Ctx): NavGroup[] {
  return sidebarGroups
    .map((g) => ({ ...g, items: g.items.map((i) => visibleItem(i, ctx)).filter((i): i is NavItem => i !== null) }))
    .filter((g) => g.items.length > 0);
}

/** สายเมนูสำหรับ breadcrumb — จับ href ที่ยาวที่สุดที่ตรง (ลูกชนะแม่) */
export function getActiveNavChain(pathname: string): NavCrumb[] {
  let best: { parent: NavItem | null; item: NavItem } | null = null;
  const consider = (item: NavItem, parent: NavItem | null) => {
    if (pathname === item.href || pathname.startsWith(item.href + "/")) {
      if (!best || item.href.length > best.item.href.length || (item.href.length === best.item.href.length && parent)) best = { parent, item };
    }
  };
  for (const g of sidebarGroups) for (const i of g.items) { consider(i, null); for (const c of i.children ?? []) consider(c, i); }
  if (!best) return [];
  const { parent, item } = best as { parent: NavItem | null; item: NavItem };
  const chain: NavCrumb[] = [];
  if (parent && parent.href !== item.href) chain.push({ title: parent.title, href: parent.href });
  chain.push({ title: item.title, href: item.href });
  return chain;
}
