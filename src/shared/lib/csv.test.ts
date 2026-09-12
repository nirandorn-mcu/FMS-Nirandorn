import { describe, it, expect } from "vitest";
import { generateCsv, parseCsv, csvRowsToObjects, escapeCsvCell } from "./csv";

describe("csv utility", () => {
  it("escapeCsvCell properly escapes special characters", () => {
    expect(escapeCsvCell("simple")).toBe("simple");
    expect(escapeCsvCell('with "quote"')).toBe('"with ""quote"""');
    expect(escapeCsvCell("with, comma")).toBe('"with, comma"');
    expect(escapeCsvCell("with\nnewline")).toBe('"with\nnewline"');
    expect(escapeCsvCell(null)).toBe("");
    expect(escapeCsvCell(undefined)).toBe("");
  });

  it("generateCsv includes UTF-8 BOM and correct headers and rows", () => {
    const data = [
      { email: "somchai@mcu.ac.th", name: "สมชาย ใจดี, ดร.", role: "ADMIN" },
      { email: "somying@mcu.ac.th", name: 'สมหญิง "เก่ง"', role: "STUDENT" },
    ];
    const columns = [
      { key: "email", header: "อีเมล" },
      { key: "name", header: "ชื่อ" },
      { key: "role", header: "บทบาท" },
    ];

    const csv = generateCsv(data, columns);
    expect(csv.charCodeAt(0)).toBe(0xfeff); // BOM
    expect(csv).toContain("อีเมล,ชื่อ,บทบาท");
    expect(csv).toContain('somchai@mcu.ac.th,"สมชาย ใจดี, ดร.",ADMIN');
    expect(csv).toContain('somying@mcu.ac.th,"สมหญิง ""เก่ง""",STUDENT');
  });

  it("parseCsv handles BOM, quotes, commas, and newlines", () => {
    const sample = '\uFEFFemail,name,role\r\nsomchai@mcu.ac.th,"สมชาย ใจดี, ดร.",ADMIN\r\nsomying@mcu.ac.th,"ทดสอบ ""คำพูด""",STUDENT';
    const parsed = parseCsv(sample);
    expect(parsed.length).toBe(3);
    expect(parsed[0]).toEqual(["email", "name", "role"]);
    expect(parsed[1]).toEqual(["somchai@mcu.ac.th", "สมชาย ใจดี, ดร.", "ADMIN"]);
    expect(parsed[2]).toEqual(["somying@mcu.ac.th", 'ทดสอบ "คำพูด"', "STUDENT"]);
  });

  it("csvRowsToObjects maps rows correctly", () => {
    const rows = [
      ["Email", "Name", "Role"],
      ["user1@example.com", "User One", "ADMIN"],
      ["user2@example.com", "User Two", "INSTRUCTOR"],
    ];
    const objects = csvRowsToObjects(rows);
    expect(objects).toEqual([
      { email: "user1@example.com", name: "User One", role: "ADMIN" },
      { email: "user2@example.com", name: "User Two", role: "INSTRUCTOR" },
    ]);
  });
});
