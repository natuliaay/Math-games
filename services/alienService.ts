import { GoogleGenAI } from "@google/genai";
import { Node, Triangle } from '../types';

export const askAlien = async (
  nodes: Record<string, Node>, 
  triangles: Triangle[], 
  invalidTriangles: string[][]
): Promise<string> => {
  if (!process.env.API_KEY) {
    // Fallback if no API key is provided
    if (invalidTriangles.length > 0) {
      return "Ой-йой! Я бачу однакові кольори! Спробуй змінити один з них.";
    }
    const isFull = Object.values(nodes).every(n => n.color !== null);
    if (isFull) {
        return "Чудова робота! Ти врятував галактику від одноманітності!";
    }
    return "Продовжуй! У тебе добре виходить.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a simplified representation of the board for the AI
    const boardState = Object.values(nodes).map(n => ({
        id: n.id,
        color: n.color || 'empty'
    }));
    
    const errors = invalidTriangles.length > 0;
    const isFull = Object.values(nodes).every(n => n.color !== null);

    const prompt = `
      Ти - дружній прибулець, який допомагає користувачеві вирішити математичну головоломку.
      
      Правила:
      1. Є сітка з трикутників.
      2. Вершини треба розфарбувати в червоний, зелений або синій.
      3. Жоден маленький трикутник не повинен мати всі три вершини одного кольору.
      
      Стан гри:
      - Чи є помилки (однокольорові трикутники): ${errors ? 'Так' : 'Ні'}.
      - Чи всі вершини зафарбовані: ${isFull ? 'Так' : 'Ні'}.
      
      Дані сітки (JSON): ${JSON.stringify(boardState)}
      
      Завдання:
      Напиши коротке, веселе повідомлення українською мовою для гравця.
      - Якщо є помилка, м'яко натякни на неї (не кажи точні координати, просто скажи "Обережно, я бачу трикутник одного кольору!").
      - Якщо все правильно, але ще не кінець, підбадьор.
      - Якщо все зафарбовано і правильно, привітай з перемогою у космічному стилі.
      - Використовуй емодзі.
      - Максимум 2 речення.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Привіт! Я слідкую за твоїм прогресом.";
  } catch (error) {
    console.error("Alien connection error:", error);
    return "Х'юстон, у нас проблеми зі зв'язком... але ти продовжуй малювати!";
  }
};