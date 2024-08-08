import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const docSearchParamsSchema = z.object({
  source: z
    .object({
      page: z.number(),
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
      documentID: z.string(),
    })
    .optional(),
    scrollToCard: z.object({id: z.string()}).optional(),
});

export const Route = createFileRoute("/collections/documents/$docID")({
  validateSearch: docSearchParamsSchema,
});
