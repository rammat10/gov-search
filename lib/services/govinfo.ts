import { PackageSummaryParams, SearchBillsParams, PublishedParams, LastModifiedParams } from "../types/bills";

export async function searchBills(params: SearchBillsParams) {
	console.log("searchBills", params);

	const response = await fetch("https://api.govinfo.gov/search", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"X-Api-Key": process.env.GOV_INFO_API_KEY || "",
		},
		body: JSON.stringify({
			query: `collection:BILLS AND (${params.query})`,
			pageSize: params.pageSize || 10,
			offsetMark: "*",
			sorts: [{ field: "dateIssued", sortOrder: "DESC" }],
			historical: true
		}),
	});

	if (!response.ok) {
		throw new Error(`GovInfo API error: ${response.status} - ${response.statusText}`);
	}

	const data = await response.json();
	console.log("searchBills raw response data:", data);

	if (!data.count || !data.results) {
		return { count: 0, bills: [] };
	}

	try {
		return {
			count: data.count,
			bills: data.results.map((bill: {
				packageId: string;
				title?: string;
				dateIssued?: string;
				resultLink?: string;
			}) => {
				const parts = bill.packageId.split("-");
				const congressPart = parts[1];
				const congress = congressPart.match(/^\d+/)?.[0] || "Unknown";
				const billType = congressPart.match(/[a-z]+(?=\d)/i)?.[0] || "";
				const billNumber = congressPart.match(/\d+(?=[a-z]*$)/)?.[0] || "";
				const version = congressPart.match(/[a-z]+$/)?.[0] || "";

				return {
					title: bill.title || "Untitled",
					congress,
					dateIssued: bill.dateIssued || "Date unknown",
					packageId: bill.packageId || "",
					billNumber,
					billType,
					version,
					url: `https://www.govinfo.gov/app/details/${bill.packageId}`,
					summary: bill.resultLink || "",
				};
			}),
		};
	} catch (error) {
		console.error("Error processing search results:", error);
		console.error("Raw data:", data);
		throw new Error("Failed to process search results");
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
