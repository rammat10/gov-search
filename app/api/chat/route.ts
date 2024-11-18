import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// const model = openai("gpt-4-turbo");
const model = openai("gpt-4o-mini");
export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model,
		system: "You are a helpful assistant.",
		messages,
	});

	return result.toDataStreamResponse();
}
