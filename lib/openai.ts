import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function getOpenAIRecommendations(onboardingData: any) {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = `
A user has submitted the following onboarding data for a fitness app:
${JSON.stringify(onboardingData, null, 2)}
Based on this, recommend 3 personalized fitness or wellness goals.
For each, provide: title, category, description, and a simple weekly plan.
Your response should be a JSON object with a single key "recommendations" that holds an array of the goal objects.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // This model is better for JSON mode
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides fitness and wellness goal recommendations in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const aiText = response.choices[0].message?.content;

    if (!aiText) {
      throw new Error("OpenAI API returned an empty response.");
    }
    
    console.log("Raw OpenAI API Response Data:", aiText);

    let recommendations;
    try {
      const parsedResponse = JSON.parse(aiText);
      recommendations = parsedResponse.recommendations;
      if (!recommendations) {
        // Fallback if the key is not 'recommendations'
        recommendations = parsedResponse;
      }
      console.log("Parsed Recommendations:", JSON.stringify(recommendations, null, 2));
    } catch (parseError) {
      console.error("Error parsing AI text as JSON:", parseError);
      console.error("AI Text that caused parsing error:", aiText);
      recommendations = [{
        title: "AI Response Parsing Error",
        description: `Could not parse AI response. Raw AI text: ${aiText.substring(0, 200)}... (truncated)`
      }];
    }
    return recommendations;

  } catch (error) {
    console.error("Error during OpenAI API fetch:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while calling the OpenAI API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the OpenAI API.");
  }
}