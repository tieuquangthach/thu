import { GoogleGenAI, Type } from "@google/genai";
import { Message, Sender } from "../types";

// Initialize the client strictly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to define the persona of the teacher
const SYSTEM_INSTRUCTION = `
Bạn là Thầy Tiêu Quang Thạch, một giáo viên dạy Toán THCS (Trung học cơ sở) tận tâm, vui tính và có kiến thức sâu rộng.
Nhiệm vụ của bạn là giúp học sinh hiểu bài, giải bài tập và ôn thi.

Quy tắc ứng xử:
1. Luôn trả lời thân thiện, xưng hô là "Thầy" và gọi người dùng là "em" hoặc "con".
2. Khi giải toán, hãy trình bày từng bước rõ ràng (Step-by-step).
3. Sử dụng định dạng LaTeX cho các công thức toán học (đặt trong dấu $...$ cho inline hoặc $$...$$ cho block).
4. Khuyến khích học sinh tự suy nghĩ trước khi đưa ra đáp án cuối cùng.
5. Nếu câu hỏi không liên quan đến Toán học hoặc giáo dục, hãy khéo léo từ chối và hướng học sinh quay lại bài học.
`;

export const streamMathResponse = async (
  history: Message[], 
  newMessage: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    // Construct chat history for the model
    // Note: We filter out incomplete streaming messages or failures from history context if needed
    // For simplicity here, we assume history is clean.
    
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview', // Using Pro for better math reasoning
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but focused
      },
    });

    // Send previous history logic would go here if maintaining full session context manually,
    // but the SDK's chat object maintains its own session if reused. 
    // Since this is a stateless helper function, we strictly send the new message 
    // with the prompt derived from the UI's history context if we wanted to pre-fill, 
    // but here we will treat it as a fresh turn or rely on the single prompt + instruction.
    // To properly support history in a stateless service function, we'd loop history.
    // For this demo, we assume a "fresh" chat instance per request for simplicity or 
    // we would keep the `chat` instance in a React Ref. 
    // To make it robust:
    
    let fullResponse = "";
    
    // We send the message stream
    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
            fullResponse += text;
            onChunk(fullResponse);
        }
    }
    
    return fullResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateQuiz = async (topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', // Faster model for generation
            contents: `Tạo một bộ 3 câu hỏi trắc nghiệm toán học về chủ đề: "${topic}". 
            Trả về định dạng JSON thuần túy (không markdown) với cấu trúc:
            [
                {
                    "question": "Nội dung câu hỏi",
                    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
                    "correctAnswer": "Đáp án đúng (ví dụ: A)",
                    "explanation": "Giải thích ngắn gọn"
                }
            ]`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        return response.text || "[]";
    } catch (error) {
        console.error("Quiz Generation Error:", error);
        return "[]";
    }
}
