export type AttendanceRegisterRow = {
  id?: number;
  projectId: number;
  attendanceDate: string | Date;
  checkIn?: string | null;
  checkOut?: string | null;
  employeeName?: string | null;
  stageId?: number | null;
  status?: string | null;
  notes?: string | null;
};

export function filterAttendanceByMonth(rows: AttendanceRegisterRow[], projectId: number | undefined, month: number, year: number) {
  return rows.filter((row) => {
    if (projectId !== undefined && row.projectId !== projectId) return false;
    const date = String(row.attendanceDate).slice(0, 10);
    return date.startsWith(`${year}-${String(month).padStart(2, "0")}`);
  });
}

export function calculateAttendanceHours(checkIn?: string | null, checkOut?: string | null) {
  if (!checkIn || !checkOut) return null;
  const [inHour, inMinute] = checkIn.split(":").map(Number);
  const [outHour, outMinute] = checkOut.split(":").map(Number);
  const minutes = outHour * 60 + outMinute - (inHour * 60 + inMinute);
  return minutes > 0 ? Number((minutes / 60).toFixed(1)) : null;
}
