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
      Вы являетесь ассистентом, который анализирует следующий русский текст и извлекает следующие столбцы.
Верните результат предоставив всю относящуюся информацию о следующих параметрах:

name (название)
manufacturer (производитель)
base (основа)
ptm_mm (ПТМ, мм)-> this should be a range
layer_thickness_mm (толщина слоя, мм)-> this should be a range (min - max)
consumption_kg_m2 (расход, кг/м²)-> this should be a range (min - max)
fire_resistance_limit_min (предел огнестойкости, мин)-> this should be a range (mix - max)
type (тип)
brands_used_in_system (бренды, используемые в системе)
certificate_validity_period (срок действия сертификата)
operating_conditions_temperature (температура условий эксплуатации)
resistance_to_aggressive_media (стойкость к агрессивным средам)
name_of_used_primer (название используемого грунта)
material_description_text_from_internet (описание материала из интернета)
certificate_registration_number (регистрационный номер сертификата)

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
