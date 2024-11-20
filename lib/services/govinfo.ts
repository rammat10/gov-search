import { PackageSummaryParams, SearchBillsParams} from "../types/bills";
import { search } from '@/lib/search';

// Add this interface near the top of the file
interface BillMember {
    role: string;
    memberName: string;
    state: string;
    party: string;
}

export async function searchBills(params: SearchBillsParams) {
    console.log("searchBills", params);

    if (!params.query) {
        throw new Error("The 'query' parameter is required.");
    }

    try {
        // Default dates if not provided
        const today = new Date();
        const defaultStartDate = '2014-01-01'; // Data starts from 2014
        const defaultEndDate = today.toISOString().split('T')[0];

        const startDate = params.dateIssuedStartDate || defaultStartDate;
        const endDate = params.dateIssuedEndDate || defaultEndDate;

        // Validate date range
        if (new Date(startDate) < new Date('2014-01-01')) {
            throw new Error("Data is only available from January 1, 2014 onwards.");
        }

				console.log("Searching for bills with queryxxx:", params.query, "from", startDate, "to", endDate);
        const results = await search(params.query, startDate, endDate);
				console.log("searchBills results", results);
        return {
            count: results.length,
            bills: results.map(bill => ({
                title: bill.title,
                congress: bill.congress,
                dateIssued: bill.date_issued,
                packageId: bill.package_id,
                billNumber: bill.package_id.split('-')[1].match(/\d+(?=[a-z]*$)/)?.[0] || "",
                billType: bill.doc_class,
                version: bill.package_id.split('-')[1].match(/[a-z]+$/)?.[0] || "",
                url: `https://www.govinfo.gov/app/details/${bill.package_id}`,
                summary: "",
                similarity: bill.similarity
            }))
        };
    } catch (error) {
        console.error("Error in semantic search:", error);
        throw error;
    }
}

export async function getPackageSummary(params: PackageSummaryParams) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);

	try {
		console.log('Fetching package summary for:', params.packageId);
		
		const response = await fetch(
			`https://api.govinfo.gov/packages/${params.packageId}/summary`,
			{
				headers: {
					Accept: 'application/json',
					'X-Api-Key': process.env.GOV_INFO_API_KEY || '',
				},
				signal: controller.signal
			}
		);

		clearTimeout(timeout);

		if (!response.ok) {
			if (response.status === 404) {
				return { summary: 'No summary available' };
			}
			throw new Error(`Failed to fetch package summary: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Return just the summary to avoid redundancy with getBillDetails
		return {
			summary: data.summary || data.title || 'No summary available'
		};

	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw new Error(`Request timed out while fetching summary for ${params.packageId}`);
			}
			console.error('Error in getPackageSummary:', error.message);
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}


export async function getCollections() {
	const response = await fetch("https://api.govinfo.gov/collections", {
		headers: {
			Accept: "application/json",
			"X-Api-Key": process.env.GOV_INFO_API_KEY || "",
		},
	});

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	return await response.json();
}


export async function getBillDetails(packageId: string) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

	try {
		console.log('Fetching bill details for:', packageId);

		const response = await fetch(
			`https://api.govinfo.gov/packages/${packageId}/summary`,
			{
				headers: {
					Accept: 'application/json',
					'X-Api-Key': process.env.GOV_INFO_API_KEY || '',
				},
				signal: controller.signal
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Failed to fetch bill details:', {
				status: response.status,
				statusText: response.statusText,
				body: errorText,
			});
			throw new Error(`Failed to fetch bill details: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		return {
			title: data.title,
			congress: data.congress,
			session: data.session,
			chamber: data.originChamber,
			sponsor: data.members?.find((m: BillMember) => m.role === 'SPONSOR')?.memberName,
			cosponsors: data.members
				?.filter((m: BillMember) => m.role === 'COSPONSOR')
				?.map((m: BillMember) => ({
					name: m.memberName,
					state: m.state,
					party: m.party,
				})),
			committee: data.committees?.[0]?.committeeName,
			dateIssued: data.dateIssued,
			lastModified: data.lastModified,
			status: {
				currentChamber: data.currentChamber,
				version: data.billVersion,
			},
			links: {
				pdf: data.download?.pdfLink,
				xml: data.download?.xmlLink,
				details: data.detailsLink,
			},
		};
	} catch (error) {
		console.error('Error in getBillDetails:', error);
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}
