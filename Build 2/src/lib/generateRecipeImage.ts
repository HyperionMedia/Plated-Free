/**
 * Generate a recipe image using OpenAI's image generation API
 */
export async function generateRecipeImage(recipeName: string): Promise<string> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error('[generateRecipeImage] OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured. Please set EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY in the ENV tab.');
    }

    console.log('[generateRecipeImage] Generating image for:', recipeName);

    // Create a detailed food photography prompt
    const prompt = `A professional, appetizing food photography shot of ${recipeName}. High-quality, well-lit, restaurant-style plating. The dish should look delicious and authentic. Clean white or dark background. No text, no hands, no people.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generateRecipeImage] API error:', response.status, errorText);

      if (response.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      }

      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image generation API response:', JSON.stringify(data, null, 2));

    // Check for the image data in the response
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('Unexpected API response structure:', data);
      throw new Error('No image data in API response');
    }

    const imageData = data.data[0];

    // Handle URL response
    if (imageData.url) {
      return imageData.url;
    }

    // Handle base64 response - convert to data URI
    if (imageData.b64_json) {
      return `data:image/png;base64,${imageData.b64_json}`;
    }

    console.error('Image data missing url and b64_json:', imageData);
    throw new Error('Invalid image data format in API response');
  } catch (error) {
    console.error('Error generating recipe image:', error);
    throw error;
  }
}
