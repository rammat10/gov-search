import { streamText, tool, convertToCoreMessages } from 'ai'
import { z } from 'zod';
import { headers } from 'next/headers';
import { openai } from '@ai-sdk/openai';
import { rateLimit } from '@/lib/rate-limiter';

const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL || 'gpt-4o-mini';

interface SearchBillsParams {
	query: string;
	dateIssuedStartDate?: string;
	dateIssuedEndDate?: string;
	pageSize?: number;
}

interface PackageSummaryParams {
	packageId: string;
}

async function searchBills(params: SearchBillsParams) {
	console.log('searchBills', params);
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
	console.log('searchBills raw response data:', data);

	// Handle case where no results are found
	if (!data.count || !data.results) {
		return {
			count: 0,
			bills: []
		};
	}

	try {
		return {
			count: data.count,
			bills: data.results.map((bill: any) => {
				// Example packageId: BILLS-118hr10150ih
				const parts = bill.packageId.split('-');
				const congressPart = parts[1]; // 118hr10150ih
				
				// Extract congress number (118)
				const congress = congressPart.match(/^\d+/)?.[0] || 'Unknown';
				
				// Extract bill type (hr, s, hres, etc.)
				const billType = congressPart.match(/[a-z]+(?=\d)/i)?.[0] || '';
				
				// Extract bill number (10150)
				const billNumber = congressPart.match(/\d+(?=[a-z]*$)/)?.[0] || '';
				
				// Extract version (ih, rfs, etc.)
				const version = congressPart.match(/[a-z]+$/)?.[0] || '';

				return {
					title: bill.title || 'Untitled',
					congress: congress,
					dateIssued: bill.dateIssued || 'Date unknown',
					packageId: bill.packageId || '',
					billNumber: billNumber,
					billType: billType,
					version: version,
					url: `https://www.govinfo.gov/app/details/${bill.packageId}`,
					summary: bill.resultLink || ''
				};
			})
		};
	} catch (error) {
		console.error('Error processing search results:', error);
		console.error('Raw data:', data);
		throw new Error('Failed to process search results');
	}
}

async function getPackageSummary(params: PackageSummaryParams) {
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

const searchBillsSchema = z.object({
	query: z.string().describe("The search topic (e.g., 'climate change', 'healthcare reform')"),
	dateIssuedStartDate: z.string().optional().describe("Start date in YYYY-MM-DD format. Defaults to 1 year ago"),
	dateIssuedEndDate: z.string().optional().describe("End date in YYYY-MM-DD format. Defaults to today"),
	pageSize: z.number().optional().default(10).describe("Number of results to return (max 100)")
});

const tools = {
	search_bills: tool({
		description: 'Search for U.S. government bills and legislation',
		parameters: searchBillsSchema,
		execute: async (args) => {
			console.log('search_bills', args);
			const results = await searchBills(args);
			console.log('search_bills results', results);
			return results;
		}
	}),
	get_package_summary: tool({
		description: 'Get a summary of a U.S. government bill or legislation',
		parameters: z.object({
			packageId: z.string().describe("The GovInfo package ID")
		}),
		execute: async (args) => {
			const summary = await getPackageSummary(args);
			return summary;
		}
	})
};

export async function POST(req: Request) {
	try {
		// Get IP address for rate limiting
		const headersList = await headers();
		const ip = headersList.get('x-forwarded-for') ?? 'anonymous';

		// Rate limit by IP
		const rateLimitResult = await rateLimit(ip);

		if (!rateLimitResult.success) {
			return new Response(
				JSON.stringify({
					error: 'Too many requests',
					limit: rateLimitResult.limit,
					remaining: rateLimitResult.remaining,
				}),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'X-RateLimit-Limit': rateLimitResult.limit.toString(),
						'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
						'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
					},
				}
			);
		}

		const { messages } = await req.json();
		console.log('Received messages:', messages);  // Log incoming messages
		
		const model = openai(OPENAI_API_MODEL);
		console.log('Using model:', OPENAI_API_MODEL);  // Log which model we're using

		const result = await streamText({
			experimental_toolCallStreaming: true,
			model,
	      system: `\
        - you are a friendly government bills and legislation assistant
        - your responses are concise and conversational
        - when users ask about bills, immediately use the search_bills function
        - present results in a natural, flowing way
        - always mention the total number of results found
        - for each bill, include: title, bill number, congress, date, and URL
        - briefly explain what the bills represent
        - ask if they'd like more details about any specific bill
      `,
      messages: convertToCoreMessages(messages),
			tools,
			maxSteps: 5,
			temperature: 0.7,
		});

		return result.toDataStreamResponse();

	} catch (error) {
		console.error('Detailed error:', {
			name: error.name,
			message: error.message,
			stack: error.stack,
		});
		console.error('Error:', error);
		return new Response(
			JSON.stringify({ 
				error: 'Failed to fetch government data',
				details: error instanceof Error ? error.message : 'Unknown error'
			}), 
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
