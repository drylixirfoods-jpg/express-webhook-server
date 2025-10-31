// AI Orchestrator - Central AI Request Manager
// Coordinates requests to various AI providers

const providers = require('./providers');

/**
 * Complete text generation using AI
 * @param {string} prompt - Prompt text
 * @param {string} model - Model name (default: gpt-4)
 * @returns {Promise<string>} - Generated text
 */
async function aiComplete(prompt, model = 'gpt-4') {
  try {
    console.log(`[AI] Complete request with model: ${model}`);
    
    if (!prompt) {
      throw new Error('Prompt required');
    }
    
    // Route to appropriate provider
    const result = await providers.openai.complete(prompt, { model });
    return result;
  } catch (error) {
    console.error('[AI ERROR]', error.message);
    throw error;
  }
}

/**
 * Classify text into categories
 * @param {string} text - Text to classify
 * @param {Array<string>} labels - Category labels
 * @returns {Promise<string>} - Classified label
 */
async function aiClassify(text, labels) {
  try {
    console.log(`[AI] Classify request with ${labels.length} labels`);
    
    if (!text || !labels || labels.length === 0) {
      throw new Error('Text and labels required');
    }
    
    const result = await providers.openai.classify(text, labels);
    return result;
  } catch (error) {
    console.error('[AI ERROR]', error.message);
    throw error;
  }
}

/**
 * Generate embeddings
 * @param {string} text - Text to embed
 * @returns {Promise<Array>} - Embedding vector
 */
async function aiEmbed(text) {
  try {
    console.log(`[AI] Embedding request`);
    return [0.1, 0.2, 0.3]; // Placeholder
  } catch (error) {
    console.error('[AI ERROR]', error.message);
    throw error;
  }
}

module.exports = {
  aiComplete,
  aiClassify,
  aiEmbed
};
