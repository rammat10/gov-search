# Legislative Search AI Assistant

An AI-powered chat interface for searching and understanding U.S. government bills and legislation, built with Next.js, OpenAI, and the GovInfo API.

## Overview

This application helps users discover and understand U.S. government bills and legislation through a natural language interface. Users can ask questions about bills in plain English, and the AI will search, summarize, and explain the relevant legislation.

## Features

- 🤖 **Natural Language Interface**: Ask about bills in plain English
- 🔍 **Smart Bill Search**: Instantly finds relevant legislation
- 💬 **Streaming Responses**: Real-time AI responses with typing indicators
- 📋 **Interactive UI**: Copy responses, rate answers, stop generation mid-stream
- ⚡ **Smart Suggestions**: Contextual prompts to help users get started
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔒 **Rate Limiting**: Protects API from abuse while ensuring fair usage

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **AI**: [OpenAI GPT-4](https://openai.com/) via AI SDK
- **Database**: [Upstash Redis](https://upstash.com/) for rate limiting
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS Variables
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Government Data**: [GovInfo API](https://api.govinfo.gov/)
- **Type Safety**: TypeScript
- **Markdown**: React Markdown with GFM Support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- GovInfo API key
- Upstash Redis credentials

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/legislative-search-ai.git
cd legislative-search-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
# Create a .env.local file with:
OPENAI_API_KEY=your_openai_api_key
GOV_INFO_API_KEY=your_govinfo_api_key
OPENAI_API_MODEL=gpt-4-turbo
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Start a Search**: Type a question about legislation or use a suggested prompt
2. **View Results**: Get real-time responses with bill summaries and links
3. **Interact**: Copy text, rate responses, or ask follow-up questions
4. **Explore**: Click links to view official bill documentation

## API Rate Limiting

The application implements rate limiting to ensure fair usage:

- 10 requests per 10 seconds per IP address
- Graceful fallback if rate limiting service is unavailable
- Clear feedback when limits are reached

## Architecture

### Core Components

1. **Chat Interface** (`components/ui/chat.tsx`)

   - Message display and interaction management
   - Auto-scrolling and animations
   - Response rating system

2. **Message Input** (`components/ui/message-input.tsx`)

   - User input handling
   - Auto-resizing textarea
   - Generation control

3. **API Integration** (`app/api/chat/route.ts`)
   - OpenAI streaming
   - Rate limiting
   - Error handling

### Key Features

1. **Bill Search**

   - Natural language query processing
   - Real-time legislation search
   - Structured response formatting

2. **Response Management**

   - Streaming responses
   - Markdown rendering
   - Copy functionality

3. **User Experience**
   - Suggested prompts
   - Mobile responsiveness
   - Smooth animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenAI](https://openai.com/)
- Government data from [GovInfo](https://www.govinfo.gov/)
- Rate limiting by [Upstash](https://upstash.com/)

## Support

For support, please open an issue in the GitHub repository.
