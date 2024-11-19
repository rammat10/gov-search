import { tool } from 'ai';
import { searchBillsSchema, billDetailsSchema, relatedBillsSchema, collectionsSchema } from '../schemas/bills';
import { 
    searchBills, 
    getPackageSummary, 
    getBillDetails, 
    getRelatedBills, 
    getCollections,
    getPublishedPackages
} from '../services/govinfo';

export const tools = {
    search_bills: tool({
        description: "Search for U.S. government bills and legislation by text query. For date-based searches, use get_bills_by_date.",
        parameters: searchBillsSchema.omit({ dateIssuedStartDate: true, dateIssuedEndDate: true }),
        execute: async (args) => {
            console.log("search_bills", args);
            const results = await searchBills(args);
            console.log("search_bills results", results);
            return results;
        },
    }),

    get_bills_by_date: tool({
        description: "Get U.S. government bills and legislation by date range (from 1994 onwards).",
        parameters: searchBillsSchema.omit({ query: true }),
        execute: async (args) => {
            console.log("get_bills_by_date", args);
            const publishedResults = await getPublishedPackages({
                startDate: args.dateIssuedStartDate,
                endDate: args.dateIssuedEndDate,
                collection: 'BILLS',
                pageSize: args.pageSize || 10
            });
            console.log("get_bills_by_date results", publishedResults);
            return {
                count: publishedResults.count,
                bills: publishedResults.packages.map((bill: any) => ({
                    title: bill.title || "Untitled",
                    congress: bill.congress || "Unknown",
                    dateIssued: bill.dateIssued || "Date unknown",
                    packageId: bill.packageId,
                    billNumber: bill.packageId.split('-')[1].match(/\d+(?=[a-z]*$)/)?.[0] || "",
                    billType: bill.packageId.split('-')[1].match(/[a-z]+(?=\d)/i)?.[0] || "",
                    version: bill.packageId.split('-')[1].match(/[a-z]+$/)?.[0] || "",
                    url: `https://www.govinfo.gov/app/details/${bill.packageId}`,
                    summary: bill.packageLink || ""
                }))
            };
        },
    }),

    get_bill_details: tool({
        description: "Get detailed information about a specific bill",
        parameters: billDetailsSchema,
        execute: async (args) => {
            const details = await getBillDetails(args.packageId);
            return details;
        },
    }),
    get_related_bills: tool({
        description: "Find bills related to a specific bill",
        parameters: relatedBillsSchema,
        execute: async (args) => {
            const related = await getRelatedBills(args.packageId);
            return related;
        },
    }),
    get_collections: tool({
        description: "Get collections of government documents",
        parameters: collectionsSchema,
        execute: async (args) => {
            const collections = await getCollections();
            return collections;
        },
    }),
    get_package_summary: tool({
        description: "Get a summary of a U.S. government bill or legislation",
        parameters: billDetailsSchema,
        execute: async (args) => {
            const summary = await getPackageSummary(args);
            return summary;
        },
    }),
}; 