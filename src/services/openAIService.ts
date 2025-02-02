import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export class OpenAIService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeText(content: string): Promise<any> {
    const prompt = `
      You are an assistant that analyzes the following Russian text and extracts the following columns.
          Return the result as a JSON object with variables in English for keys, for value just return string in Russian. If you dont find somethign - mark not found but try to find the info online:
          - name
          - manufacturer
          - base
          - ptm_mm
          - layer_thickness_mm
          - consumption_kg_m2
          - fire_resistance_limit_min
          - type
          - brands_used_in_system
          - certificate_validity_period
          - operating_conditions_temperature
          - resistance_to_aggressive_media
          - name_of_used_primer
          - material_description_text_from_internet
          - certificate_registration_number

      Text:
    `;
    let fileContent = content;
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo", // Use GPT-4-Turbo for efficiency
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. do not return your own response just whats asked. For example if the answer is JSON then just retunr the json without adding anything",
          },
          {
            role: "user",
            content: prompt + fileContent,
          },
        ],
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content?.trim();
      let parsedJsonContent;

      if (!content) {
        throw new Error("No content in response");
      }
      
      return JSON.parse(
        content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );
    } catch (error) {
      console.error("Error analyzing text:", error);
      throw new Error("Failed to analyze text: " + (error as Error).message);
    }
  }
}
