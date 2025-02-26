import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { content } = await req.json();

  if (!content) {
    return new Response("No content provided", { status: 400 });
  }

  try {
    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Define the prompt for Gemini
    const prompt = `

You are a poetic assistant. Your task is to take the user's input and refine it into a poetic, thought-provoking quote. The quote should be concise, deeply emotional, and resonate with introspection. Keep each quote within one or two lines, ensuring it maintains a melancholic, reflective, or philosophical tone.

Transform the following text into a poetic quote:

      Here is the quote: ${content}

Respond only with the enhanced poetic quote, without any explanations or additional text.here are some example 
[
    "..some of us will never be more than just a shoulder. The smile, but never the tear. The loving, but never the loved. The word, but never the poem.",
    "Of all wounds that refuse to heal, your name is the one that bleeds.",
    "..sometimes we don't want to heal, because the pain is the last link to what we lost.",
    "Perhaps she was glass. But glass is only brittle until it breaks. Then it's sharp.",
    "Maybe we feel empty, because we leave pieces of ourselves in everything we used to love.",
    "How many scars did you justify because you loved the person who was holding the knife?",
    "..when you planted flowers in the graveyard of my heart, I thought you would be there to water them too.",
    "..it always rains hardest on people who deserve the sun.",
    "..no sun can fill your heart when you have decided to love someone's darkness.",
    "I wish people could drink their words and realize how bitter they taste.",
    "I hope your soul only bloom for those, who aren't afraid of the thorns.",
    "Indeed, hearts are wild creatures. That's why our ribs are cages."
  ]

    `;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedQuote = response.text();

    // Return the enhanced quote
    return new Response(JSON.stringify({ enhancedQuote }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
