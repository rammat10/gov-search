# **Please Break This: What Congressional Staffers Can Learn by Making AI Fail**

[Matt Ramirez](https://www.linkedin.com/in/mattramirez/) 
[Tyler Newman](https://www.linkedin.com/in/tylerthecreator/)

[BlueDot Impact | AI Governance](https://aisafetyfundamentals.com/)

In September 2023, in the hype around [OpenAI's custom GPT release](https://openai.com/index/introducing-gpts/), I built what I thought would be a straightforward tool: connect ChatGPT to Congress's public database (GovInfo API). For some context, I used to work for Speaker Pelosi, and if there's one thing you learn working in Congress, it's the three currencies of congress: [votes, money, and information](https://dccc.org/wp-content/uploads/2020/05/05212020-DCCC-6-month-memo-final.pdf). Power often comes down to who can find information first. Much of what we call “institutional knowledge” is really just knowing how to find things quickly. Which committee handled that climate bill from 2019? Where's that specific line item in last year's appropriations? It's the kind of knowledge that makes junior staffers valuable and senior staffers indispensable. 
 
My first attempt at a chatbot for congress was something I called "[Parliamentarian GPT](https://www.linkedin.com/posts/mattramirez_ai-govtech-legislativeanalysis-activity-7132412283669942272-a_Cg?utm_source=share&utm_medium=member_desktop)" (Parls). Despite having almost no coding experience, I managed to cobble together something that worked, barely. We thought we could just have ChatGPT search through government documents and explain them in plain English. But here's the problem: the government's API search is quite exact, only surfacing precise matches. Ask for bills on “gun control laws,” and Parls likely won't find bills about "firearm regulations." The GovInfo API was built for precision, not conversation. Which is great if you know exactly what you're looking for (like “find H.R. 3684 from the 117th Congress”), terrible if you're asking natural language questions (like “What bills about renewable energy passed last year?”).  \

In addition to the exacting nature of GovInfo, much of Parls issues also revolved around JSON formatting. My friend Alex Rosner jumped in and helped solve that puzzle in about an hour. Even though that first version was basic, Alex's help got us to a working prototype that proved this idea could actually work, albeit very slowly. 

Looking at the [GovInfo API documentation](https://api.govinfo.gov/docs/), we discovered we couldn't search by subject and date simultaneously, couldn't filter results the way we wanted, and couldn't get truly relevant results without super specific queries. Parls needed a different approach, not just a better way to search, but a better way to organize the information in the first place.  \

## **Anthropic’s Archibot and Parls Version 2.0**

In October 2024, [Anthropic announced](https://www.anthropic.com/customers/european-parliament) they did the same thing as Parls, but for the European Parliament. They called it “[Archibot](https://archidash.europarl.europa.eu/ep-archives-anonymous-dashboard)”. They released a slick newsroom post complete with a professional video and all. But when I actually tried it out, clicking through numerous hyperlinks, I discovered that Archibot had the same problems Parls did. Slow, inaccurate, inefficient. Definitely not the *magic* that one experiences while using these powerful tools. This got me thinking (while in a bit of an envious mood): why is it so hard to make an LLM work with government documents? More importantly, what does this tell us about how we should be thinking about AI governance?

## **Our App: Gov Search**

With these questions in mind, I decided to take another try at the project. At first, I tried no-code attempts in [Bubble.io](Bubble.io). I made more progress than I thought I would, especially given my lack of technical knowledge. While enrolled in [BlueDot Impact’s](https://bluedot.org/) AI Governance course, I had since learned that what we were trying to build was a variation of what is known as [Retrieval augmented generation (RAG)](https://medium.com/@amodwrites/understanding-retrieval-augmented-generation-a-simple-guide-d638ac92c123).
 
RAG is a technique designed for large language models (LLMs) enabling them to retrieve and incorporate information from specific, external documents in real time. Instead of relying solely on their static training data (what ChatGPT comes with), LLMs using RAG can answer questions with more accuracy and relevance by referencing up-to-date or domain-specific information.

RAG starts with a document repository: a collection of data or files the model can reference. A retrieval system, called [vector search](https://learn.microsoft.com/en-us/azure/search/vector-search-overview), helps find the most relevant information. Instead of just matching exact words, vector search works by translating text into numbers, called embeddings, which capture the meaning of the words. This makes it possible to find information that’s conceptually related (semantically), even if the words don’t match perfectly. The LLM then takes what it retrieves, combines it with what it already “knows,” and crafts a response. The magic happens through a pipeline that ties everything together, allowing the model to use fresh, specific, or trusted information when needed. (Vercel, among its many “out of the box” solutions, offers a [step by step guide](https://sdk.vercel.ai/docs/guides/rag-chatbot) on how to create a RAG chatbot complete with all the elements and style components to build your own. All plug and play.)

It was unlikely that I would learn vector searching and embeddings in a short timeline. Actually, probably impossible. So I connected with Tyler Newman, a Los Angeles-based developer who took a look at my project and saw where we needed to go technically and could explain technical concepts in a way that helped me understand what we were building and why. His expertise helped transform a clunky prototype into something that actually worked the way we'd imagined.

Instead of making AI search through government documents directly (like hunting for a book in a huge library without any catalog), we use a vector database. Think of it as a smart librarian who’s organized all the books by their topic, not just their titles, and can quickly find the ones most relevant to your question.

We used some pretty standard tools (our “stack”):

* [Vercel](vercel.com) and Github (for deploying/putting it on the internet)
* [Next.js](Next.js) (for making it work like a modern website, a pre-built solution built on top of React)
* [Supabase](https://supabase.com/) (our [postgres vector database](https://www.enterprisedb.com/blog/what-is-pgvector); a ready-to-go cloud database)
* OpenAI (4.0 mini)
* [Redis](https://redis.io/docs/latest/get-started/) (rate limiters/usage limits, preventing abuse, hosted on [Upstash](https://upstash.com/docs/redis/overall/getstarted))
* [shadcn/ui](https://ui.shadcn.com/docs) (a collection of copy-past reusable UI components) 

## **What is actually happening?**

When you type “show me climate bills” into our search bar, you're kicking off a chain reaction across several services, each doing one specific job really well. You're actually talking to an app that lives on Vercel. Vercel makes hosting Next.js apps straightforward because Vercel created Next.js. When you search, your question’s first stop is Redis on Upstash (our rate limiter, or bouncer/short-term memory, if you will, preventing abuse), then to OpenAI (GPT 4.0) to turn your question into a pattern of numbers (an embedding), then to Supabase (our database that enables semantic search) to find similar bills. Finally, GPT-4 explains what we found in plain English, ”natural language”. You’ll notice, we never actually hit the GovInfo API during searches as that would be too slow and inefficient (what Parls used to do). 

So, what you're seeing is actually just half of our system. We have two completely separate pieces of code (repositories) that never talk to each other directly but work together through Supabase. First, there's our “ingest” repository, that does the heavy lifting. It runs monthly, connecting to the government's database (GovInfo), grabbing new bills, turning their titles into number patterns with OpenAI, and storing everything in Supabase. Then there's our “search” repository, the one running on Vercel that you are interacting with. It never touches the government database directly; instead, it just asks Supabase, “Hey, what bills match this search pattern?” 

The technical magic happens in how these services talk to each other. Each has its own API key stored in Vercel's environment variables (While that sounds complicated, Vercel makes it very easy to copy and paste these variables. It was as straightforward as Bubble.io!). That's really it. Vercel handles all the infrastructure (scaling, deployment, domains), while our actual app is just a few free or low cost cloud services playing ping-pong with your question until it finds and explains the right bills. (an excellent write up about how companies are using LLMs in this and other ways can be found [here](https://www.contraption.co/archetypes-of-llm-apps/)).  

## **Dear Colleague**

This app was built as my submission to BlueDot Impact’s AI Governance course. In lieu of an essay or blog post about one of the many pressing AI governance concepts covered throughout the 12 week course, I’d like to tap into what makes this technology so mesmerizing and magical, and to invite folks to use the app as a way to explore the implications of even simple AI tools.

To congressional staffers (and curious users), we built an app to help you search legislation, but it's actually designed to do something more interesting: help you understand firsthand why AI governance is so tricky.

So here's your invitation: use this app. Break this app. Make it hallucinate. Because the first way to understand why AI needs governance is to watch it fail in interesting ways.

## **What You're Playing With**

We built an app that uses AI to help you find and understand congressional bills. Type in a question, get relevant bills and explanations. Behind the scenes it's using:

* GPT-4 to understand your questions
* Vector search to find relevant bills
* Embeddings to match concepts

## **Break It**

Here are some experiments to try, and what they might teach us about AI governance:

**Make It Hallucinate** 

Ask about “recent bills about underwater basket weaving regulations.” The AI might confidently invent bills that don't exist. Or show you related or tangentially related bills. Maybe follow up with “why did you show me these bills, none of them are about basket weaving?” 

The governance questions this raises include:

* How do we handle AI systems that can be confidently wrong? [^1]

* Who's liable when AI makes a mistake? [^2]

* How do we train LLM’s and reward anticipated behavior? [^3]
**Test Its Memory**

Ask about a bill, then refer back to it in a follow-up question. Watch how its understanding of context sometimes fails.

This raises interesting questions about:

* How do we ensure AI systems maintain accurate context? [^4]

* What happens when AI systems handle ongoing conversations about policy or issues that present bias? [^5]
**Push Its Boundaries** 

Try asking about bills using different phrasings, or about complex legislative concepts. See where it gets confused.

Think about:

* How do we ensure AI systems are consistently reliable? [^6]

* What level of accuracy is “good enough” for government, medical, military, financial, energy or health sectors or even police use? [^7]

* How exactly are companies and startups using LLMs to reinvent industry, and what are the economic implications? [^8] [^9] 

## **The geo-political complexities of modern AI**

Want to understand the core challenges of AI governance? Here are three fundamental issues you can think about as you use our app, as outlined in Ben Buchanan’s *The AI Triad and What It Means for National Security. *[^10]

## **Compute: Who Gets Access to AI Power?**

Try these experiments:

* Send a bunch of queries at once. Notice how rate limiting kicks in.
* Ask increasingly complex questions. Watch response times vary.

Lets extrapolate and ask questions about compute access: [^11]

* Who should have priority access to AI computing power?
* What happens when AI resources are constrained?
* How do we ensure equal access when computing costs money? 
* What happens when powerful AI tools are only available to those who can afford the compute costs? [^12]
Real-world implications:

* Should there be priority access to compute resources, who benefits? [^13] 

* How do we balance speed versus cost?[^14]

## **Data: Who Controls What AI Knows?**

Try these prompts:

* Ask about very recent bills
* Compare results for well-documented bills versus more esoteric ones
* Look for biases in how bills are summarized

This surfaces crucial questions about data:

* Who decides what data AI systems learn from? [^15]

* What happens when AI training data is outdated? [^16] 

* Who owns the insights generated from public data? [^17]

Real-world implications:

* Should government agencies have their own AI training data? [^18]
* How do we ensure AI systems have current information?
* What happens when private AI systems interpret public data?


## **Algorithms: Who Decides How AI Thinks?**

Experiment with:

* Asking the same question different ways
* Watching how it summarizes complex bills
* Testing its reasoning on policy matters

This raises core algorithmic questions:

* Who controls how AI interprets government information; what about in other countries?[^19]

* How do we audit AI's decision-making? [^20]

* How do we ensure AI explanations are understandable? [^21]

Real-world implications:

* Should regulations come from regulators with expertise, or the public who face potential negative consequences? [^22]

* What level of transparency should we require? [^23]

## **Why This Matters**

Each time you use our tool, you're not just searching bills – you're experiencing firsthand the governance challenges that come with: Limited compute resources, complex data ownership, and algorithmic decision-making.

These aren't theoretical problems. They're practical challenges that affect everyone. Who can use AI? What AI can know? And how does AI make decisions? 

These are the questions we hope you'll find yourself asking when using our app. Questions about access, data control, and algorithmic transparency, are exactly the questions we need to be answering about AI governance more broadly.

## **Your Turn**

Sometimes the best way to understand a technology's governance challenges is to experience them firsthand. So consider this your personal sandbox for understanding AI's promises and pitfalls.

After all, who better to understand the nuances of AI governance than the people who'll be helping write it?

## Notes

[^1]:

     UNESCO. 2023. “UNESCO’s Recommendation on the Ethics of Artificial Intelligence.” 12. [https://unesdoc.unesco.org/ark:/48223/pf0000385082](https://unesdoc.unesco.org/ark:/48223/pf0000385082).

[^2]:

     Matthews, Dylan. 2024. “Can the courts save us from dangerous AI?” Vox. [https://www.vox.com/future-perfect/2024/2/7/24062374/ai-openai-anthropic-deepmind-legal-liability-gabriel-weil](https://www.vox.com/future-perfect/2024/2/7/24062374/ai-openai-anthropic-deepmind-legal-liability-gabriel-weil) 

[^3]:

     “Improving Model Safety Behavior with Rule-Based Rewards.” 2024. OpenAI. [https://openai.com/index/improving-model-safety-behavior-with-rule-based-rewards/](https://openai.com/index/improving-model-safety-behavior-with-rule-based-rewards/) 

[^4]:

     Karpathy, Andrej. 2023. “Intro to Large Language Models.” Youtube. [https://youtu.be/zjkBMFhNj_g?list=TLGGmhVb6kFCLhAyNDExMjAyNA](https://youtu.be/zjkBMFhNj_g?list=TLGGmhVb6kFCLhAyNDExMjAyNA). 

[^5]:

     Ngo, Richard. 2021. “A short introduction to machine learning.” AI Alignment Forum. [https://www.alignmentforum.org/posts/qE73pqxAZmeACsAdF/a-short-introduction-to-machine-learning#:~:text=But%20no%20matter,still%20poorly%2Dunderstood](https://www.alignmentforum.org/posts/qE73pqxAZmeACsAdF/a-short-introduction-to-machine-learning#:~:text=But%20no%20matter,still%20poorly%2Dunderstood). 

[^6]:

     Buchanan, Ben. n.d. “The AI Triad and What It Means for National Security Strategy.” *Center for Security and Emerging Technology*, 12. [https://cset.georgetown.edu/wp-content/uploads/CSET-AI-Triad-Report.pdf](https://cset.georgetown.edu/wp-content/uploads/CSET-AI-Triad-Report.pdf). 

[^7]:

     A pro-innovation approach to AI regulation.” 2024. *Presented to Parliament by the Secretary of State for Science, Innovation and Technology by Command of His Majesty*, 63. [https://assets.publishing.service.gov.uk/media/65c1e399c43191000d1a45f4/a-pro-innovation-approach-to-ai-regulation-amended-governement-response-web-ready.pdf](https://assets.publishing.service.gov.uk/media/65c1e399c43191000d1a45f4/a-pro-innovation-approach-to-ai-regulation-amended-governement-response-web-ready.pdf). 

[^8]:

     Thomas, Philip. 2024. “Archetypes of LLM apps: What businesses are actually doing with AI.” ContraptionCo. [https://www.contraption.co/archetypes-of-llm-apps/](https://www.contraption.co/archetypes-of-llm-apps/). 

[^9]:
     Altman, Sam. 2021. “Moore's Law for Everything.” samaltman.com  [https://moores.samaltman.com/](https://moores.samaltman.com/) 

[^10]:
     Buchanan, Ben. n.d. “The AI Triad and What It Means for National Security Strategy.” *Center for Security and Emerging Technology*. [https://cset.georgetown.edu/wp-content/uploads/CSET-AI-Triad-Report.pdf](https://cset.georgetown.edu/wp-content/uploads/CSET-AI-Triad-Report.pdf). 

[^11]:
     National Strategic Computing Reserve: A Blueprint.” n.d. The White House. [https://www.whitehouse.gov/wp-content/uploads/2021/10/National-Strategic-Computing-Reserve-Blueprint-Oct2021.pdf](https://www.whitehouse.gov/wp-content/uploads/2021/10/National-Strategic-Computing-Reserve-Blueprint-Oct2021.pdf). 

[^12]:

     Bender, Emily, Timnit Gebru, and Angelina McMillian. 2021. “On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?” *ACM DL Digital Library*, (March), ENVIRONMENTAL AND FINANCIAL COST 612. 

[^13]:

     Strubell, Emma, Ananya Ganesh, and Andrew McCallum. n.d. “Energy and Policy Considerations for Deep Learning in NLP.” ACL Anthology. Accessed November 23, 2024. [https://aclanthology.org/P19-1355.pdf](https://aclanthology.org/P19-1355.pdf). 

[^14]:

      Seger, Dreksler, Moulange, Dardaman, Schuett, Wei, et al, ‘Open-Sourcing Highly Capable Foundation Models: An Evaluation of Risks, Benefits, and Alternative Methods for Pursuing Open-Source Objectives’, Centre for the Governance of AI, 2023. [https://cdn.governance.ai/Open-Sourcing_Highly_Capable_Foundation_Models_2023_GovAI.pdf](https://cdn.governance.ai/Open-Sourcing_Highly_Capable_Foundation_Models_2023_GovAI.pdf) 

[^15]:

     Miller, Katharine. 2024. “Privacy in an AI Era: How Do We Protect Our Personal Information?” Stanford HAI. [https://hai.stanford.edu/news/privacy-ai-era-how-do-we-protect-our-personal-information](https://hai.stanford.edu/news/privacy-ai-era-how-do-we-protect-our-personal-information). 

[^16]:

     Glaser, April. 2017. “What happens when the data used to train A.I. is biased and old.” Slate Magazine. [https://slate.com/technology/2017/10/what-happens-when-the-data-used-to-train-a-i-is-biased-and-old.html](https://slate.com/technology/2017/10/what-happens-when-the-data-used-to-train-a-i-is-biased-and-old.html). 

[^17]:

     Harvard Business Review. 2023. “Generative AI Has an Intellectual Property Problem.” Harvard Business Review. [https://hbr.org/2023/04/generative-ai-has-an-intellectual-property-problem](https://hbr.org/2023/04/generative-ai-has-an-intellectual-property-problem). 

[^18]:

     Glaze, Kurt, Daniel Ho, Gerald Ray, and Christine Tsang. n.d. “Artificial Intelligence for Adjudication: The Social Security Administration and AI Governance.” *Stanford University*. [https://dho.stanford.edu/wp-content/uploads/SSA.pdf](https://dho.stanford.edu/wp-content/uploads/SSA.pdf). 

[^19]:

     Sheehan, Matt. n.d. “China's Views on AI Safety Are Changing—Quickly.” Carnegie Endowment for International Peace. [https://carnegieendowment.org/research/2024/08/china-artificial-intelligence-ai-safety-regulation?lang=en](https://carnegieendowment.org/research/2024/08/china-artificial-intelligence-ai-safety-regulation?lang=en). 

[^20]:

     Sample, Ian. 2017. “Computer says no: why making AIs fair, accountable and transparent is crucial.” The Guardian. [https://www.theguardian.com/science/2017/nov/05/computer-says-no-why-making-ais-fair-accountable-and-transparent-is-crucial](https://www.theguardian.com/science/2017/nov/05/computer-says-no-why-making-ais-fair-accountable-and-transparent-is-crucial). 

[^21]:

     3Blue1Brown. 2024. “Transformers (how LLMs work) explained visually | DL5.” YouTube. https://www.youtube.com/watch?v=wjZofJX0v4M.

[^22]:

     A pro-innovation approach to AI regulation: government response.” 2024. GOV.UK. [https://www.gov.uk/government/consultations/ai-regulation-a-pro-innovation-approach-policy-proposals/outcome/a-pro-innovation-approach-to-ai-regulation-government-response](https://www.gov.uk/government/consultations/ai-regulation-a-pro-innovation-approach-policy-proposals/outcome/a-pro-innovation-approach-to-ai-regulation-government-response). 

[^23]:

     OECD. 2019. “Recommendation of the Council on Artificial Intelligence.” [https://oecd.ai/en/assets/files/OECD-LEGAL-0449-en.pdf](https://oecd.ai/en/assets/files/OECD-LEGAL-0449-en.pdf). 
