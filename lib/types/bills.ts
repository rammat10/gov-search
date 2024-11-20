export interface SearchBillsParams {
	query?: string;
	pageSize?: number;
	maxPages?: number;
	delayMs?: number;
	dateIssuedStartDate?: string;
	dateIssuedEndDate?: string;
}

export interface PackageSummaryParams {
	packageId: string;
}

export interface BillDetailsParams {
	packageId: string;
}

export interface RelatedBillsParams {
	packageId: string;
}

export interface CollectionsParams {
	congress?: string;
	pageSize?: number;
	offsetMark?: string;
}

export interface CollectionResponse {
	count: number;
	message?: string;
	nextPage?: string;
	previousPage?: string;
	packages: Array<{
		packageId: string;
		lastModified: string;
		packageLink: string;
		docClass?: string;
		title?: string;
		congress?: string;
		dateIssued?: string;
	}>;
}

export interface Bill {
	title: string;
	congress: string;
	dateIssued: string;
	packageId: string;
}

export interface SearchBillsResponse {
	count: number;
	bills: Bill[];
}

export interface BillSummaryResponse {
	summary: string;
}

export interface BillDetailsResponse {
	details: string;
}

export interface RelatedBillsResponse {
	related: string;
}

export interface CollectionsResponse {
	collections: Collection[];
}

export interface Collection {
	packageId: string;
	lastModified: string;
	packageLink: string;
	docClass?: string;
	title?: string;
	congress?: string;
	dateIssued?: string;
}

export interface PublishedParams {
	startDate: string;
	endDate?: string;
	collection: string | string[];
	pageSize: number;
	congress?: string;
	offsetMark?: string;
	modifiedSince?: string;
}

export interface LastModifiedParams {
	collection: string;
	startDate: string;
	endDate?: string;
	pageSize?: number;
	congress?: string;
	offsetMark?: string;
}

