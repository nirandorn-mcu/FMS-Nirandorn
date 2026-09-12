import { describe, it, expect } from "vitest";
import { sidebarGroups, getActiveNavChain, visibleGroups } from "./sidebar-nav";

const viewer = { roles: [], permissions: ["users:read"], isSuperAdmin: false };
const admin = { roles: [], permissions: ["users:read", "users:manage", "roles:manage", "settings:manage"], isSuperAdmin: false };

describe("sidebar-nav", () => {
  it("แดชบอร์ดไม่ต้องมีสิทธิ์", () => {
    expect(visibleGroups(viewer).some((g) => g.items.some((i) => i.href === "/dashboard"))).toBe(true);
  });
  it("viewer ไม่เห็นบทบาทและตั้งค่า", () => {
    const subHrefs = visibleGroups(viewer).flatMap((g) =>
      g.items.flatMap((i) => (i.children ? i.children.map((c) => c.href) : [i.href]))
    );
    expect(subHrefs).toContain("/users");
    expect(subHrefs).not.toContain("/users/roles");
    expect(subHrefs).not.toContain("/settings");
  });
  it("admin เห็นครบ และกลุ่มที่ไม่มีรายการเหลือถูกตัด", () => {
    const groups = visibleGroups(admin);
    const allHrefs = groups.flatMap((g) =>
      g.items.flatMap((i) => (i.children ? [i.href, ...i.children.map((c) => c.href)] : [i.href]))
    );
    expect(allHrefs).toEqual(expect.arrayContaining(["/dashboard", "/users", "/settings"]));
    expect(groups.every((g) => g.items.length > 0)).toBe(true);
  });
  it("getActiveNavChain เลือก href ที่ตรงที่สุด", () => {
    expect(getActiveNavChain("/users/roles").map((c) => c.href)).toEqual(["/settings", "/users/roles"]);
    expect(getActiveNavChain("/settings").map((c) => c.href)).toEqual(["/settings"]);
    expect(getActiveNavChain("/nowhere")).toEqual([]);
  });
  it("โครงเมนูมี 8 กลุ่ม", () => expect(sidebarGroups).toHaveLength(8));
});
