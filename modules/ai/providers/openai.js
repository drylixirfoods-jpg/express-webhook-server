// OpenAI Provider - LLM API Integration
// Interfaces with OpenAI API for text generation and classification

const fetch = require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo';

/**
 * Text completion using OpenAI
 * @param {string} prompt - Input prompt
 * @param {Object} options - Options
 * @returns {Promise<string>} - Generated text
 */
async function complete(prompt, options = {}) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    
    const model = options.model || OPENAI_MODEL;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response';
  } catch (error) {
    console.error('[OPENAI ERROR]', error.message);
    throw error;
  }
}

/**
 * Classify text using prompt-based approach
 * @param {string} text - Text to classify
 * @param {Array<string>} labels - Category labels
 * @returns {Promise<string>} - Selected label
 */
async function classify(text, labels) {
  try {
    const prompt = `Classify the following text into one of these categories: ${labels.join(', ')}. Text: "${text}". Respond with only the category name.`;
    const result = await complete(prompt, { model: 'gpt-3.5-turbo' });
    return result.trim();
  } catch (error) {
    console.error('[OPENAI CLASSIFY ERROR]', error.message);
    // Fallback: return first label
    return labels[0];
  }
}

module.exports = {
  complete,
  classify
};
