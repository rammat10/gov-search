import { tool } from "ai"
import { searchBillsSchema, billDetailsSchema } from "../schemas/bills"
import {
  searchBills,
  getPackageSummary,
  getBillDetails,
} from "../services/govinfo"
import { SearchBillsParams, PackageSummaryParams } from "../types/bills"

export const tools = {
  search_bills: tool({
    description:
      "Search for U.S. government bills and legislation by text query. Data is available from January 1, 2014 onwards.",
    parameters: searchBillsSchema,
    execute: async (args: SearchBillsParams) => {
      console.log("Executing search_bills with args:", args)
      const results = await searchBills(args)
      console.log("search_bills results:", results)
      return results
    },
  }),

  get_bill_summary: tool({
    description: "Get the summary of a specific bill using its package ID.",
    parameters: billDetailsSchema,
    execute: async (args: PackageSummaryParams) => {
      console.log("Executing get_bill_summary with args:", args)
      const summary = await getPackageSummary(args)
      console.log("get_bill_summary result:", summary)
      return summary
    },
  }),

  get_bill_details: tool({
    description:
      "Get detailed information about a specific bill using its package ID.",
    parameters: billDetailsSchema,
    execute: async (args: { packageId: string }) => {
      console.log("Executing get_bill_details with args:", args)
      const details = await getBillDetails(args.packageId)
      console.log("get_bill_details result:", details)
      return details
    },
  }),
}
