import { streamText, convertToCoreMessages } from 'ai';
import { headers } from 'next/headers';
import { openai } from '@ai-sdk/openai';
import { rateLimit } from '@/lib/rate-limiter';
import { tools } from '@/lib/tools/bills';
import { systemPrompt } from '@/lib/system';

const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL || 'gpt-4o-mini';

export async function POST(req: Request) {
	let cleanup: (() => void) | undefined;
	
	try {
		// Get IP address for rate limiting
		const headersList = await headers();
		const ip = headersList.get('x-forwarded-for') ?? 'anonymous';
		console.log(`📥 Incoming request from IP: ${ip}`);

		// Rate limit by IP
		const rateLimitResult = await rateLimit(ip);

		if (!rateLimitResult.success) {
			console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
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
		console.log('📝 Processing messages:', messages.length);

		const model = openai(OPENAI_API_MODEL);

		// Handle container shutdown
		cleanup = () => {
			console.log('🛑 Container shutdown initiated');
			// Cleanup logic here
		};
		
		process.on('SIGTERM', () => {
			console.log('📢 SIGTERM received');
			cleanup?.();
		});

		const result = streamText({
			experimental_toolCallStreaming: true,
			model,
			system: systemPrompt,
			messages: convertToCoreMessages(messages),
			tools,
			maxSteps: 10,
			temperature: 0.7,
		});

		console.log('📤 Streaming response initiated');
		return result.toDataStreamResponse();

	} catch (err: unknown) {
		const error = err instanceof Error ? err : new Error(String(err));
		
		console.error('❌ Error in chat route:', {
			error: error.message,
			stack: error.stack,
		});
		
		return new Response(
			JSON.stringify({ 
				error: 'Failed to process request',
				details: error.message
			}), 
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} finally {
		cleanup?.();
		console.log('🏁 Request completed');
	}
}
