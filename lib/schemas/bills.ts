import { z } from "zod"

export const searchBillsSchema = z.object({
  query: z.string()
    .describe("Text to search for in bills (required)"),
  dateIssuedStartDate: z.string()
    .optional()
    .describe("Start date in YYYY-MM-DD format. Must be 2014-01-01 or later. Defaults to 2014-01-01."),
  dateIssuedEndDate: z.string()
    .optional()
    .describe("End date in YYYY-MM-DD format. Defaults to today."),
  pageSize: z.number()
    .optional()
    .default(10)
    .describe("Number of results to return (default: 10)")
})

export const billDetailsSchema = z.object({
  packageId: z
    .string()
    .describe("The GovInfo package ID for the bill"),
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
