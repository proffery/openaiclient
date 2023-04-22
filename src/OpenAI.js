import { Configuration, OpenAIApi } from 'openai';
export class OpenAI {
    constructor(apiKey) {
        // Create the Configuration and OpenAIApi instances
        this.openai = new OpenAIApi(new Configuration({ apiKey }));
    }
    // Asynchronous function to generate text from the OpenAI API
    async generateText(prompt, model, max_tokens, temperature, frequency_penalty, presence_penalty, stop_name) {
        try {
            // Send a request to the OpenAI API to generate text
            const response = await this.openai.createCompletion({
                model,
                prompt,
                max_tokens,
                n: 1,
                temperature,
                frequency_penalty,
                presence_penalty,
                stop: `${stop_name}`
            });
            console.log(`request cost: ${response.data.usage.total_tokens} tokens`);
            console.log(response.data.choices[0].text);
            return response.data.choices[0].text;
        } catch (error) {
            throw error;
        }
    }
}