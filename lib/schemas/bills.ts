import { z } from "zod"

export const searchBillsSchema = z.object({
  query: z.string().optional()
    .describe("Text to search for in bills"),
  dateIssuedStartDate: z.string().optional()
    .describe("Start date for bill search (YYYY-MM-DD format)"),
  dateIssuedEndDate: z.string().optional()
    .describe("End date for bill search (YYYY-MM-DD format)"),
  pageSize: z.number().optional()
    .describe("Number of results to return (default: 10)")
})

export const billDetailsSchema = z.object({
  packageId: z
    .string()
    .describe("The GovInfo package ID for the bill"),
})

export const relatedBillsSchema = z.object({
  packageId: z
    .string()
    .describe("The GovInfo package ID to find related bills for"),
})

export const collectionsSchema = z.object({
  congress: z
    .string()
    .optional()
    .describe("Congress number (e.g., '117')"),
  pageSize: z
    .number()
    .optional()
    .default(10)
    .describe("Number of results per page"),
  offsetMark: z
    .string()
    .optional()
    .describe("Pagination offset marker"),
})
