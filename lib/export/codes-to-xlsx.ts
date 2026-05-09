type AnyRecord = Record<string, unknown>;

function formatDate(value: unknown): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function safeString(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

export async function downloadCodesXlsx(opts: {
  filename: string;
  sheetName?: string;
  rows: AnyRecord[];
}): Promise<void> {
  const { filename, sheetName = "Codes", rows } = opts;

  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename, { compression: true });
}

export function mapAdminCodesToRows(codes: AnyRecord[]): AnyRecord[] {
  return codes.map((c) => {
    const course = (c.course ?? {}) as AnyRecord;
    const creator = (c.creator ?? {}) as AnyRecord;
    const user = (c.user ?? null) as AnyRecord | null;

    return {
      code: safeString(c.code),
      courseTitle: safeString(course.title),
      isUsed: Boolean(c.isUsed) ? "YES" : "NO",
      usedAt: formatDate(c.usedAt),
      createdAt: formatDate(c.createdAt),
      createdByName: safeString(creator.fullName),
      createdByPhone: safeString(creator.phoneNumber),
      usedByName: safeString(user?.fullName),
      usedByPhone: safeString(user?.phoneNumber),
    };
  });
}

export function mapTeacherCodesToRows(codes: AnyRecord[]): AnyRecord[] {
  return codes.map((c) => {
    const course = (c.course ?? {}) as AnyRecord;
    const user = (c.user ?? null) as AnyRecord | null;

    return {
      code: safeString(c.code),
      courseTitle: safeString(course.title),
      isUsed: Boolean(c.isUsed) ? "YES" : "NO",
      usedAt: formatDate(c.usedAt),
      createdAt: formatDate(c.createdAt),
      usedByName: safeString(user?.fullName),
      usedByPhone: safeString(user?.phoneNumber),
    };
  });
}

