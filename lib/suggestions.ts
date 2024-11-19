export const suggestions = [
	// Legislative Process
	"What bills are currently being debated on the House floor?",
	"Show me the most recently introduced Senate bills",
	"What bills have been signed into law this year?",
	"Which bills are in committee review right now?",
	"Show me bills with bipartisan sponsorship",
	"What legislation is scheduled for a vote this week?",
	"Find bills that passed with unanimous consent",
	"Which bills are awaiting presidential action?",

	// Hot Topics
	"What recent bills have been introduced about climate change?",
	"Show me legislation related to healthcare reform from the past year",
	"What bills are currently being discussed about cybersecurity?",
	"Find recent bills addressing artificial intelligence regulation",
	"What legislation exists about social media platforms?",
	"Show me bills about election security",
	"What legislation addresses pandemic preparedness?",
	"Find bills related to data privacy protection",
	"What recent bills focus on consumer protection?",
	"Show me legislation about veterans' benefits",

	// Economic
	"Show me recent bills about small business support",
	"What legislation addresses cryptocurrency regulation?",
	"Find bills related to student loan debt",
	"What bills mention inflation or economic recovery?",
	"Show me legislation about minimum wage",
	"What bills address trade agreements?",
	"Find recent bills about banking regulation",
	"What legislation mentions tax reform?",
	"Show me bills about job training programs",
	"What recent bills address retirement security?",
	"Find legislation about corporate transparency",
	"Which bills focus on supply chain resilience?",

	// Social Issues
	"What recent bills address voting rights?",
	"Show me legislation about education funding",
	"Find bills related to immigration reform",
	"What bills discuss affordable housing?",
	"Show me legislation about criminal justice reform",
	"What bills address racial equity?",
	"Find recent bills about gun safety",
	"What legislation mentions child care support?",
	"Show me bills about workplace discrimination",
	"What recent bills focus on mental health services?",
	"Find legislation about food security programs",
	"Which bills address substance abuse treatment?",

	// Infrastructure
	"What bills mention infrastructure improvements?",
	"Show me legislation about public transportation",
	"Find bills addressing broadband internet access",
	"What recent bills focus on renewable energy?",
	"Show me bills about water infrastructure",
	"What legislation addresses electric grid modernization?",
	"Find bills related to airport improvements",
	"What recent bills mention smart cities?",
	"Show me legislation about bridge and road repair",
	"What bills address coastal infrastructure?",
	"Find recent bills about clean energy projects",

	// Environmental
	"What bills address ocean conservation?",
	"Show me legislation about air quality standards",
	"Find bills related to wildlife protection",
	"What recent bills focus on forest management?",
	"Show me legislation about plastic pollution",
	"What bills address drought response?",
	"Find recent bills about clean water access",
	"What legislation mentions environmental justice?",
	"Show me bills about national parks",
	"What recent bills address natural disaster resilience?",

	// Healthcare
	"What bills focus on telehealth services?",
	"Show me legislation about prescription drug prices",
	"Find bills addressing medical research funding",
	"What recent bills mention rural healthcare access?",
	"Show me legislation about mental health parity",
	"What bills address healthcare workforce development?",
	"Find recent bills about maternal health",
	"What legislation mentions preventive care?",
	"Show me bills about rare disease research",
	"What bills address medical device regulation?",

	// Technology
	"What bills address quantum computing research?",
	"Show me legislation about space exploration",
	"Find bills related to autonomous vehicles",
	"What recent bills focus on STEM education?",
	"Show me legislation about digital identity",
	"What bills address semiconductor manufacturing?",
	"Find recent bills about biotechnology",
	"What legislation mentions blockchain technology?",
	"Show me bills about internet of things security",
	"What bills address facial recognition use?",
] as const;

export function getRandomSuggestions(count: number = 3): string[] {
	return [...suggestions].sort(() => 0.5 - Math.random()).slice(0, count);
}
