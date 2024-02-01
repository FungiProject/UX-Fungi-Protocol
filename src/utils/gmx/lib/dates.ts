import { addMinutes, format as formatDateFn } from "date-fns";

export function formatDateTime(time: number) {
  return formatDateFn(time * 1000, "dd MMM yyyy, h:mm a");
}
