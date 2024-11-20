import { tool } from 'ai';
import { searchBillsSchema, billDetailsSchema, relatedBillsSchema } from '../schemas/bills';
import { 
    searchBills, 
    getPackageSummary, 
    getBillDetails, 
    getRelatedBills
} from '../services/govinfo';

export const tools = {
    search_bills: tool({
        description: "Search for U.S. government bills and legislation by text query. Data is available from January 1, 2014 onwards.",
        parameters: searchBillsSchema,
        execute: async (args) => {
            // console.log("search_bills", args);
            const results = await searchBills(args);
            // console.log("search_bills results", results);
            return results;
        },
    }),

    get_bill_summary: tool({
        description: "Get the summary of a specific bill using its package ID.",
        parameters: billDetailsSchema,
        execute: async (args) => {
            const summary = await getPackageSummary(args);
            return summary;
        },
    }),

    get_bill_details: tool({
        description: "Get detailed information about a specific bill using its package ID.",
        parameters: billDetailsSchema,
        execute: async (args) => {
            const details = await getBillDetails(args.packageId);
            return details;
        },
    }),

    get_related_bills: tool({
        description: "Find bills related to a specific bill using its package ID.",
        parameters: relatedBillsSchema,
        execute: async (args) => {
            const related = await getRelatedBills(args.packageId);
            return related;
        },
    }),
};