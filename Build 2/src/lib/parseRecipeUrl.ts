export async function parseRecipeFromUrl(url: string) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;

    if (!apiKey) {
      console.error('[parseRecipeUrl] OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured. Please set EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY in the ENV tab.');
    }

    console.log('[parseRecipeUrl] Fetching URL:', url);

    // Fetch the webpage content
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);

    const prompt = `Parse this recipe webpage HTML and extract the recipe information. Return ONLY a JSON object with the following structure (no markdown, no code blocks, just the JSON):
{
  "title": "Recipe Title",
  "imageUrl": "https://full-url-to-recipe-image.jpg",
  "imageSearchTerm": "core dish name for image search (e.g., 'martini' for 'Classic Martini', 'chicken pasta' for 'Creamy Chicken Pasta')",
  "ingredients": [
    {"id": "ing-1", "name": "ingredient name", "amount": "1 cup", "category": "produce"}
  ],
  "instructions": ["step 1", "step 2"],
  "servings": "4",
  "prepTime": "15 min",
  "cookTime": "30 min",
  "caloriesPerServing": 350,
  "macros": {
    "protein": 25,
    "carbs": 40,
    "fat": 12,
    "fiber": 5
  }
}

IMPORTANT:
- For imageUrl, extract the main recipe photo URL from the HTML. Look for meta tags (og:image, twitter:image), schema.org markup, or the primary recipe image. Return the FULL absolute URL (not relative paths).
- If no image is found, return an empty string for imageUrl.
- For imageSearchTerm, extract the CORE dish name (e.g., "Martini" from "Classic Martini", "negroni" from "Perfect Negroni", "chicken soup" from "Mom's Chicken Soup")

Category must be one of: produce, meats, dairy, grains, spices, canned, frozen, beverages, condiments, other

If nutrition information is not available, estimate it based on the ingredients. Use reasonable estimates for missing times.

HTML:
${html.slice(0, 30000)}`;

    // Use the same API endpoint and key as analyzeRecipe.ts
    console.log('[parseRecipeUrl] Calling OpenAI API...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI response status:', openaiResponse.status);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('[parseRecipeUrl] OpenAI error:', openaiResponse.status, errorText);

      if (openaiResponse.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key in the ENV tab.');
      } else if (openaiResponse.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      }

      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const content = data.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    console.log('OpenAI response content:', content.substring(0, 200));

    // Extract JSON from the response (remove markdown code blocks if present)
    let jsonString = content.trim();

    // Remove markdown code blocks if present
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    // Try to find JSON object
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not find JSON in response:', jsonString);
      throw new Error('Could not parse recipe data from response');
    }

    const recipeData = JSON.parse(jsonMatch[0]);

    console.log('Parsed recipe:', recipeData.title);

    // Suggest folder based on recipe title/type
    let suggestedFolder = 'lunch';
    const titleLower = recipeData.title.toLowerCase();
    if (
      titleLower.includes('breakfast') ||
      titleLower.includes('pancake') ||
      titleLower.includes('waffle') ||
      titleLower.includes('oatmeal') ||
      titleLower.includes('smoothie')
    ) {
      suggestedFolder = 'breakfast';
    } else if (
      titleLower.includes('dessert') ||
      titleLower.includes('cake') ||
      titleLower.includes('cookie') ||
      titleLower.includes('brownie') ||
      titleLower.includes('ice cream')
    ) {
      suggestedFolder = 'desserts';
    } else if (
      titleLower.includes('snack') ||
      titleLower.includes('chip') ||
      titleLower.includes('dip')
    ) {
      suggestedFolder = 'snacks';
    } else if (
      titleLower.includes('drink') ||
      titleLower.includes('cocktail') ||
      titleLower.includes('juice') ||
      titleLower.includes('tea') ||
      titleLower.includes('coffee')
    ) {
      suggestedFolder = 'drinks';
    } else if (
      titleLower.includes('dinner') ||
      titleLower.includes('steak') ||
      titleLower.includes('roast')
    ) {
      suggestedFolder = 'dinner';
    }

    return {
      ...recipeData,
      suggestedFolder,
    };
  } catch (error) {
    console.error('URL parse error details:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse recipe: ${error.message}`);
    }
    throw error;
  }
}
