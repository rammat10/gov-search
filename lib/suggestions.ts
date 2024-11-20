export const suggestions = [
	// Historical Trends
	"Show me bills about climate change from 2014 to 2016",
	"What healthcare legislation was introduced between 2020 and 2022?",
	"Find cybersecurity bills from the past 2 years",
	"Compare infrastructure bills from 2014 to today",
	"What election security legislation was proposed before 2020?",
	"Show me immigration reform bills from 2016 to 2018",
	
	// Year-Specific
	"What major bills were introduced in 2020 about COVID-19?",
	"Show me all AI regulation bills from 2023",
	"What cryptocurrency legislation was proposed in 2022?",
	"Find bills about student loans from 2021",
	
	// Recent History
	"What bills about veterans' benefits passed in the last 3 years?",
	"Show me recent legislation about renewable energy",
	"What bills addressing mental health were introduced this year?",
	"Find data privacy bills from the past 6 months",
	
	// Comparative Periods
	"How has small business legislation changed from 2014 to now?",
	"Compare education funding bills between pre-COVID and post-COVID",
	"Show me the evolution of tech regulation from 2018 to present",
	"What gun control legislation was proposed before and after 2020?",
	
	// Current
	"What bills are being discussed about AI regulation right now?",
	"Show me ongoing legislation about banking reform",
	"What current bills address social media regulation?",
	"Find active legislation about infrastructure improvements"
] as const;

export function getRandomSuggestions(count: number = 3): string[] {
	return [...suggestions].sort(() => 0.5 - Math.random()).slice(0, count);
}