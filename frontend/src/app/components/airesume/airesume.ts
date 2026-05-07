import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-airesume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './airesume.html',
  styleUrl: './airesume.css',
})
export class Airesume {
  readonly messageHistory = signal<string[]>([]);
  private readonly ai = new GoogleGenAI({ apiKey: environment.geminiApiKey });

  aiResponse = '';
  aiError = '';
  isLoading = false;

  async sendToAi(prompt: string): Promise<void> {
    this.aiError = '';
    this.aiResponse = '';
    this.isLoading = true;

    const input = "{asas}\n\nUse only the ecological data in this JSON, with emphasis on Colombia ecological laws. If the JSON does not contain the needed detail, say so clearly and ask a short follow-up question. Always answer in spanish\n\nUser prompt: " + prompt.trim();
    this.messageHistory.update((history) => [...history, `User: ${input}`]);

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? response.text ?? '';
      this.aiResponse = text;
      this.messageHistory.update((history) => [...history, `AI: ${text}`]);

    } catch (error) {
      console.error('AI request failed', error);
      this.aiError = 'Failed to generate the AI summary. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
