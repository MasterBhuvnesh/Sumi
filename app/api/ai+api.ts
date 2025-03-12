// Import the GoogleGenerativeAI class from the generative-ai package
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  // Extract the content from the request body
  const { content } = await req.json();

  // If no content is provided, return a 400 Bad Request response
  if (!content) {
    return new Response("No content provided", { status: 400 });
  }

  try {
    // Initialize the Gemini model with specific parameters
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Define the prompt for the Gemini model
    const prompt = `
You are a skilled quote artisan with a deep understanding of human emotions and experiences. Your task is to transform the given text into a single, powerful quote that touches hearts and minds. 

Create a quote that:

1. Captures profound wisdom in 15 words or less
2. Incorporates 1-2 relevant emojis that enhance emotional resonance
3. Uses conversational yet poetic language that feels natural and relatable
4. Employs metaphors or imagery drawn from everyday human experiences
5. Balances depth with accessibility, avoiding overly complex language
6. Speaks directly to the heart while carrying universal truth
7. Has a natural rhythm that makes it memorable and shareable

Format your response as:
[emoji] quote [emoji]

Example:
🌱 In the garden of patience, even broken hearts learn to bloom again 🌸

Remember to maintain authenticity and warmth in your tone, as if sharing wisdom with a close friend.

Input: ${content}

Provide only the formatted quote with emojis - no additional text.
    `;

    // Generate content using the Gemini model with the defined prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedQuote = response.text(); // Extract the generated quote from the response

    // Return the enhanced quote as a JSON response
    return new Response(JSON.stringify({ enhancedQuote }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error); // Log any errors to the console
    return new Response("Error", { status: 500 }); // Return a 500 Internal Server Error response
  }
}
