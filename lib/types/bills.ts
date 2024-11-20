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

export interface BillDetailsResponse {
	details: string;
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

// Member types
export interface BillMember {
	role: 'SPONSOR' | 'COSPONSOR';
	chamber: string;
	congress: string;
	bioGuideId: string;
	name: string[];
	memberName: string;
	state: string;
	party: string;
}

// Committee type
export interface Committee {
	authorityId: string;
	chamber: string;
	committeeName: string;
	type: string;
}

// Download links type
export interface DownloadLinks {
	premisLink?: string;
	xmlLink?: string;
	txtLink?: string;
	zipLink?: string;
	modsLink?: string;
	pdfLink?: string;
}

// Bill summary response type
export interface BillSummaryResponse {
	title: string;
	congress: string;
	session: string;
	originChamber: string;
	currentChamber: string;
	billVersion: string;
	dateIssued: string;
	lastModified: string;
	summary?: string;
	members?: BillMember[];
	committees?: Committee[];
	download?: DownloadLinks;
	detailsLink?: string;
}

// Bill details type
export interface BillDetails {
	title: string;
	congress: string;
	session: string;
	chamber: string;
	sponsor?: string;
	cosponsors?: {
		name: string;
		state: string;
		party: string;
	}[];
	committee?: Committee;
}

