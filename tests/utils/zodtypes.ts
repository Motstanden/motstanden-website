import { z } from "zod";

// Should match
export const dateTimeSchema = z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Must match the date time format: YYYY-MM-DD HH:MM:SS");