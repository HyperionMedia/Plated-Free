import * as FileSystem from 'expo-file-system';
import type { IngredientCategory, MacroNutrients } from './store';

interface ParsedRecipe {
  title: string;
  imageSearchTerm?: string;
  ingredients: {
    id: string;
    name: string;
    amount: string;
    category: IngredientCategory;
  }[];
  instructions: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
  suggestedFolder: string;
  caloriesPerServing: number;
  macros: MacroNutrients;
}

export async function analyzeRecipeImage(imageUri: string): Promise<ParsedRecipe> {
  const apiKey = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('[analyzeRecipe] OpenAI API key is not configured');
    throw new Error('OpenAI API key is not configured. Please set EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY in the ENV tab.');
  }

  console.log('[analyzeRecipe] API key found, starting image analysis...');

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const mimeType = imageUri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const prompt = `Analyze this recipe image and extract all information including nutritional estimates. Return a JSON object with this exact structure:
{
  "title": "Recipe name",
  "imageSearchTerm": "specific search term for finding a relevant image (e.g., if title is 'Classic Martini', use 'martini'; if 'Mom's Chicken Soup', use 'chicken soup')",
  "ingredients": [
    {
      "id": "unique-id-1",
      "name": "ingredient name",
      "amount": "quantity and unit (e.g., '2 cups', '1 lb')",
      "category": "one of: produce, meats, dairy, grains, spices, canned, frozen, beverages, condiments, other"
    }
  ],
  "instructions": ["Step 1...", "Step 2..."],
  "servings": "number of servings",
  "prepTime": "prep time",
  "cookTime": "cook time",
  "suggestedFolder": "one of: breakfast, lunch, dinner, desserts, snacks, drinks",
  "caloriesPerServing": 450,
  "macros": {
    "protein": 25,
    "carbs": 40,
    "fat": 18,
    "fiber": 5
  }
}

Category guidelines:
- produce: fruits, vegetables, fresh herbs
- meats: beef, chicken, pork, fish, seafood
- dairy: milk, cheese, butter, eggs, yogurt
- grains: flour, rice, pasta, bread, oats
- spices: salt, pepper, herbs (dried), seasonings
- canned: canned goods, jarred items
- frozen: frozen foods
- beverages: drinks, juice, wine for cooking
- condiments: sauces, oils, vinegar
- other: anything else

Suggested folder based on meal type:
- breakfast: morning foods, pancakes, eggs, etc.
- lunch: sandwiches, salads, light meals
- dinner: main courses, heavier meals
- desserts: sweets, cakes, cookies
- snacks: appetizers, finger foods
- drinks: beverages, cocktails, smoothies

For imageSearchTerm:
- Extract the CORE dish name from the title (e.g., "Martini" from "Classic Martini", "negroni" from "Perfect Negroni")
- For drinks, use the specific cocktail/beverage name
- For food, use the main dish or protein (e.g., "chicken pasta", "beef tacos", "chocolate cake")
- Keep it simple and specific - this will be used to find a matching image

For nutrition:
- Estimate caloriesPerServing based on ingredients and portion size
- Estimate macros (protein, carbs, fat, fiber) in grams per serving
- Be realistic with estimates based on the ingredients shown

Return ONLY valid JSON, no other text.`;

  console.log('[analyzeRecipe] Calling OpenAI API...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[analyzeRecipe] OpenAI API error:', response.status, error);

    if (response.status === 401) {
      throw new Error('OpenAI API authentication failed. Please check your API key in the ENV tab.');
    } else if (response.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }

    throw new Error(`Failed to analyze recipe image: ${response.status}`);
  }

  const data = await response.json();
  const outputText = data.choices?.[0]?.message?.content || '';

  // Extract JSON from the response
  const jsonMatch = outputText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('No JSON found in response:', outputText);
    throw new Error('Could not parse recipe data');
  }

  const parsed: ParsedRecipe = JSON.parse(jsonMatch[0]);

  // Ensure all ingredients have unique IDs
  parsed.ingredients = parsed.ingredients.map((ing, index) => ({
    ...ing,
    id: ing.id || `ing-${Date.now()}-${index}`,
  }));

  // Ensure macros have defaults
  parsed.macros = {
    protein: parsed.macros?.protein || 0,
    carbs: parsed.macros?.carbs || 0,
    fat: parsed.macros?.fat || 0,
    fiber: parsed.macros?.fiber || 0,
  };

  parsed.caloriesPerServing = parsed.caloriesPerServing || 0;

  return parsed;
}
