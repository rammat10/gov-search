import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

const model = openai("gpt-4o-mini");

// Define the functions that OpenAI can call
const functions = [
	{
		name: "search_bills",
		description: "Search for recent bills and legislation in Congress",
		parameters: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "The search topic (e.g., 'climate change', 'healthcare reform')"
				},
				dateIssuedStartDate: {
					type: "string",
					description: "Start date in YYYY-MM-DD format. Defaults to 1 year ago"
				},
				dateIssuedEndDate: {
					type: "string",
					description: "End date in YYYY-MM-DD format. Defaults to today"
				},
				pageSize: {
					type: "number",
					description: "Number of results to return (max 100)",
					default: 10
				}
			},
			required: ["query"]
		}
	},
	{
		name: "get_package_summary",
		description: "Get detailed information about a specific government document package",
		parameters: {
			type: "object",
			properties: {
				packageId: {
					type: "string",
					description: "The GovInfo package ID"
				}
			},
			required: ["packageId"]
		}
	}
];

// Function implementations
async function searchBills(params: any) {
	// Calculate default dates if not provided
	const today = new Date();
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(today.getFullYear() - 1);

	const startDate = params.dateIssuedStartDate || oneYearAgo.toISOString().split('T')[0];
	const endDate = params.dateIssuedEndDate || today.toISOString().split('T')[0];

	const response = await fetch(
		'https://api.govinfo.gov/search',
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Api-Key': process.env.GOV_INFO_API_KEY || ''
			},
			body: JSON.stringify({
				query: `collection:(BILLS) AND ${params.query}`,
				pageSize: params.pageSize || 10,
				offsetMark: '*',
				sorts: [
					{
						field: 'publishdate',
						sortOrder: 'DESC'
					}
				],
				filters: {
					dateIssuedRange: {
						start: startDate,
						end: endDate
					}
				}
			})
		}
	);

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	const data = await response.json();
	
	// Format the results to be more readable
	return {
		count: data.count,
		bills: data.packages.map((pkg: any) => ({
			title: pkg.title,
			congress: pkg.congress,
			dateIssued: pkg.dateIssued,
			packageId: pkg.packageId,
			billNumber: pkg.billNumber,
			billType: pkg.billType,
			url: `https://www.govinfo.gov/app/details/${pkg.packageId}`
		}))
	};
}

async function getPackageSummary(params: any) {
	const response = await fetch(
		`https://api.govinfo.gov/packages/${params.packageId}/summary`,
		{
			headers: {
				'Accept': 'application/json',
				'X-Api-Key': process.env.GOV_INFO_API_KEY || ''
			}
		}
	);

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	return await response.json();
}

export async function POST(req: Request) {
	const { messages } = await req.json();
	const userMessage = messages[messages.length - 1].content;

	try {
		const result = streamText({
			model,
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant that searches for U.S. government bills and legislation. " +
						"When users ask about bills or legislation, ALWAYS use the search_bills function to find relevant information. " +
						"Format the results in a clear, readable way."
				},
				...messages
			],
			functions,
			// Force the model to use the search_bills function for queries about bills
			function_call: {
				name: "search_bills",
				arguments: JSON.stringify({
					query: userMessage,
					pageSize: 5
				})
			},
			async onFunctionCall({ name, arguments: args }) {
				if (name === 'search_bills') {
					const searchResults = await searchBills(args);
					return `Here are the most recent bills I found:\n\n${
						searchResults.bills.map((bill: any) => 
							`- ${bill.title}\n  Congress: ${bill.congress}\n  Date: ${bill.dateIssued}\n  Link: ${bill.url}\n`
						).join('\n')
					}`;
				}
				else if (name === 'get_package_summary') {
					const packageSummary = await getPackageSummary(args);
					return `Here is the package information: ${JSON.stringify(packageSummary, null, 2)}`;
				}
				throw new Error(`Unknown function: ${name}`);
			}
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error('Error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch government data' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
