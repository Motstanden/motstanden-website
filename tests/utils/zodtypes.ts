import { z } from "zod";

// Should match
export const dateTimeSchema = z.string().pipe(z.coerce.date());