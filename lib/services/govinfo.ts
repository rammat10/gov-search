import { PackageSummaryParams, SearchBillsParams, PublishedParams, LastModifiedParams } from "../types/bills";
import { search } from '@/lib/search';

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
	const response = await fetch(
		`https://api.govinfo.gov/packages/${params.packageId}/summary`,
		{
			headers: {
				Accept: "application/json",
				"X-Api-Key": process.env.GOV_INFO_API_KEY || "",
			},
		}
	);

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	return await response.json();
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

export async function getLastModifiedPackages(params: LastModifiedParams) {
	const { collection, startDate, endDate } = params;
	const url = endDate 
		? `https://api.govinfo.gov/collections/${collection}/${startDate}/${endDate}`
		: `https://api.govinfo.gov/collections/${collection}/${startDate}`;

	const queryParams = new URLSearchParams();
	if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
	if (params.congress) queryParams.append("congress", params.congress);
	if (params.offsetMark) queryParams.append("offsetMark", params.offsetMark);

	const response = await fetch(`${url}?${queryParams.toString()}`, {
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

export async function getPublishedPackages(params: PublishedParams) {
	console.log("getPublishedPackages called with params:", params);
	
	const { startDate, endDate, collection, pageSize } = params;
	const url = endDate 
		? `https://api.govinfo.gov/published/${startDate}/${endDate}`
		: `https://api.govinfo.gov/published/${startDate}`;
	
	console.log("Base URL:", url);

	const queryParams = new URLSearchParams({
		pageSize: pageSize.toString(),
		collection: Array.isArray(collection) ? collection.join(',') : collection
	});

	if (params.congress) queryParams.append("congress", params.congress);
	if (params.offsetMark) queryParams.append("offsetMark", params.offsetMark);
	if (params.modifiedSince) queryParams.append("modifiedSince", params.modifiedSince);

	const fullUrl = `${url}?${queryParams.toString()}`;
	console.log("Full request URL:", fullUrl);

	const response = await fetch(fullUrl, {
		headers: {
			Accept: "application/json",
			"X-Api-Key": process.env.GOV_INFO_API_KEY || "",
		},
	});

	console.log("Response status:", response.status, response.statusText);
	
	if (!response.ok) {
		const errorText = await response.text();
		console.error("Error response body:", errorText);
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	const data = await response.json();
	console.log("Response data:", data);
	return data;
}

export async function getBillDetails(packageId: string) {
	const response = await fetch(
		`https://api.govinfo.gov/packages/${packageId}/details`,
		{
			headers: {
				Accept: "application/json",
				"X-Api-Key": process.env.GOV_INFO_API_KEY || "",
			},
		}
	);

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	return await response.json();
}

export async function getRelatedBills(packageId: string) {
	const response = await fetch(
		`https://api.govinfo.gov/packages/${packageId}/related`,
		{
			headers: {
				Accept: "application/json",
				"X-Api-Key": process.env.GOV_INFO_API_KEY || "",
			},
		}
	);

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	return await response.json();
}
