export interface SearchBillsParams {
	query?: string;
	pageSize?: number;
	maxPages?: number;
	delayMs?: number;
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
