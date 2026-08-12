export interface AIProvider {
  name: string;
  analyzeLearningContent(title: string, subject: string, content: string): Promise<string>;
  generateTutorResponse(
    prompt: string,
    context: string,
    conversationHistory: Array<{ sender: string; content: string }>,
    mode?: string
  ): Promise<string>;
  answerMemoryQuestion(question: string, memoryContext: string): Promise<string>;
  generateStructuredOutput?(prompt: string, schema?: any): Promise<any>;
  analyzeImage?(imageBuffer: Buffer, mimeType: string): Promise<string>;
  processAudio?(audioBuffer: Buffer, mimeType: string): Promise<string>;
  createEmbedding?(text: string): Promise<number[]>;
}
