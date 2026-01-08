import type { IngredientCategory, MacroNutrients } from './store';

export interface FoodItem {
  id: string;
  name: string;
  category: IngredientCategory;
  caloriesPer100g: number;
  macrosPer100g: MacroNutrients;
  defaultServingGrams: number;
  servingDescription: string;
  isCustom?: boolean;
}

export interface RestaurantMeal {
  id: string;
  restaurant: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
}

// Common ingredients organized by category - EXPANDED
export const INGREDIENT_DATABASE: FoodItem[] = [
  // PROTEINS - POULTRY
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'meats', caloriesPer100g: 165, macrosPer100g: { protein: 31, carbs: 0, fat: 3.6, fiber: 0 }, defaultServingGrams: 140, servingDescription: '1 breast (~5 oz)' },
  { id: 'chicken-thigh', name: 'Chicken Thigh', category: 'meats', caloriesPer100g: 209, macrosPer100g: { protein: 26, carbs: 0, fat: 10.9, fiber: 0 }, defaultServingGrams: 100, servingDescription: '1 thigh' },
  { id: 'chicken-wing', name: 'Chicken Wing', category: 'meats', caloriesPer100g: 203, macrosPer100g: { protein: 30, carbs: 0, fat: 8, fiber: 0 }, defaultServingGrams: 90, servingDescription: '3 wings' },
  { id: 'chicken-drumstick', name: 'Chicken Drumstick', category: 'meats', caloriesPer100g: 172, macrosPer100g: { protein: 28, carbs: 0, fat: 5.7, fiber: 0 }, defaultServingGrams: 95, servingDescription: '1 drumstick' },
  { id: 'rotisserie-chicken', name: 'Rotisserie Chicken', category: 'meats', caloriesPer100g: 190, macrosPer100g: { protein: 29, carbs: 0, fat: 7.5, fiber: 0 }, defaultServingGrams: 140, servingDescription: '1/4 chicken' },
  { id: 'turkey-breast', name: 'Turkey Breast', category: 'meats', caloriesPer100g: 135, macrosPer100g: { protein: 30, carbs: 0, fat: 0.7, fiber: 0 }, defaultServingGrams: 85, servingDescription: '3 oz sliced' },
  { id: 'ground-turkey', name: 'Ground Turkey (93%)', category: 'meats', caloriesPer100g: 150, macrosPer100g: { protein: 21, carbs: 0, fat: 7, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz' },
  { id: 'turkey-bacon', name: 'Turkey Bacon', category: 'meats', caloriesPer100g: 218, macrosPer100g: { protein: 22, carbs: 2, fat: 14, fiber: 0 }, defaultServingGrams: 28, servingDescription: '2 slices' },
  { id: 'duck-breast', name: 'Duck Breast', category: 'meats', caloriesPer100g: 132, macrosPer100g: { protein: 23, carbs: 0, fat: 4, fiber: 0 }, defaultServingGrams: 140, servingDescription: '1 breast' },

  // PROTEINS - BEEF
  { id: 'ground-beef-80', name: 'Ground Beef (80/20)', category: 'meats', caloriesPer100g: 254, macrosPer100g: { protein: 26, carbs: 0, fat: 17, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz patty' },
  { id: 'ground-beef-90', name: 'Ground Beef (90/10)', category: 'meats', caloriesPer100g: 176, macrosPer100g: { protein: 26, carbs: 0, fat: 10, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz patty' },
  { id: 'ground-beef-93', name: 'Ground Beef (93/7)', category: 'meats', caloriesPer100g: 152, macrosPer100g: { protein: 24, carbs: 0, fat: 6, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz patty' },
  { id: 'steak-sirloin', name: 'Sirloin Steak', category: 'meats', caloriesPer100g: 183, macrosPer100g: { protein: 27, carbs: 0, fat: 8, fiber: 0 }, defaultServingGrams: 170, servingDescription: '6 oz steak' },
  { id: 'steak-ribeye', name: 'Ribeye Steak', category: 'meats', caloriesPer100g: 291, macrosPer100g: { protein: 24, carbs: 0, fat: 21, fiber: 0 }, defaultServingGrams: 227, servingDescription: '8 oz steak' },
  { id: 'steak-filet', name: 'Filet Mignon', category: 'meats', caloriesPer100g: 267, macrosPer100g: { protein: 26, carbs: 0, fat: 18, fiber: 0 }, defaultServingGrams: 170, servingDescription: '6 oz filet' },
  { id: 'steak-strip', name: 'NY Strip Steak', category: 'meats', caloriesPer100g: 241, macrosPer100g: { protein: 25, carbs: 0, fat: 15, fiber: 0 }, defaultServingGrams: 225, servingDescription: '8 oz steak' },
  { id: 'steak-flank', name: 'Flank Steak', category: 'meats', caloriesPer100g: 158, macrosPer100g: { protein: 26, carbs: 0, fat: 6, fiber: 0 }, defaultServingGrams: 170, servingDescription: '6 oz' },
  { id: 'beef-brisket', name: 'Beef Brisket', category: 'meats', caloriesPer100g: 221, macrosPer100g: { protein: 28, carbs: 0, fat: 12, fiber: 0 }, defaultServingGrams: 140, servingDescription: '5 oz' },
  { id: 'corned-beef', name: 'Corned Beef', category: 'meats', caloriesPer100g: 251, macrosPer100g: { protein: 18, carbs: 0, fat: 19, fiber: 0 }, defaultServingGrams: 85, servingDescription: '3 oz' },
  { id: 'roast-beef', name: 'Roast Beef (deli)', category: 'meats', caloriesPer100g: 131, macrosPer100g: { protein: 21, carbs: 0, fat: 5, fiber: 0 }, defaultServingGrams: 56, servingDescription: '2 oz sliced' },

  // PROTEINS - PORK
  { id: 'pork-chop', name: 'Pork Chop', category: 'meats', caloriesPer100g: 231, macrosPer100g: { protein: 25, carbs: 0, fat: 14, fiber: 0 }, defaultServingGrams: 150, servingDescription: '1 chop' },
  { id: 'pork-tenderloin', name: 'Pork Tenderloin', category: 'meats', caloriesPer100g: 143, macrosPer100g: { protein: 26, carbs: 0, fat: 4, fiber: 0 }, defaultServingGrams: 140, servingDescription: '5 oz' },
  { id: 'pork-loin', name: 'Pork Loin Roast', category: 'meats', caloriesPer100g: 197, macrosPer100g: { protein: 25, carbs: 0, fat: 10, fiber: 0 }, defaultServingGrams: 140, servingDescription: '5 oz' },
  { id: 'bacon', name: 'Bacon', category: 'meats', caloriesPer100g: 541, macrosPer100g: { protein: 37, carbs: 1.4, fat: 42, fiber: 0 }, defaultServingGrams: 16, servingDescription: '2 slices' },
  { id: 'canadian-bacon', name: 'Canadian Bacon', category: 'meats', caloriesPer100g: 157, macrosPer100g: { protein: 20, carbs: 1, fat: 8, fiber: 0 }, defaultServingGrams: 56, servingDescription: '2 slices' },
  { id: 'ham', name: 'Ham (deli)', category: 'meats', caloriesPer100g: 145, macrosPer100g: { protein: 21, carbs: 1.5, fat: 6, fiber: 0 }, defaultServingGrams: 56, servingDescription: '2 oz sliced' },
  { id: 'pork-sausage', name: 'Pork Sausage', category: 'meats', caloriesPer100g: 339, macrosPer100g: { protein: 19, carbs: 0, fat: 28, fiber: 0 }, defaultServingGrams: 56, servingDescription: '2 links' },
  { id: 'italian-sausage', name: 'Italian Sausage', category: 'meats', caloriesPer100g: 304, macrosPer100g: { protein: 16, carbs: 3, fat: 25, fiber: 0 }, defaultServingGrams: 83, servingDescription: '1 link' },
  { id: 'bratwurst', name: 'Bratwurst', category: 'meats', caloriesPer100g: 333, macrosPer100g: { protein: 14, carbs: 2, fat: 30, fiber: 0 }, defaultServingGrams: 85, servingDescription: '1 brat' },
  { id: 'pulled-pork', name: 'Pulled Pork', category: 'meats', caloriesPer100g: 210, macrosPer100g: { protein: 26, carbs: 0, fat: 11, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz' },
  { id: 'pork-ribs', name: 'Pork Ribs', category: 'meats', caloriesPer100g: 277, macrosPer100g: { protein: 23, carbs: 0, fat: 20, fiber: 0 }, defaultServingGrams: 170, servingDescription: '3 ribs' },

  // PROTEINS - SEAFOOD
  { id: 'salmon', name: 'Salmon', category: 'meats', caloriesPer100g: 208, macrosPer100g: { protein: 20, carbs: 0, fat: 13, fiber: 0 }, defaultServingGrams: 170, servingDescription: '1 fillet (~6 oz)' },
  { id: 'salmon-smoked', name: 'Smoked Salmon', category: 'meats', caloriesPer100g: 117, macrosPer100g: { protein: 18, carbs: 0, fat: 4, fiber: 0 }, defaultServingGrams: 56, servingDescription: '2 oz' },
  { id: 'tuna', name: 'Tuna (canned)', category: 'meats', caloriesPer100g: 116, macrosPer100g: { protein: 26, carbs: 0, fat: 0.8, fiber: 0 }, defaultServingGrams: 85, servingDescription: '1 can (~3 oz)' },
  { id: 'tuna-steak', name: 'Tuna Steak', category: 'meats', caloriesPer100g: 132, macrosPer100g: { protein: 28, carbs: 0, fat: 1, fiber: 0 }, defaultServingGrams: 170, servingDescription: '6 oz steak' },
  { id: 'shrimp', name: 'Shrimp', category: 'meats', caloriesPer100g: 99, macrosPer100g: { protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 }, defaultServingGrams: 85, servingDescription: '~6 large shrimp' },
  { id: 'lobster', name: 'Lobster', category: 'meats', caloriesPer100g: 89, macrosPer100g: { protein: 19, carbs: 0, fat: 0.9, fiber: 0 }, defaultServingGrams: 145, servingDescription: '1 tail' },
  { id: 'crab', name: 'Crab Meat', category: 'meats', caloriesPer100g: 97, macrosPer100g: { protein: 19, carbs: 0, fat: 1.5, fiber: 0 }, defaultServingGrams: 135, servingDescription: '1 cup' },
  { id: 'scallops', name: 'Scallops', category: 'meats', caloriesPer100g: 111, macrosPer100g: { protein: 21, carbs: 5, fat: 1, fiber: 0 }, defaultServingGrams: 85, servingDescription: '4 large scallops' },
  { id: 'cod', name: 'Cod', category: 'meats', caloriesPer100g: 82, macrosPer100g: { protein: 18, carbs: 0, fat: 0.7, fiber: 0 }, defaultServingGrams: 170, servingDescription: '6 oz fillet' },
  { id: 'tilapia', name: 'Tilapia', category: 'meats', caloriesPer100g: 96, macrosPer100g: { protein: 20, carbs: 0, fat: 1.7, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz fillet' },
  { id: 'halibut', name: 'Halibut', category: 'meats', caloriesPer100g: 111, macrosPer100g: { protein: 23, carbs: 0, fat: 2, fiber: 0 }, defaultServingGrams: 159, servingDescription: '5.5 oz fillet' },
  { id: 'mahi-mahi', name: 'Mahi Mahi', category: 'meats', caloriesPer100g: 85, macrosPer100g: { protein: 18, carbs: 0, fat: 0.7, fiber: 0 }, defaultServingGrams: 170, servingDescription: '6 oz fillet' },
  { id: 'trout', name: 'Trout', category: 'meats', caloriesPer100g: 148, macrosPer100g: { protein: 21, carbs: 0, fat: 7, fiber: 0 }, defaultServingGrams: 143, servingDescription: '1 fillet' },
  { id: 'sardines', name: 'Sardines (canned)', category: 'meats', caloriesPer100g: 208, macrosPer100g: { protein: 25, carbs: 0, fat: 11, fiber: 0 }, defaultServingGrams: 92, servingDescription: '1 can' },
  { id: 'anchovies', name: 'Anchovies', category: 'meats', caloriesPer100g: 131, macrosPer100g: { protein: 20, carbs: 0, fat: 5, fiber: 0 }, defaultServingGrams: 20, servingDescription: '5 fillets' },
  { id: 'clams', name: 'Clams', category: 'meats', caloriesPer100g: 148, macrosPer100g: { protein: 26, carbs: 5, fat: 2, fiber: 0 }, defaultServingGrams: 85, servingDescription: '3 oz' },
  { id: 'mussels', name: 'Mussels', category: 'meats', caloriesPer100g: 172, macrosPer100g: { protein: 24, carbs: 7, fat: 4, fiber: 0 }, defaultServingGrams: 85, servingDescription: '3 oz (~12 mussels)' },
  { id: 'oysters', name: 'Oysters', category: 'meats', caloriesPer100g: 81, macrosPer100g: { protein: 9, carbs: 5, fat: 2, fiber: 0 }, defaultServingGrams: 84, servingDescription: '6 medium' },
  { id: 'calamari', name: 'Calamari (fried)', category: 'meats', caloriesPer100g: 175, macrosPer100g: { protein: 18, carbs: 8, fat: 8, fiber: 0 }, defaultServingGrams: 85, servingDescription: '3 oz' },

  // PROTEINS - OTHER
  { id: 'tofu-firm', name: 'Tofu (firm)', category: 'meats', caloriesPer100g: 144, macrosPer100g: { protein: 17, carbs: 3, fat: 9, fiber: 2 }, defaultServingGrams: 126, servingDescription: '1/2 block' },
  { id: 'tofu-silken', name: 'Tofu (silken)', category: 'meats', caloriesPer100g: 55, macrosPer100g: { protein: 5, carbs: 2, fat: 3, fiber: 0 }, defaultServingGrams: 124, servingDescription: '1/2 cup' },
  { id: 'tempeh', name: 'Tempeh', category: 'meats', caloriesPer100g: 193, macrosPer100g: { protein: 20, carbs: 8, fat: 11, fiber: 5 }, defaultServingGrams: 83, servingDescription: '3 oz' },
  { id: 'seitan', name: 'Seitan', category: 'meats', caloriesPer100g: 370, macrosPer100g: { protein: 75, carbs: 14, fat: 2, fiber: 1 }, defaultServingGrams: 85, servingDescription: '3 oz' },
  { id: 'beyond-burger', name: 'Beyond Burger', category: 'meats', caloriesPer100g: 250, macrosPer100g: { protein: 18, carbs: 5, fat: 18, fiber: 3 }, defaultServingGrams: 113, servingDescription: '1 patty' },
  { id: 'impossible-burger', name: 'Impossible Burger', category: 'meats', caloriesPer100g: 212, macrosPer100g: { protein: 17, carbs: 8, fat: 13, fiber: 3 }, defaultServingGrams: 113, servingDescription: '1 patty' },
  { id: 'lamb-chop', name: 'Lamb Chop', category: 'meats', caloriesPer100g: 282, macrosPer100g: { protein: 25, carbs: 0, fat: 20, fiber: 0 }, defaultServingGrams: 113, servingDescription: '2 chops' },
  { id: 'lamb-leg', name: 'Leg of Lamb', category: 'meats', caloriesPer100g: 217, macrosPer100g: { protein: 26, carbs: 0, fat: 12, fiber: 0 }, defaultServingGrams: 140, servingDescription: '5 oz' },
  { id: 'veal', name: 'Veal Cutlet', category: 'meats', caloriesPer100g: 172, macrosPer100g: { protein: 31, carbs: 0, fat: 5, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz' },
  { id: 'venison', name: 'Venison', category: 'meats', caloriesPer100g: 158, macrosPer100g: { protein: 30, carbs: 0, fat: 3, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz' },
  { id: 'bison', name: 'Bison', category: 'meats', caloriesPer100g: 143, macrosPer100g: { protein: 28, carbs: 0, fat: 2, fiber: 0 }, defaultServingGrams: 113, servingDescription: '4 oz' },
  { id: 'hot-dog', name: 'Hot Dog (beef)', category: 'meats', caloriesPer100g: 290, macrosPer100g: { protein: 11, carbs: 2, fat: 26, fiber: 0 }, defaultServingGrams: 57, servingDescription: '1 hot dog' },
  { id: 'pepperoni', name: 'Pepperoni', category: 'meats', caloriesPer100g: 494, macrosPer100g: { protein: 23, carbs: 0, fat: 44, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz (~15 slices)' },
  { id: 'salami', name: 'Salami', category: 'meats', caloriesPer100g: 425, macrosPer100g: { protein: 22, carbs: 2, fat: 37, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz (3 slices)' },
  { id: 'prosciutto', name: 'Prosciutto', category: 'meats', caloriesPer100g: 195, macrosPer100g: { protein: 24, carbs: 0, fat: 10, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz (2 slices)' },
  { id: 'bologna', name: 'Bologna', category: 'meats', caloriesPer100g: 308, macrosPer100g: { protein: 12, carbs: 3, fat: 27, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 slice' },
  { id: 'liver-chicken', name: 'Chicken Liver', category: 'meats', caloriesPer100g: 167, macrosPer100g: { protein: 26, carbs: 1, fat: 6, fiber: 0 }, defaultServingGrams: 100, servingDescription: '3.5 oz' },

  // DAIRY & EGGS
  { id: 'egg', name: 'Egg (whole)', category: 'dairy', caloriesPer100g: 155, macrosPer100g: { protein: 13, carbs: 1.1, fat: 11, fiber: 0 }, defaultServingGrams: 50, servingDescription: '1 large egg' },
  { id: 'egg-white', name: 'Egg White', category: 'dairy', caloriesPer100g: 52, macrosPer100g: { protein: 11, carbs: 0.7, fat: 0.2, fiber: 0 }, defaultServingGrams: 33, servingDescription: '1 egg white' },
  { id: 'egg-yolk', name: 'Egg Yolk', category: 'dairy', caloriesPer100g: 322, macrosPer100g: { protein: 16, carbs: 3.6, fat: 27, fiber: 0 }, defaultServingGrams: 17, servingDescription: '1 yolk' },
  { id: 'eggs-scrambled', name: 'Scrambled Eggs', category: 'dairy', caloriesPer100g: 148, macrosPer100g: { protein: 10, carbs: 2, fat: 11, fiber: 0 }, defaultServingGrams: 91, servingDescription: '2 eggs scrambled' },
  { id: 'hard-boiled-egg', name: 'Hard Boiled Egg', category: 'dairy', caloriesPer100g: 155, macrosPer100g: { protein: 13, carbs: 1.1, fat: 11, fiber: 0 }, defaultServingGrams: 50, servingDescription: '1 egg' },
  { id: 'milk-whole', name: 'Whole Milk', category: 'dairy', caloriesPer100g: 61, macrosPer100g: { protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'milk-2-percent', name: '2% Milk', category: 'dairy', caloriesPer100g: 50, macrosPer100g: { protein: 3.3, carbs: 4.8, fat: 2, fiber: 0 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'milk-1-percent', name: '1% Milk', category: 'dairy', caloriesPer100g: 42, macrosPer100g: { protein: 3.4, carbs: 5, fat: 1, fiber: 0 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'milk-skim', name: 'Skim Milk', category: 'dairy', caloriesPer100g: 34, macrosPer100g: { protein: 3.4, carbs: 5, fat: 0.1, fiber: 0 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'almond-milk', name: 'Almond Milk (unsweetened)', category: 'dairy', caloriesPer100g: 15, macrosPer100g: { protein: 0.6, carbs: 0.3, fat: 1.2, fiber: 0 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'oat-milk', name: 'Oat Milk', category: 'dairy', caloriesPer100g: 50, macrosPer100g: { protein: 1, carbs: 7, fat: 2, fiber: 0.8 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'soy-milk', name: 'Soy Milk', category: 'dairy', caloriesPer100g: 54, macrosPer100g: { protein: 3.3, carbs: 6, fat: 1.8, fiber: 0.5 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'coconut-milk', name: 'Coconut Milk (beverage)', category: 'dairy', caloriesPer100g: 19, macrosPer100g: { protein: 0.2, carbs: 0.3, fat: 2, fiber: 0 }, defaultServingGrams: 244, servingDescription: '1 cup' },
  { id: 'half-half', name: 'Half & Half', category: 'dairy', caloriesPer100g: 130, macrosPer100g: { protein: 3, carbs: 4, fat: 12, fiber: 0 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'heavy-cream', name: 'Heavy Cream', category: 'dairy', caloriesPer100g: 340, macrosPer100g: { protein: 2, carbs: 3, fat: 36, fiber: 0 }, defaultServingGrams: 15, servingDescription: '1 tbsp' },
  { id: 'sour-cream', name: 'Sour Cream', category: 'dairy', caloriesPer100g: 193, macrosPer100g: { protein: 2, carbs: 5, fat: 18, fiber: 0 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'greek-yogurt', name: 'Greek Yogurt (plain)', category: 'dairy', caloriesPer100g: 97, macrosPer100g: { protein: 9, carbs: 3.6, fat: 5, fiber: 0 }, defaultServingGrams: 170, servingDescription: '1 container' },
  { id: 'greek-yogurt-nonfat', name: 'Greek Yogurt (nonfat)', category: 'dairy', caloriesPer100g: 59, macrosPer100g: { protein: 10, carbs: 4, fat: 0.4, fiber: 0 }, defaultServingGrams: 170, servingDescription: '1 container' },
  { id: 'regular-yogurt', name: 'Yogurt (regular)', category: 'dairy', caloriesPer100g: 63, macrosPer100g: { protein: 5, carbs: 7, fat: 1.6, fiber: 0 }, defaultServingGrams: 170, servingDescription: '1 container' },
  { id: 'flavored-yogurt', name: 'Yogurt (fruit-flavored)', category: 'dairy', caloriesPer100g: 99, macrosPer100g: { protein: 4, carbs: 19, fat: 1, fiber: 0 }, defaultServingGrams: 170, servingDescription: '1 container' },
  { id: 'cheddar-cheese', name: 'Cheddar Cheese', category: 'dairy', caloriesPer100g: 403, macrosPer100g: { protein: 25, carbs: 1.3, fat: 33, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 slice (~1 oz)' },
  { id: 'mozzarella', name: 'Mozzarella', category: 'dairy', caloriesPer100g: 280, macrosPer100g: { protein: 28, carbs: 3.1, fat: 17, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'mozzarella-fresh', name: 'Fresh Mozzarella', category: 'dairy', caloriesPer100g: 280, macrosPer100g: { protein: 22, carbs: 1, fat: 22, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'parmesan', name: 'Parmesan Cheese', category: 'dairy', caloriesPer100g: 431, macrosPer100g: { protein: 38, carbs: 4, fat: 29, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'swiss-cheese', name: 'Swiss Cheese', category: 'dairy', caloriesPer100g: 380, macrosPer100g: { protein: 27, carbs: 5, fat: 28, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 slice' },
  { id: 'provolone', name: 'Provolone Cheese', category: 'dairy', caloriesPer100g: 351, macrosPer100g: { protein: 26, carbs: 2, fat: 27, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 slice' },
  { id: 'american-cheese', name: 'American Cheese', category: 'dairy', caloriesPer100g: 371, macrosPer100g: { protein: 18, carbs: 6, fat: 31, fiber: 0 }, defaultServingGrams: 21, servingDescription: '1 slice' },
  { id: 'feta-cheese', name: 'Feta Cheese', category: 'dairy', caloriesPer100g: 264, macrosPer100g: { protein: 14, carbs: 4, fat: 21, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz (crumbled)' },
  { id: 'goat-cheese', name: 'Goat Cheese', category: 'dairy', caloriesPer100g: 364, macrosPer100g: { protein: 22, carbs: 0, fat: 30, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'blue-cheese', name: 'Blue Cheese', category: 'dairy', caloriesPer100g: 353, macrosPer100g: { protein: 21, carbs: 2, fat: 29, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'brie', name: 'Brie Cheese', category: 'dairy', caloriesPer100g: 334, macrosPer100g: { protein: 21, carbs: 0, fat: 28, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'ricotta', name: 'Ricotta Cheese', category: 'dairy', caloriesPer100g: 174, macrosPer100g: { protein: 11, carbs: 3, fat: 13, fiber: 0 }, defaultServingGrams: 62, servingDescription: '1/4 cup' },
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'dairy', caloriesPer100g: 98, macrosPer100g: { protein: 11, carbs: 3.4, fat: 4.3, fiber: 0 }, defaultServingGrams: 113, servingDescription: '1/2 cup' },
  { id: 'cottage-cheese-lowfat', name: 'Cottage Cheese (lowfat)', category: 'dairy', caloriesPer100g: 72, macrosPer100g: { protein: 12, carbs: 3, fat: 1, fiber: 0 }, defaultServingGrams: 113, servingDescription: '1/2 cup' },
  { id: 'cream-cheese', name: 'Cream Cheese', category: 'dairy', caloriesPer100g: 342, macrosPer100g: { protein: 6, carbs: 4.1, fat: 34, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz (2 tbsp)' },
  { id: 'cream-cheese-light', name: 'Cream Cheese (light)', category: 'dairy', caloriesPer100g: 215, macrosPer100g: { protein: 8, carbs: 5, fat: 19, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 oz (2 tbsp)' },
  { id: 'butter', name: 'Butter', category: 'dairy', caloriesPer100g: 717, macrosPer100g: { protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 }, defaultServingGrams: 14, servingDescription: '1 tbsp' },
  { id: 'butter-unsalted', name: 'Unsalted Butter', category: 'dairy', caloriesPer100g: 717, macrosPer100g: { protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 }, defaultServingGrams: 14, servingDescription: '1 tbsp' },
  { id: 'ghee', name: 'Ghee', category: 'dairy', caloriesPer100g: 900, macrosPer100g: { protein: 0, carbs: 0, fat: 100, fiber: 0 }, defaultServingGrams: 14, servingDescription: '1 tbsp' },
  { id: 'string-cheese', name: 'String Cheese', category: 'dairy', caloriesPer100g: 280, macrosPer100g: { protein: 28, carbs: 1, fat: 18, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1 stick' },
  { id: 'cheese-shredded', name: 'Shredded Mexican Blend', category: 'dairy', caloriesPer100g: 403, macrosPer100g: { protein: 22, carbs: 3, fat: 33, fiber: 0 }, defaultServingGrams: 28, servingDescription: '1/4 cup' },

  // GRAINS & CARBS
  { id: 'white-rice', name: 'White Rice (cooked)', category: 'grains', caloriesPer100g: 130, macrosPer100g: { protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 }, defaultServingGrams: 158, servingDescription: '1 cup cooked' },
  { id: 'brown-rice', name: 'Brown Rice (cooked)', category: 'grains', caloriesPer100g: 111, macrosPer100g: { protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 }, defaultServingGrams: 195, servingDescription: '1 cup cooked' },
  { id: 'jasmine-rice', name: 'Jasmine Rice (cooked)', category: 'grains', caloriesPer100g: 129, macrosPer100g: { protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 }, defaultServingGrams: 158, servingDescription: '1 cup cooked' },
  { id: 'basmati-rice', name: 'Basmati Rice (cooked)', category: 'grains', caloriesPer100g: 121, macrosPer100g: { protein: 3.5, carbs: 25, fat: 0.4, fiber: 0.6 }, defaultServingGrams: 158, servingDescription: '1 cup cooked' },
  { id: 'wild-rice', name: 'Wild Rice (cooked)', category: 'grains', caloriesPer100g: 101, macrosPer100g: { protein: 4, carbs: 21, fat: 0.3, fiber: 1.8 }, defaultServingGrams: 164, servingDescription: '1 cup cooked' },
  { id: 'cauliflower-rice', name: 'Cauliflower Rice', category: 'grains', caloriesPer100g: 25, macrosPer100g: { protein: 2, carbs: 5, fat: 0.1, fiber: 2 }, defaultServingGrams: 100, servingDescription: '1 cup' },
  { id: 'pasta-cooked', name: 'Pasta (cooked)', category: 'grains', caloriesPer100g: 131, macrosPer100g: { protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 }, defaultServingGrams: 140, servingDescription: '1 cup cooked' },
  { id: 'pasta-whole-wheat', name: 'Whole Wheat Pasta (cooked)', category: 'grains', caloriesPer100g: 124, macrosPer100g: { protein: 5, carbs: 25, fat: 0.5, fiber: 4 }, defaultServingGrams: 140, servingDescription: '1 cup cooked' },
  { id: 'spaghetti', name: 'Spaghetti (cooked)', category: 'grains', caloriesPer100g: 131, macrosPer100g: { protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 }, defaultServingGrams: 140, servingDescription: '1 cup cooked' },
  { id: 'penne', name: 'Penne (cooked)', category: 'grains', caloriesPer100g: 131, macrosPer100g: { protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 }, defaultServingGrams: 140, servingDescription: '1 cup cooked' },
  { id: 'macaroni', name: 'Macaroni (cooked)', category: 'grains', caloriesPer100g: 131, macrosPer100g: { protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 }, defaultServingGrams: 140, servingDescription: '1 cup cooked' },
  { id: 'egg-noodles', name: 'Egg Noodles (cooked)', category: 'grains', caloriesPer100g: 138, macrosPer100g: { protein: 5, carbs: 25, fat: 2, fiber: 1.2 }, defaultServingGrams: 160, servingDescription: '1 cup cooked' },
  { id: 'ramen-noodles', name: 'Ramen Noodles (dry)', category: 'grains', caloriesPer100g: 436, macrosPer100g: { protein: 10, carbs: 62, fat: 17, fiber: 2 }, defaultServingGrams: 43, servingDescription: '1 packet noodles' },
  { id: 'rice-noodles', name: 'Rice Noodles (cooked)', category: 'grains', caloriesPer100g: 109, macrosPer100g: { protein: 0.9, carbs: 25, fat: 0.2, fiber: 0.9 }, defaultServingGrams: 176, servingDescription: '1 cup cooked' },
  { id: 'udon-noodles', name: 'Udon Noodles (cooked)', category: 'grains', caloriesPer100g: 99, macrosPer100g: { protein: 3, carbs: 21, fat: 0.1, fiber: 1 }, defaultServingGrams: 176, servingDescription: '1 cup cooked' },
  { id: 'bread-white', name: 'White Bread', category: 'grains', caloriesPer100g: 265, macrosPer100g: { protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 }, defaultServingGrams: 30, servingDescription: '1 slice' },
  { id: 'bread-wheat', name: 'Whole Wheat Bread', category: 'grains', caloriesPer100g: 247, macrosPer100g: { protein: 13, carbs: 41, fat: 3.4, fiber: 7 }, defaultServingGrams: 30, servingDescription: '1 slice' },
  { id: 'bread-sourdough', name: 'Sourdough Bread', category: 'grains', caloriesPer100g: 274, macrosPer100g: { protein: 11, carbs: 51, fat: 3, fiber: 2 }, defaultServingGrams: 64, servingDescription: '1 slice' },
  { id: 'bread-rye', name: 'Rye Bread', category: 'grains', caloriesPer100g: 258, macrosPer100g: { protein: 9, carbs: 48, fat: 3, fiber: 6 }, defaultServingGrams: 32, servingDescription: '1 slice' },
  { id: 'bread-multigrain', name: 'Multigrain Bread', category: 'grains', caloriesPer100g: 265, macrosPer100g: { protein: 13, carbs: 43, fat: 4, fiber: 7 }, defaultServingGrams: 43, servingDescription: '1 slice' },
  { id: 'ciabatta', name: 'Ciabatta Bread', category: 'grains', caloriesPer100g: 271, macrosPer100g: { protein: 9, carbs: 50, fat: 4, fiber: 2 }, defaultServingGrams: 57, servingDescription: '1 roll' },
  { id: 'baguette', name: 'Baguette', category: 'grains', caloriesPer100g: 272, macrosPer100g: { protein: 9, carbs: 55, fat: 1, fiber: 2 }, defaultServingGrams: 64, servingDescription: '1 piece (4")' },
  { id: 'bagel', name: 'Bagel (plain)', category: 'grains', caloriesPer100g: 257, macrosPer100g: { protein: 10, carbs: 50, fat: 1.4, fiber: 2 }, defaultServingGrams: 98, servingDescription: '1 bagel' },
  { id: 'english-muffin', name: 'English Muffin', category: 'grains', caloriesPer100g: 223, macrosPer100g: { protein: 8, carbs: 44, fat: 1.8, fiber: 2.3 }, defaultServingGrams: 57, servingDescription: '1 muffin' },
  { id: 'croissant', name: 'Croissant', category: 'grains', caloriesPer100g: 406, macrosPer100g: { protein: 8, carbs: 45, fat: 21, fiber: 2 }, defaultServingGrams: 57, servingDescription: '1 croissant' },
  { id: 'pita-bread', name: 'Pita Bread', category: 'grains', caloriesPer100g: 275, macrosPer100g: { protein: 9, carbs: 55, fat: 1.2, fiber: 2 }, defaultServingGrams: 64, servingDescription: '1 pita (6.5")' },
  { id: 'naan', name: 'Naan Bread', category: 'grains', caloriesPer100g: 290, macrosPer100g: { protein: 9, carbs: 50, fat: 5, fiber: 2 }, defaultServingGrams: 90, servingDescription: '1 naan' },
  { id: 'flatbread', name: 'Flatbread', category: 'grains', caloriesPer100g: 297, macrosPer100g: { protein: 8, carbs: 54, fat: 5, fiber: 2 }, defaultServingGrams: 57, servingDescription: '1 flatbread' },
  { id: 'hamburger-bun', name: 'Hamburger Bun', category: 'grains', caloriesPer100g: 279, macrosPer100g: { protein: 9, carbs: 50, fat: 5, fiber: 2 }, defaultServingGrams: 43, servingDescription: '1 bun' },
  { id: 'hot-dog-bun', name: 'Hot Dog Bun', category: 'grains', caloriesPer100g: 279, macrosPer100g: { protein: 8, carbs: 51, fat: 4, fiber: 2 }, defaultServingGrams: 43, servingDescription: '1 bun' },
  { id: 'tortilla-flour', name: 'Flour Tortilla', category: 'grains', caloriesPer100g: 312, macrosPer100g: { protein: 8, carbs: 52, fat: 8, fiber: 2 }, defaultServingGrams: 45, servingDescription: '1 tortilla (8")' },
  { id: 'tortilla-corn', name: 'Corn Tortilla', category: 'grains', caloriesPer100g: 218, macrosPer100g: { protein: 5.7, carbs: 45, fat: 2.9, fiber: 6 }, defaultServingGrams: 26, servingDescription: '1 tortilla (6")' },
  { id: 'tortilla-lowcarb', name: 'Low-Carb Tortilla', category: 'grains', caloriesPer100g: 213, macrosPer100g: { protein: 9, carbs: 18, fat: 6, fiber: 15 }, defaultServingGrams: 45, servingDescription: '1 tortilla' },
  { id: 'taco-shell', name: 'Taco Shell (hard)', category: 'grains', caloriesPer100g: 496, macrosPer100g: { protein: 7, carbs: 63, fat: 24, fiber: 7 }, defaultServingGrams: 13, servingDescription: '1 shell' },
  { id: 'oatmeal', name: 'Oatmeal (cooked)', category: 'grains', caloriesPer100g: 68, macrosPer100g: { protein: 2.5, carbs: 12, fat: 1.4, fiber: 1.7 }, defaultServingGrams: 234, servingDescription: '1 cup cooked' },
  { id: 'oats-dry', name: 'Oats (dry)', category: 'grains', caloriesPer100g: 389, macrosPer100g: { protein: 17, carbs: 66, fat: 7, fiber: 10 }, defaultServingGrams: 40, servingDescription: '1/2 cup dry' },
  { id: 'steel-cut-oats', name: 'Steel Cut Oats (dry)', category: 'grains', caloriesPer100g: 379, macrosPer100g: { protein: 13, carbs: 68, fat: 6, fiber: 10 }, defaultServingGrams: 45, servingDescription: '1/4 cup dry' },
  { id: 'granola', name: 'Granola', category: 'grains', caloriesPer100g: 471, macrosPer100g: { protein: 10, carbs: 64, fat: 20, fiber: 7 }, defaultServingGrams: 61, servingDescription: '2/3 cup' },
  { id: 'muesli', name: 'Muesli', category: 'grains', caloriesPer100g: 340, macrosPer100g: { protein: 10, carbs: 66, fat: 6, fiber: 7 }, defaultServingGrams: 55, servingDescription: '1/2 cup' },
  { id: 'cereal-cheerios', name: 'Cheerios', category: 'grains', caloriesPer100g: 357, macrosPer100g: { protein: 12, carbs: 74, fat: 6, fiber: 10 }, defaultServingGrams: 28, servingDescription: '1 cup' },
  { id: 'cereal-corn-flakes', name: 'Corn Flakes', category: 'grains', caloriesPer100g: 357, macrosPer100g: { protein: 7, carbs: 84, fat: 0.4, fiber: 3 }, defaultServingGrams: 28, servingDescription: '1 cup' },
  { id: 'cereal-special-k', name: 'Special K', category: 'grains', caloriesPer100g: 379, macrosPer100g: { protein: 14, carbs: 79, fat: 1, fiber: 2 }, defaultServingGrams: 31, servingDescription: '1 cup' },
  { id: 'cereal-frosted-flakes', name: 'Frosted Flakes', category: 'grains', caloriesPer100g: 379, macrosPer100g: { protein: 4, carbs: 90, fat: 0, fiber: 2 }, defaultServingGrams: 30, servingDescription: '3/4 cup' },
  { id: 'cereal-raisin-bran', name: 'Raisin Bran', category: 'grains', caloriesPer100g: 321, macrosPer100g: { protein: 8, carbs: 78, fat: 2, fiber: 11 }, defaultServingGrams: 59, servingDescription: '1 cup' },
  { id: 'quinoa', name: 'Quinoa (cooked)', category: 'grains', caloriesPer100g: 120, macrosPer100g: { protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 }, defaultServingGrams: 185, servingDescription: '1 cup cooked' },
  { id: 'couscous', name: 'Couscous (cooked)', category: 'grains', caloriesPer100g: 112, macrosPer100g: { protein: 4, carbs: 23, fat: 0.2, fiber: 1.4 }, defaultServingGrams: 157, servingDescription: '1 cup cooked' },
  { id: 'bulgur', name: 'Bulgur (cooked)', category: 'grains', caloriesPer100g: 83, macrosPer100g: { protein: 3, carbs: 19, fat: 0.2, fiber: 4 }, defaultServingGrams: 182, servingDescription: '1 cup cooked' },
  { id: 'barley', name: 'Barley (cooked)', category: 'grains', caloriesPer100g: 123, macrosPer100g: { protein: 2, carbs: 28, fat: 0.4, fiber: 4 }, defaultServingGrams: 157, servingDescription: '1 cup cooked' },
  { id: 'farro', name: 'Farro (cooked)', category: 'grains', caloriesPer100g: 136, macrosPer100g: { protein: 5, carbs: 27, fat: 1, fiber: 3 }, defaultServingGrams: 173, servingDescription: '1 cup cooked' },
  { id: 'polenta', name: 'Polenta (cooked)', category: 'grains', caloriesPer100g: 85, macrosPer100g: { protein: 2, carbs: 18, fat: 0.3, fiber: 1 }, defaultServingGrams: 233, servingDescription: '1 cup' },
  { id: 'grits', name: 'Grits (cooked)', category: 'grains', caloriesPer100g: 71, macrosPer100g: { protein: 2, carbs: 15, fat: 0.5, fiber: 0.5 }, defaultServingGrams: 242, servingDescription: '1 cup cooked' },
  { id: 'potato', name: 'Potato (baked)', category: 'grains', caloriesPer100g: 93, macrosPer100g: { protein: 2.5, carbs: 21, fat: 0.1, fiber: 2.2 }, defaultServingGrams: 173, servingDescription: '1 medium potato' },
  { id: 'potato-boiled', name: 'Potato (boiled)', category: 'grains', caloriesPer100g: 87, macrosPer100g: { protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 }, defaultServingGrams: 150, servingDescription: '1 medium' },
  { id: 'mashed-potatoes', name: 'Mashed Potatoes', category: 'grains', caloriesPer100g: 83, macrosPer100g: { protein: 2, carbs: 15, fat: 2, fiber: 1.5 }, defaultServingGrams: 210, servingDescription: '1 cup' },
  { id: 'french-fries', name: 'French Fries', category: 'grains', caloriesPer100g: 312, macrosPer100g: { protein: 3, carbs: 41, fat: 15, fiber: 4 }, defaultServingGrams: 117, servingDescription: 'medium serving' },
  { id: 'hash-browns', name: 'Hash Browns', category: 'grains', caloriesPer100g: 265, macrosPer100g: { protein: 3, carbs: 28, fat: 16, fiber: 2 }, defaultServingGrams: 58, servingDescription: '1 patty' },
  { id: 'tater-tots', name: 'Tater Tots', category: 'grains', caloriesPer100g: 230, macrosPer100g: { protein: 2, carbs: 27, fat: 13, fiber: 2 }, defaultServingGrams: 85, servingDescription: '~9 tots' },
  { id: 'sweet-potato', name: 'Sweet Potato (baked)', category: 'grains', caloriesPer100g: 90, macrosPer100g: { protein: 2, carbs: 21, fat: 0.1, fiber: 3.3 }, defaultServingGrams: 130, servingDescription: '1 medium' },
  { id: 'yam', name: 'Yam', category: 'grains', caloriesPer100g: 116, macrosPer100g: { protein: 1.5, carbs: 28, fat: 0.1, fiber: 4 }, defaultServingGrams: 136, servingDescription: '1 cup cubed' },
  { id: 'plantain', name: 'Plantain (fried)', category: 'grains', caloriesPer100g: 267, macrosPer100g: { protein: 1, carbs: 37, fat: 14, fiber: 2 }, defaultServingGrams: 118, servingDescription: '1 cup sliced' },
  { id: 'crackers-saltine', name: 'Saltine Crackers', category: 'grains', caloriesPer100g: 421, macrosPer100g: { protein: 9, carbs: 72, fat: 11, fiber: 2 }, defaultServingGrams: 15, servingDescription: '5 crackers' },
  { id: 'crackers-ritz', name: 'Ritz Crackers', category: 'grains', caloriesPer100g: 500, macrosPer100g: { protein: 6, carbs: 59, fat: 26, fiber: 2 }, defaultServingGrams: 16, servingDescription: '5 crackers' },
  { id: 'crackers-wheat-thins', name: 'Wheat Thins', category: 'grains', caloriesPer100g: 462, macrosPer100g: { protein: 8, carbs: 68, fat: 18, fiber: 5 }, defaultServingGrams: 29, servingDescription: '16 crackers' },
  { id: 'crackers-triscuit', name: 'Triscuit', category: 'grains', caloriesPer100g: 414, macrosPer100g: { protein: 10, carbs: 69, fat: 14, fiber: 10 }, defaultServingGrams: 28, servingDescription: '6 crackers' },
  { id: 'rice-cake', name: 'Rice Cake', category: 'grains', caloriesPer100g: 387, macrosPer100g: { protein: 8, carbs: 83, fat: 3, fiber: 2 }, defaultServingGrams: 9, servingDescription: '1 cake' },
  { id: 'croutons', name: 'Croutons', category: 'grains', caloriesPer100g: 407, macrosPer100g: { protein: 12, carbs: 69, fat: 10, fiber: 5 }, defaultServingGrams: 7, servingDescription: '2 tbsp' },
  { id: 'breadcrumbs', name: 'Breadcrumbs', category: 'grains', caloriesPer100g: 395, macrosPer100g: { protein: 13, carbs: 72, fat: 5, fiber: 5 }, defaultServingGrams: 27, servingDescription: '1/4 cup' },
  { id: 'panko', name: 'Panko Breadcrumbs', category: 'grains', caloriesPer100g: 395, macrosPer100g: { protein: 9, carbs: 76, fat: 4, fiber: 3 }, defaultServingGrams: 30, servingDescription: '1/4 cup' },
  { id: 'stuffing', name: 'Stuffing (prepared)', category: 'grains', caloriesPer100g: 138, macrosPer100g: { protein: 3, carbs: 22, fat: 4, fiber: 2 }, defaultServingGrams: 108, servingDescription: '1/2 cup' },

  // PRODUCE - VEGETABLES
  { id: 'broccoli', name: 'Broccoli', category: 'produce', caloriesPer100g: 55, macrosPer100g: { protein: 3.7, carbs: 11, fat: 0.6, fiber: 2.6 }, defaultServingGrams: 91, servingDescription: '1 cup chopped' },
  { id: 'spinach', name: 'Spinach', category: 'produce', caloriesPer100g: 23, macrosPer100g: { protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }, defaultServingGrams: 30, servingDescription: '1 cup raw' },
  { id: 'kale', name: 'Kale', category: 'produce', caloriesPer100g: 35, macrosPer100g: { protein: 2.9, carbs: 4.4, fat: 1.5, fiber: 4.1 }, defaultServingGrams: 67, servingDescription: '1 cup chopped' },
  { id: 'lettuce-romaine', name: 'Romaine Lettuce', category: 'produce', caloriesPer100g: 17, macrosPer100g: { protein: 1.2, carbs: 3.3, fat: 0.3, fiber: 2.1 }, defaultServingGrams: 47, servingDescription: '1 cup shredded' },
  { id: 'lettuce-iceberg', name: 'Iceberg Lettuce', category: 'produce', caloriesPer100g: 14, macrosPer100g: { protein: 0.9, carbs: 3, fat: 0.1, fiber: 1.2 }, defaultServingGrams: 72, servingDescription: '1 cup shredded' },
  { id: 'arugula', name: 'Arugula', category: 'produce', caloriesPer100g: 25, macrosPer100g: { protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6 }, defaultServingGrams: 20, servingDescription: '1 cup' },
  { id: 'carrots', name: 'Carrots', category: 'produce', caloriesPer100g: 41, macrosPer100g: { protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 }, defaultServingGrams: 61, servingDescription: '1 medium' },
  { id: 'bell-pepper-red', name: 'Red Bell Pepper', category: 'produce', caloriesPer100g: 31, macrosPer100g: { protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 }, defaultServingGrams: 119, servingDescription: '1 medium' },
  { id: 'bell-pepper-green', name: 'Green Bell Pepper', category: 'produce', caloriesPer100g: 20, macrosPer100g: { protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7 }, defaultServingGrams: 119, servingDescription: '1 medium' },
  { id: 'tomato', name: 'Tomato', category: 'produce', caloriesPer100g: 18, macrosPer100g: { protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }, defaultServingGrams: 123, servingDescription: '1 medium' },
  { id: 'cherry-tomatoes', name: 'Cherry Tomatoes', category: 'produce', caloriesPer100g: 18, macrosPer100g: { protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }, defaultServingGrams: 149, servingDescription: '1 cup' },
  { id: 'cucumber', name: 'Cucumber', category: 'produce', caloriesPer100g: 15, macrosPer100g: { protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 }, defaultServingGrams: 104, servingDescription: '1/2 cucumber' },
  { id: 'celery', name: 'Celery', category: 'produce', caloriesPer100g: 14, macrosPer100g: { protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6 }, defaultServingGrams: 40, servingDescription: '1 stalk' },
  { id: 'onion-yellow', name: 'Yellow Onion', category: 'produce', caloriesPer100g: 40, macrosPer100g: { protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 }, defaultServingGrams: 110, servingDescription: '1 medium' },
  { id: 'onion-red', name: 'Red Onion', category: 'produce', caloriesPer100g: 40, macrosPer100g: { protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 }, defaultServingGrams: 94, servingDescription: '1 medium' },
  { id: 'garlic', name: 'Garlic', category: 'produce', caloriesPer100g: 149, macrosPer100g: { protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 }, defaultServingGrams: 3, servingDescription: '1 clove' },
  { id: 'mushrooms-white', name: 'White Mushrooms', category: 'produce', caloriesPer100g: 22, macrosPer100g: { protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 }, defaultServingGrams: 70, servingDescription: '1 cup sliced' },
  { id: 'mushrooms-portobello', name: 'Portobello Mushrooms', category: 'produce', caloriesPer100g: 22, macrosPer100g: { protein: 2.1, carbs: 3.9, fat: 0.4, fiber: 1.3 }, defaultServingGrams: 84, servingDescription: '1 cap' },
  { id: 'zucchini', name: 'Zucchini', category: 'produce', caloriesPer100g: 17, macrosPer100g: { protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 }, defaultServingGrams: 196, servingDescription: '1 medium' },
  { id: 'asparagus', name: 'Asparagus', category: 'produce', caloriesPer100g: 20, macrosPer100g: { protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1 }, defaultServingGrams: 134, servingDescription: '6 spears' },
  { id: 'green-beans', name: 'Green Beans', category: 'produce', caloriesPer100g: 31, macrosPer100g: { protein: 1.8, carbs: 7, fat: 0.2, fiber: 2.7 }, defaultServingGrams: 100, servingDescription: '1 cup' },
  { id: 'cauliflower', name: 'Cauliflower', category: 'produce', caloriesPer100g: 25, macrosPer100g: { protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 }, defaultServingGrams: 107, servingDescription: '1 cup' },
  { id: 'brussels-sprouts', name: 'Brussels Sprouts', category: 'produce', caloriesPer100g: 43, macrosPer100g: { protein: 3.4, carbs: 9, fat: 0.3, fiber: 3.8 }, defaultServingGrams: 88, servingDescription: '1 cup' },
  { id: 'cabbage', name: 'Cabbage', category: 'produce', caloriesPer100g: 25, macrosPer100g: { protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5 }, defaultServingGrams: 89, servingDescription: '1 cup shredded' },
  { id: 'eggplant', name: 'Eggplant', category: 'produce', caloriesPer100g: 25, macrosPer100g: { protein: 1, carbs: 6, fat: 0.2, fiber: 3 }, defaultServingGrams: 82, servingDescription: '1 cup cubed' },
  { id: 'squash-butternut', name: 'Butternut Squash', category: 'produce', caloriesPer100g: 45, macrosPer100g: { protein: 1, carbs: 12, fat: 0.1, fiber: 2 }, defaultServingGrams: 205, servingDescription: '1 cup cubed' },
  { id: 'corn', name: 'Corn (kernels)', category: 'produce', caloriesPer100g: 86, macrosPer100g: { protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7 }, defaultServingGrams: 154, servingDescription: '1 cup' },
  { id: 'peas', name: 'Peas (green)', category: 'produce', caloriesPer100g: 81, macrosPer100g: { protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.7 }, defaultServingGrams: 145, servingDescription: '1 cup' },
  { id: 'avocado', name: 'Avocado', category: 'produce', caloriesPer100g: 160, macrosPer100g: { protein: 2, carbs: 8.5, fat: 15, fiber: 6.7 }, defaultServingGrams: 136, servingDescription: '1/2 avocado' },
  { id: 'radish', name: 'Radish', category: 'produce', caloriesPer100g: 16, macrosPer100g: { protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6 }, defaultServingGrams: 116, servingDescription: '1 cup sliced' },
  { id: 'beets', name: 'Beets', category: 'produce', caloriesPer100g: 43, macrosPer100g: { protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8 }, defaultServingGrams: 136, servingDescription: '1 cup' },

  // PRODUCE - FRUITS
  { id: 'apple', name: 'Apple', category: 'produce', caloriesPer100g: 52, macrosPer100g: { protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }, defaultServingGrams: 182, servingDescription: '1 medium' },
  { id: 'banana', name: 'Banana', category: 'produce', caloriesPer100g: 89, macrosPer100g: { protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 }, defaultServingGrams: 118, servingDescription: '1 medium' },
  { id: 'orange', name: 'Orange', category: 'produce', caloriesPer100g: 47, macrosPer100g: { protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 }, defaultServingGrams: 131, servingDescription: '1 medium' },
  { id: 'grapes', name: 'Grapes', category: 'produce', caloriesPer100g: 69, macrosPer100g: { protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9 }, defaultServingGrams: 92, servingDescription: '1 cup' },
  { id: 'strawberries', name: 'Strawberries', category: 'produce', caloriesPer100g: 32, macrosPer100g: { protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 }, defaultServingGrams: 152, servingDescription: '1 cup' },
  { id: 'blueberries', name: 'Blueberries', category: 'produce', caloriesPer100g: 57, macrosPer100g: { protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 }, defaultServingGrams: 148, servingDescription: '1 cup' },
  { id: 'raspberries', name: 'Raspberries', category: 'produce', caloriesPer100g: 52, macrosPer100g: { protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5 }, defaultServingGrams: 123, servingDescription: '1 cup' },
  { id: 'blackberries', name: 'Blackberries', category: 'produce', caloriesPer100g: 43, macrosPer100g: { protein: 1.4, carbs: 10, fat: 0.5, fiber: 5.3 }, defaultServingGrams: 144, servingDescription: '1 cup' },
  { id: 'watermelon', name: 'Watermelon', category: 'produce', caloriesPer100g: 30, macrosPer100g: { protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4 }, defaultServingGrams: 152, servingDescription: '1 cup cubed' },
  { id: 'cantaloupe', name: 'Cantaloupe', category: 'produce', caloriesPer100g: 34, macrosPer100g: { protein: 0.8, carbs: 8, fat: 0.2, fiber: 0.9 }, defaultServingGrams: 177, servingDescription: '1 cup cubed' },
  { id: 'honeydew', name: 'Honeydew Melon', category: 'produce', caloriesPer100g: 36, macrosPer100g: { protein: 0.5, carbs: 9, fat: 0.1, fiber: 0.8 }, defaultServingGrams: 170, servingDescription: '1 cup cubed' },
  { id: 'pineapple', name: 'Pineapple', category: 'produce', caloriesPer100g: 50, macrosPer100g: { protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 }, defaultServingGrams: 165, servingDescription: '1 cup chunks' },
  { id: 'mango', name: 'Mango', category: 'produce', caloriesPer100g: 60, macrosPer100g: { protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 }, defaultServingGrams: 165, servingDescription: '1 cup sliced' },
  { id: 'peach', name: 'Peach', category: 'produce', caloriesPer100g: 39, macrosPer100g: { protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5 }, defaultServingGrams: 150, servingDescription: '1 medium' },
  { id: 'pear', name: 'Pear', category: 'produce', caloriesPer100g: 57, macrosPer100g: { protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1 }, defaultServingGrams: 178, servingDescription: '1 medium' },
  { id: 'plum', name: 'Plum', category: 'produce', caloriesPer100g: 46, macrosPer100g: { protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4 }, defaultServingGrams: 66, servingDescription: '1 medium' },
  { id: 'cherries', name: 'Cherries', category: 'produce', caloriesPer100g: 50, macrosPer100g: { protein: 1, carbs: 12, fat: 0.3, fiber: 1.6 }, defaultServingGrams: 138, servingDescription: '1 cup' },
  { id: 'kiwi', name: 'Kiwi', category: 'produce', caloriesPer100g: 61, macrosPer100g: { protein: 1.1, carbs: 15, fat: 0.5, fiber: 3 }, defaultServingGrams: 69, servingDescription: '1 medium' },
  { id: 'grapefruit', name: 'Grapefruit', category: 'produce', caloriesPer100g: 42, macrosPer100g: { protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6 }, defaultServingGrams: 123, servingDescription: '1/2 grapefruit' },
  { id: 'lemon', name: 'Lemon', category: 'produce', caloriesPer100g: 29, macrosPer100g: { protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8 }, defaultServingGrams: 58, servingDescription: '1 medium' },
  { id: 'lime', name: 'Lime', category: 'produce', caloriesPer100g: 30, macrosPer100g: { protein: 0.7, carbs: 11, fat: 0.2, fiber: 2.8 }, defaultServingGrams: 67, servingDescription: '1 medium' },

  // CONDIMENTS & SAUCES
  { id: 'ketchup', name: 'Ketchup', category: 'condiments', caloriesPer100g: 112, macrosPer100g: { protein: 1.2, carbs: 27, fat: 0.1, fiber: 0.3 }, defaultServingGrams: 17, servingDescription: '1 tbsp' },
  { id: 'mustard-yellow', name: 'Yellow Mustard', category: 'condiments', caloriesPer100g: 66, macrosPer100g: { protein: 4, carbs: 6, fat: 4, fiber: 2 }, defaultServingGrams: 15, servingDescription: '1 tbsp' },
  { id: 'mustard-dijon', name: 'Dijon Mustard', category: 'condiments', caloriesPer100g: 67, macrosPer100g: { protein: 4, carbs: 5, fat: 4, fiber: 3 }, defaultServingGrams: 15, servingDescription: '1 tbsp' },
  { id: 'mayo', name: 'Mayonnaise', category: 'condiments', caloriesPer100g: 680, macrosPer100g: { protein: 1, carbs: 0.6, fat: 75, fiber: 0 }, defaultServingGrams: 13, servingDescription: '1 tbsp' },
  { id: 'mayo-light', name: 'Light Mayo', category: 'condiments', caloriesPer100g: 360, macrosPer100g: { protein: 0.5, carbs: 14, fat: 32, fiber: 0 }, defaultServingGrams: 15, servingDescription: '1 tbsp' },
  { id: 'ranch-dressing', name: 'Ranch Dressing', category: 'condiments', caloriesPer100g: 483, macrosPer100g: { protein: 1.2, carbs: 6, fat: 50, fiber: 0 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'caesar-dressing', name: 'Caesar Dressing', category: 'condiments', caloriesPer100g: 477, macrosPer100g: { protein: 2, carbs: 4, fat: 50, fiber: 0 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'italian-dressing', name: 'Italian Dressing', category: 'condiments', caloriesPer100g: 235, macrosPer100g: { protein: 0, carbs: 8, fat: 22, fiber: 0 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'balsamic-vinegar', name: 'Balsamic Vinegar', category: 'condiments', caloriesPer100g: 88, macrosPer100g: { protein: 0.5, carbs: 17, fat: 0, fiber: 0 }, defaultServingGrams: 15, servingDescription: '1 tbsp' },
  { id: 'olive-oil', name: 'Olive Oil', category: 'condiments', caloriesPer100g: 884, macrosPer100g: { protein: 0, carbs: 0, fat: 100, fiber: 0 }, defaultServingGrams: 14, servingDescription: '1 tbsp' },
  { id: 'vegetable-oil', name: 'Vegetable Oil', category: 'condiments', caloriesPer100g: 884, macrosPer100g: { protein: 0, carbs: 0, fat: 100, fiber: 0 }, defaultServingGrams: 14, servingDescription: '1 tbsp' },
  { id: 'coconut-oil', name: 'Coconut Oil', category: 'condiments', caloriesPer100g: 892, macrosPer100g: { protein: 0, carbs: 0, fat: 100, fiber: 0 }, defaultServingGrams: 14, servingDescription: '1 tbsp' },
  { id: 'hot-sauce', name: 'Hot Sauce', category: 'condiments', caloriesPer100g: 12, macrosPer100g: { protein: 0.5, carbs: 1, fat: 0.2, fiber: 0.3 }, defaultServingGrams: 5, servingDescription: '1 tsp' },
  { id: 'bbq-sauce', name: 'BBQ Sauce', category: 'condiments', caloriesPer100g: 172, macrosPer100g: { protein: 1, carbs: 41, fat: 0.5, fiber: 1 }, defaultServingGrams: 32, servingDescription: '2 tbsp' },
  { id: 'soy-sauce', name: 'Soy Sauce', category: 'condiments', caloriesPer100g: 53, macrosPer100g: { protein: 5.6, carbs: 4.9, fat: 0, fiber: 0.8 }, defaultServingGrams: 16, servingDescription: '1 tbsp' },
  { id: 'teriyaki-sauce', name: 'Teriyaki Sauce', category: 'condiments', caloriesPer100g: 89, macrosPer100g: { protein: 5.9, carbs: 15, fat: 0, fiber: 0.2 }, defaultServingGrams: 18, servingDescription: '1 tbsp' },
  { id: 'salsa', name: 'Salsa', category: 'condiments', caloriesPer100g: 36, macrosPer100g: { protein: 1.5, carbs: 7, fat: 0.3, fiber: 1.7 }, defaultServingGrams: 32, servingDescription: '2 tbsp' },
  { id: 'guacamole', name: 'Guacamole', category: 'condiments', caloriesPer100g: 150, macrosPer100g: { protein: 2, carbs: 8, fat: 14, fiber: 6 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'hummus', name: 'Hummus', category: 'condiments', caloriesPer100g: 166, macrosPer100g: { protein: 8, carbs: 14, fat: 10, fiber: 6 }, defaultServingGrams: 30, servingDescription: '2 tbsp' },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'condiments', caloriesPer100g: 588, macrosPer100g: { protein: 25, carbs: 20, fat: 50, fiber: 6 }, defaultServingGrams: 32, servingDescription: '2 tbsp' },
  { id: 'almond-butter', name: 'Almond Butter', category: 'condiments', caloriesPer100g: 614, macrosPer100g: { protein: 21, carbs: 18, fat: 56, fiber: 10 }, defaultServingGrams: 32, servingDescription: '2 tbsp' },
  { id: 'honey', name: 'Honey', category: 'condiments', caloriesPer100g: 304, macrosPer100g: { protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 }, defaultServingGrams: 21, servingDescription: '1 tbsp' },
  { id: 'maple-syrup', name: 'Maple Syrup', category: 'condiments', caloriesPer100g: 260, macrosPer100g: { protein: 0, carbs: 67, fat: 0.1, fiber: 0 }, defaultServingGrams: 20, servingDescription: '1 tbsp' },
  { id: 'sriracha', name: 'Sriracha', category: 'condiments', caloriesPer100g: 93, macrosPer100g: { protein: 2, carbs: 18, fat: 1, fiber: 1 }, defaultServingGrams: 17, servingDescription: '1 tbsp' },
  { id: 'marinara-sauce', name: 'Marinara Sauce', category: 'condiments', caloriesPer100g: 44, macrosPer100g: { protein: 1.4, carbs: 7, fat: 1.5, fiber: 1.5 }, defaultServingGrams: 125, servingDescription: '1/2 cup' },
  { id: 'alfredo-sauce', name: 'Alfredo Sauce', category: 'condiments', caloriesPer100g: 167, macrosPer100g: { protein: 3, carbs: 5, fat: 15, fiber: 0.5 }, defaultServingGrams: 125, servingDescription: '1/2 cup' },

  // CANNED & LEGUMES
  { id: 'black-beans', name: 'Black Beans (canned)', category: 'canned', caloriesPer100g: 91, macrosPer100g: { protein: 6, carbs: 16, fat: 0.3, fiber: 6 }, defaultServingGrams: 172, servingDescription: '1 cup' },
  { id: 'kidney-beans', name: 'Kidney Beans (canned)', category: 'canned', caloriesPer100g: 127, macrosPer100g: { protein: 8.7, carbs: 22, fat: 0.5, fiber: 6.4 }, defaultServingGrams: 177, servingDescription: '1 cup' },
  { id: 'pinto-beans', name: 'Pinto Beans (canned)', category: 'canned', caloriesPer100g: 114, macrosPer100g: { protein: 7, carbs: 21, fat: 0.7, fiber: 7 }, defaultServingGrams: 171, servingDescription: '1 cup' },
  { id: 'chickpeas', name: 'Chickpeas (canned)', category: 'canned', caloriesPer100g: 139, macrosPer100g: { protein: 7.3, carbs: 23, fat: 2.1, fiber: 6.4 }, defaultServingGrams: 164, servingDescription: '1 cup' },
  { id: 'lentils', name: 'Lentils (cooked)', category: 'canned', caloriesPer100g: 116, macrosPer100g: { protein: 9, carbs: 20, fat: 0.4, fiber: 8 }, defaultServingGrams: 198, servingDescription: '1 cup' },
  { id: 'refried-beans', name: 'Refried Beans', category: 'canned', caloriesPer100g: 92, macrosPer100g: { protein: 5.5, carbs: 15, fat: 1.3, fiber: 6.7 }, defaultServingGrams: 126, servingDescription: '1/2 cup' },
  { id: 'tomato-sauce', name: 'Tomato Sauce (canned)', category: 'canned', caloriesPer100g: 24, macrosPer100g: { protein: 1.2, carbs: 5, fat: 0.2, fiber: 1.5 }, defaultServingGrams: 245, servingDescription: '1 cup' },
  { id: 'diced-tomatoes', name: 'Diced Tomatoes (canned)', category: 'canned', caloriesPer100g: 32, macrosPer100g: { protein: 1.6, carbs: 7, fat: 0.3, fiber: 2 }, defaultServingGrams: 240, servingDescription: '1 cup' },
  { id: 'tomato-paste', name: 'Tomato Paste', category: 'canned', caloriesPer100g: 82, macrosPer100g: { protein: 4.3, carbs: 19, fat: 0.5, fiber: 4.1 }, defaultServingGrams: 32, servingDescription: '2 tbsp' },
  { id: 'corn-canned', name: 'Corn (canned)', category: 'canned', caloriesPer100g: 79, macrosPer100g: { protein: 2.6, carbs: 18, fat: 1, fiber: 2.4 }, defaultServingGrams: 164, servingDescription: '1 cup' },
  { id: 'green-beans-canned', name: 'Green Beans (canned)', category: 'canned', caloriesPer100g: 23, macrosPer100g: { protein: 1.2, carbs: 5, fat: 0.1, fiber: 2 }, defaultServingGrams: 135, servingDescription: '1 cup' },
  { id: 'olives-black', name: 'Black Olives', category: 'canned', caloriesPer100g: 115, macrosPer100g: { protein: 0.8, carbs: 6, fat: 11, fiber: 3.2 }, defaultServingGrams: 34, servingDescription: '10 olives' },
  { id: 'olives-green', name: 'Green Olives', category: 'canned', caloriesPer100g: 145, macrosPer100g: { protein: 1, carbs: 4, fat: 15, fiber: 3.3 }, defaultServingGrams: 40, servingDescription: '10 olives' },
  { id: 'pickles', name: 'Pickles', category: 'canned', caloriesPer100g: 11, macrosPer100g: { protein: 0.3, carbs: 2.3, fat: 0.2, fiber: 1.2 }, defaultServingGrams: 35, servingDescription: '1 pickle' },
  { id: 'coconut-milk-canned', name: 'Coconut Milk (canned)', category: 'canned', caloriesPer100g: 230, macrosPer100g: { protein: 2.3, carbs: 6, fat: 24, fiber: 2.2 }, defaultServingGrams: 60, servingDescription: '1/4 cup' },

  // BEVERAGES
  { id: 'coffee-black', name: 'Black Coffee', category: 'beverages', caloriesPer100g: 1, macrosPer100g: { protein: 0.1, carbs: 0, fat: 0, fiber: 0 }, defaultServingGrams: 240, servingDescription: '1 cup' },
  { id: 'tea-black', name: 'Black Tea', category: 'beverages', caloriesPer100g: 1, macrosPer100g: { protein: 0, carbs: 0.3, fat: 0, fiber: 0 }, defaultServingGrams: 240, servingDescription: '1 cup' },
  { id: 'tea-green', name: 'Green Tea', category: 'beverages', caloriesPer100g: 0, macrosPer100g: { protein: 0, carbs: 0, fat: 0, fiber: 0 }, defaultServingGrams: 240, servingDescription: '1 cup' },
  { id: 'orange-juice', name: 'Orange Juice', category: 'beverages', caloriesPer100g: 45, macrosPer100g: { protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2 }, defaultServingGrams: 248, servingDescription: '1 cup' },
  { id: 'apple-juice', name: 'Apple Juice', category: 'beverages', caloriesPer100g: 46, macrosPer100g: { protein: 0.1, carbs: 11, fat: 0.1, fiber: 0.2 }, defaultServingGrams: 248, servingDescription: '1 cup' },
  { id: 'cranberry-juice', name: 'Cranberry Juice', category: 'beverages', caloriesPer100g: 46, macrosPer100g: { protein: 0, carbs: 12, fat: 0.1, fiber: 0 }, defaultServingGrams: 253, servingDescription: '1 cup' },
  { id: 'gatorade', name: 'Gatorade', category: 'beverages', caloriesPer100g: 25, macrosPer100g: { protein: 0, carbs: 6, fat: 0, fiber: 0 }, defaultServingGrams: 240, servingDescription: '1 cup' },
  { id: 'soda-regular', name: 'Soda (regular)', category: 'beverages', caloriesPer100g: 41, macrosPer100g: { protein: 0, carbs: 11, fat: 0, fiber: 0 }, defaultServingGrams: 355, servingDescription: '12 oz can' },
  { id: 'soda-diet', name: 'Diet Soda', category: 'beverages', caloriesPer100g: 0, macrosPer100g: { protein: 0, carbs: 0, fat: 0, fiber: 0 }, defaultServingGrams: 355, servingDescription: '12 oz can' },
  { id: 'energy-drink', name: 'Energy Drink', category: 'beverages', caloriesPer100g: 45, macrosPer100g: { protein: 0, carbs: 11, fat: 0, fiber: 0 }, defaultServingGrams: 248, servingDescription: '8.4 oz can' },
  { id: 'beer-regular', name: 'Beer (regular)', category: 'beverages', caloriesPer100g: 43, macrosPer100g: { protein: 0.5, carbs: 3.6, fat: 0, fiber: 0 }, defaultServingGrams: 355, servingDescription: '12 oz' },
  { id: 'beer-light', name: 'Light Beer', category: 'beverages', caloriesPer100g: 29, macrosPer100g: { protein: 0.2, carbs: 1.6, fat: 0, fiber: 0 }, defaultServingGrams: 355, servingDescription: '12 oz' },
  { id: 'wine-red', name: 'Red Wine', category: 'beverages', caloriesPer100g: 85, macrosPer100g: { protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 }, defaultServingGrams: 147, servingDescription: '5 oz glass' },
  { id: 'wine-white', name: 'White Wine', category: 'beverages', caloriesPer100g: 82, macrosPer100g: { protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 }, defaultServingGrams: 147, servingDescription: '5 oz glass' },
  { id: 'protein-shake', name: 'Protein Shake (whey)', category: 'beverages', caloriesPer100g: 107, macrosPer100g: { protein: 20, carbs: 3, fat: 2, fiber: 1 }, defaultServingGrams: 250, servingDescription: '1 scoop + water' },
  { id: 'smoothie-fruit', name: 'Fruit Smoothie', category: 'beverages', caloriesPer100g: 62, macrosPer100g: { protein: 1.5, carbs: 14, fat: 0.5, fiber: 1.5 }, defaultServingGrams: 240, servingDescription: '1 cup' },

  // FROZEN FOODS
  { id: 'pizza-cheese', name: 'Cheese Pizza (frozen)', category: 'frozen', caloriesPer100g: 266, macrosPer100g: { protein: 11, carbs: 33, fat: 10, fiber: 2 }, defaultServingGrams: 140, servingDescription: '1 slice' },
  { id: 'pizza-pepperoni', name: 'Pepperoni Pizza (frozen)', category: 'frozen', caloriesPer100g: 298, macrosPer100g: { protein: 12, carbs: 32, fat: 13, fiber: 2 }, defaultServingGrams: 140, servingDescription: '1 slice' },
  { id: 'chicken-nuggets-frozen', name: 'Chicken Nuggets (frozen)', category: 'frozen', caloriesPer100g: 296, macrosPer100g: { protein: 16, carbs: 18, fat: 18, fiber: 1 }, defaultServingGrams: 85, servingDescription: '6 nuggets' },
  { id: 'fish-sticks', name: 'Fish Sticks', category: 'frozen', caloriesPer100g: 250, macrosPer100g: { protein: 12, carbs: 20, fat: 13, fiber: 1 }, defaultServingGrams: 100, servingDescription: '4 sticks' },
  { id: 'frozen-vegetables', name: 'Mixed Vegetables (frozen)', category: 'frozen', caloriesPer100g: 65, macrosPer100g: { protein: 3, carbs: 13, fat: 0.5, fiber: 4 }, defaultServingGrams: 91, servingDescription: '2/3 cup' },
  { id: 'frozen-broccoli', name: 'Broccoli (frozen)', category: 'frozen', caloriesPer100g: 35, macrosPer100g: { protein: 2.8, carbs: 7, fat: 0.4, fiber: 3 }, defaultServingGrams: 91, servingDescription: '1 cup' },
  { id: 'frozen-berries', name: 'Mixed Berries (frozen)', category: 'frozen', caloriesPer100g: 42, macrosPer100g: { protein: 0.7, carbs: 10, fat: 0.3, fiber: 3.5 }, defaultServingGrams: 140, servingDescription: '1 cup' },
  { id: 'ice-cream-vanilla', name: 'Vanilla Ice Cream', category: 'frozen', caloriesPer100g: 207, macrosPer100g: { protein: 3.5, carbs: 24, fat: 11, fiber: 0.7 }, defaultServingGrams: 66, servingDescription: '1/2 cup' },
  { id: 'ice-cream-chocolate', name: 'Chocolate Ice Cream', category: 'frozen', caloriesPer100g: 216, macrosPer100g: { protein: 3.8, carbs: 28, fat: 11, fiber: 1.2 }, defaultServingGrams: 66, servingDescription: '1/2 cup' },
  { id: 'frozen-yogurt', name: 'Frozen Yogurt', category: 'frozen', caloriesPer100g: 159, macrosPer100g: { protein: 4, carbs: 31, fat: 2, fiber: 0 }, defaultServingGrams: 72, servingDescription: '1/2 cup' },
  { id: 'popsicle', name: 'Popsicle', category: 'frozen', caloriesPer100g: 37, macrosPer100g: { protein: 0, carbs: 9, fat: 0, fiber: 0 }, defaultServingGrams: 52, servingDescription: '1 popsicle' },
  { id: 'frozen-burrito', name: 'Frozen Burrito', category: 'frozen', caloriesPer100g: 203, macrosPer100g: { protein: 7, carbs: 28, fat: 7, fiber: 3 }, defaultServingGrams: 142, servingDescription: '1 burrito' },
  { id: 'hot-pocket', name: 'Hot Pocket', category: 'frozen', caloriesPer100g: 275, macrosPer100g: { protein: 10, carbs: 34, fat: 11, fiber: 2 }, defaultServingGrams: 127, servingDescription: '1 pocket' },

  // SNACKS & OTHER
  { id: 'potato-chips', name: 'Potato Chips', category: 'other', caloriesPer100g: 536, macrosPer100g: { protein: 7, carbs: 53, fat: 34, fiber: 4.5 }, defaultServingGrams: 28, servingDescription: '1 oz (~15 chips)' },
  { id: 'tortilla-chips', name: 'Tortilla Chips', category: 'other', caloriesPer100g: 489, macrosPer100g: { protein: 7, carbs: 66, fat: 21, fiber: 5 }, defaultServingGrams: 28, servingDescription: '1 oz (~10 chips)' },
  { id: 'pretzels', name: 'Pretzels', category: 'other', caloriesPer100g: 381, macrosPer100g: { protein: 10, carbs: 80, fat: 3, fiber: 3 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'popcorn-plain', name: 'Popcorn (air-popped)', category: 'other', caloriesPer100g: 387, macrosPer100g: { protein: 13, carbs: 78, fat: 4.5, fiber: 15 }, defaultServingGrams: 8, servingDescription: '1 cup' },
  { id: 'popcorn-butter', name: 'Buttered Popcorn', category: 'other', caloriesPer100g: 500, macrosPer100g: { protein: 9, carbs: 58, fat: 28, fiber: 10 }, defaultServingGrams: 11, servingDescription: '1 cup' },
  { id: 'trail-mix', name: 'Trail Mix', category: 'other', caloriesPer100g: 462, macrosPer100g: { protein: 13, carbs: 45, fat: 29, fiber: 5 }, defaultServingGrams: 38, servingDescription: '1/4 cup' },
  { id: 'almonds', name: 'Almonds', category: 'other', caloriesPer100g: 579, macrosPer100g: { protein: 21, carbs: 22, fat: 50, fiber: 12 }, defaultServingGrams: 28, servingDescription: '1 oz (~23 nuts)' },
  { id: 'cashews', name: 'Cashews', category: 'other', caloriesPer100g: 553, macrosPer100g: { protein: 18, carbs: 30, fat: 44, fiber: 3 }, defaultServingGrams: 28, servingDescription: '1 oz (~18 nuts)' },
  { id: 'peanuts', name: 'Peanuts', category: 'other', caloriesPer100g: 567, macrosPer100g: { protein: 26, carbs: 16, fat: 49, fiber: 9 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'walnuts', name: 'Walnuts', category: 'other', caloriesPer100g: 654, macrosPer100g: { protein: 15, carbs: 14, fat: 65, fiber: 7 }, defaultServingGrams: 28, servingDescription: '1 oz (~14 halves)' },
  { id: 'pecans', name: 'Pecans', category: 'other', caloriesPer100g: 691, macrosPer100g: { protein: 9, carbs: 14, fat: 72, fiber: 10 }, defaultServingGrams: 28, servingDescription: '1 oz (~19 halves)' },
  { id: 'pistachios', name: 'Pistachios', category: 'other', caloriesPer100g: 560, macrosPer100g: { protein: 20, carbs: 28, fat: 45, fiber: 10 }, defaultServingGrams: 28, servingDescription: '1 oz (~49 nuts)' },
  { id: 'sunflower-seeds', name: 'Sunflower Seeds', category: 'other', caloriesPer100g: 584, macrosPer100g: { protein: 21, carbs: 20, fat: 51, fiber: 9 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'chocolate-bar', name: 'Chocolate Bar (milk)', category: 'other', caloriesPer100g: 535, macrosPer100g: { protein: 8, carbs: 59, fat: 30, fiber: 3 }, defaultServingGrams: 43, servingDescription: '1 bar' },
  { id: 'dark-chocolate', name: 'Dark Chocolate (70%)', category: 'other', caloriesPer100g: 598, macrosPer100g: { protein: 8, carbs: 46, fat: 43, fiber: 11 }, defaultServingGrams: 28, servingDescription: '1 oz' },
  { id: 'candy-mms', name: 'M&Ms', category: 'other', caloriesPer100g: 492, macrosPer100g: { protein: 4, carbs: 70, fat: 21, fiber: 3 }, defaultServingGrams: 42, servingDescription: '1 package' },
  { id: 'candy-skittles', name: 'Skittles', category: 'other', caloriesPer100g: 405, macrosPer100g: { protein: 0, carbs: 91, fat: 4, fiber: 0 }, defaultServingGrams: 61, servingDescription: '1 package' },
  { id: 'gummy-bears', name: 'Gummy Bears', category: 'other', caloriesPer100g: 343, macrosPer100g: { protein: 0, carbs: 86, fat: 0, fiber: 0 }, defaultServingGrams: 40, servingDescription: '10 bears' },
  { id: 'protein-bar', name: 'Protein Bar', category: 'other', caloriesPer100g: 400, macrosPer100g: { protein: 20, carbs: 40, fat: 15, fiber: 5 }, defaultServingGrams: 60, servingDescription: '1 bar' },
  { id: 'granola-bar', name: 'Granola Bar', category: 'other', caloriesPer100g: 471, macrosPer100g: { protein: 7, carbs: 64, fat: 21, fiber: 4 }, defaultServingGrams: 21, servingDescription: '1 bar' },
  { id: 'oreos', name: 'Oreo Cookies', category: 'other', caloriesPer100g: 478, macrosPer100g: { protein: 4, carbs: 69, fat: 21, fiber: 2 }, defaultServingGrams: 34, servingDescription: '3 cookies' },
  { id: 'chips-ahoy', name: 'Chips Ahoy Cookies', category: 'other', caloriesPer100g: 500, macrosPer100g: { protein: 5, carbs: 67, fat: 24, fiber: 2 }, defaultServingGrams: 32, servingDescription: '3 cookies' },
  { id: 'brownie', name: 'Brownie', category: 'other', caloriesPer100g: 466, macrosPer100g: { protein: 6, carbs: 60, fat: 24, fiber: 3 }, defaultServingGrams: 56, servingDescription: '1 brownie' },
  { id: 'donut-glazed', name: 'Glazed Donut', category: 'other', caloriesPer100g: 452, macrosPer100g: { protein: 5, carbs: 51, fat: 25, fiber: 1 }, defaultServingGrams: 52, servingDescription: '1 donut' },
  { id: 'muffin-blueberry', name: 'Blueberry Muffin', category: 'other', caloriesPer100g: 377, macrosPer100g: { protein: 6, carbs: 54, fat: 16, fiber: 2 }, defaultServingGrams: 113, servingDescription: '1 muffin' },
  { id: 'pop-tart', name: 'Pop-Tart', category: 'other', caloriesPer100g: 392, macrosPer100g: { protein: 4, carbs: 71, fat: 10, fiber: 1 }, defaultServingGrams: 50, servingDescription: '1 pastry' },

  // SPICES & HERBS (low/zero calorie - minimal impact)
  { id: 'salt', name: 'Salt', category: 'spices', caloriesPer100g: 0, macrosPer100g: { protein: 0, carbs: 0, fat: 0, fiber: 0 }, defaultServingGrams: 6, servingDescription: '1 tsp' },
  { id: 'black-pepper', name: 'Black Pepper', category: 'spices', caloriesPer100g: 251, macrosPer100g: { protein: 10, carbs: 64, fat: 3, fiber: 25 }, defaultServingGrams: 2, servingDescription: '1 tsp' },
  { id: 'garlic-powder', name: 'Garlic Powder', category: 'spices', caloriesPer100g: 331, macrosPer100g: { protein: 17, carbs: 73, fat: 1, fiber: 9 }, defaultServingGrams: 3, servingDescription: '1 tsp' },
  { id: 'onion-powder', name: 'Onion Powder', category: 'spices', caloriesPer100g: 341, macrosPer100g: { protein: 10, carbs: 79, fat: 1, fiber: 15 }, defaultServingGrams: 2, servingDescription: '1 tsp' },
  { id: 'paprika', name: 'Paprika', category: 'spices', caloriesPer100g: 282, macrosPer100g: { protein: 14, carbs: 54, fat: 13, fiber: 34 }, defaultServingGrams: 2, servingDescription: '1 tsp' },
  { id: 'cumin', name: 'Cumin', category: 'spices', caloriesPer100g: 375, macrosPer100g: { protein: 18, carbs: 44, fat: 22, fiber: 11 }, defaultServingGrams: 2, servingDescription: '1 tsp' },
  { id: 'chili-powder', name: 'Chili Powder', category: 'spices', caloriesPer100g: 282, macrosPer100g: { protein: 13, carbs: 50, fat: 14, fiber: 35 }, defaultServingGrams: 3, servingDescription: '1 tsp' },
  { id: 'cinnamon', name: 'Cinnamon', category: 'spices', caloriesPer100g: 247, macrosPer100g: { protein: 4, carbs: 81, fat: 1, fiber: 53 }, defaultServingGrams: 3, servingDescription: '1 tsp' },
  { id: 'oregano', name: 'Oregano', category: 'spices', caloriesPer100g: 265, macrosPer100g: { protein: 9, carbs: 69, fat: 4, fiber: 43 }, defaultServingGrams: 1, servingDescription: '1 tsp' },
  { id: 'basil-dried', name: 'Dried Basil', category: 'spices', caloriesPer100g: 233, macrosPer100g: { protein: 23, carbs: 48, fat: 4, fiber: 38 }, defaultServingGrams: 1, servingDescription: '1 tsp' },
  { id: 'parsley-dried', name: 'Dried Parsley', category: 'spices', caloriesPer100g: 292, macrosPer100g: { protein: 27, carbs: 51, fat: 6, fiber: 27 }, defaultServingGrams: 1, servingDescription: '1 tsp' },
  { id: 'thyme', name: 'Thyme', category: 'spices', caloriesPer100g: 276, macrosPer100g: { protein: 9, carbs: 64, fat: 7, fiber: 37 }, defaultServingGrams: 1, servingDescription: '1 tsp' },
  { id: 'rosemary', name: 'Rosemary', category: 'spices', caloriesPer100g: 331, macrosPer100g: { protein: 5, carbs: 64, fat: 15, fiber: 43 }, defaultServingGrams: 1, servingDescription: '1 tsp' },
];

// Restaurant meals organized by chain
export const RESTAURANT_MEALS: RestaurantMeal[] = [
  // McDonald's
  { id: 'mcd-big-mac', restaurant: "McDonald's", name: 'Big Mac', calories: 590, macros: { protein: 25, carbs: 46, fat: 34, fiber: 3 }, category: 'lunch' },
  { id: 'mcd-quarter-pounder', restaurant: "McDonald's", name: 'Quarter Pounder w/ Cheese', calories: 530, macros: { protein: 30, carbs: 42, fat: 27, fiber: 2 }, category: 'lunch' },
  { id: 'mcd-mcchicken', restaurant: "McDonald's", name: 'McChicken', calories: 400, macros: { protein: 14, carbs: 40, fat: 21, fiber: 2 }, category: 'lunch' },
  { id: 'mcd-large-fries', restaurant: "McDonald's", name: 'Large Fries', calories: 490, macros: { protein: 7, carbs: 66, fat: 23, fiber: 6 }, category: 'snack' },
  { id: 'mcd-egg-mcmuffin', restaurant: "McDonald's", name: 'Egg McMuffin', calories: 310, macros: { protein: 17, carbs: 30, fat: 13, fiber: 2 }, category: 'breakfast' },
  { id: 'mcd-sausage-mcmuffin', restaurant: "McDonald's", name: 'Sausage McMuffin w/ Egg', calories: 480, macros: { protein: 21, carbs: 29, fat: 30, fiber: 2 }, category: 'breakfast' },
  { id: 'mcd-hash-brown', restaurant: "McDonald's", name: 'Hash Brown', calories: 150, macros: { protein: 2, carbs: 15, fat: 9, fiber: 2 }, category: 'breakfast' },
  { id: 'mcd-nuggets-10', restaurant: "McDonald's", name: 'Chicken McNuggets (10 pc)', calories: 420, macros: { protein: 24, carbs: 25, fat: 25, fiber: 1 }, category: 'lunch' },

  // Chick-fil-A
  { id: 'cfa-sandwich', restaurant: 'Chick-fil-A', name: 'Chicken Sandwich', calories: 440, macros: { protein: 28, carbs: 40, fat: 18, fiber: 1 }, category: 'lunch' },
  { id: 'cfa-deluxe', restaurant: 'Chick-fil-A', name: 'Deluxe Sandwich', calories: 500, macros: { protein: 29, carbs: 42, fat: 22, fiber: 2 }, category: 'lunch' },
  { id: 'cfa-spicy-sandwich', restaurant: 'Chick-fil-A', name: 'Spicy Chicken Sandwich', calories: 450, macros: { protein: 28, carbs: 44, fat: 18, fiber: 2 }, category: 'lunch' },
  { id: 'cfa-nuggets-12', restaurant: 'Chick-fil-A', name: 'Nuggets (12 ct)', calories: 380, macros: { protein: 40, carbs: 14, fat: 18, fiber: 1 }, category: 'lunch' },
  { id: 'cfa-waffle-fries-med', restaurant: 'Chick-fil-A', name: 'Waffle Fries (Medium)', calories: 420, macros: { protein: 5, carbs: 45, fat: 24, fiber: 5 }, category: 'snack' },
  { id: 'cfa-chicken-biscuit', restaurant: 'Chick-fil-A', name: 'Chicken Biscuit', calories: 460, macros: { protein: 18, carbs: 48, fat: 21, fiber: 2 }, category: 'breakfast' },
  { id: 'cfa-hash-browns', restaurant: 'Chick-fil-A', name: 'Hash Browns', calories: 270, macros: { protein: 2, carbs: 23, fat: 18, fiber: 2 }, category: 'breakfast' },

  // Chipotle
  { id: 'chipotle-chicken-bowl', restaurant: 'Chipotle', name: 'Chicken Bowl (rice, beans, salsa)', calories: 680, macros: { protein: 43, carbs: 63, fat: 24, fiber: 12 }, category: 'lunch' },
  { id: 'chipotle-steak-bowl', restaurant: 'Chipotle', name: 'Steak Bowl (rice, beans, salsa)', calories: 690, macros: { protein: 38, carbs: 63, fat: 26, fiber: 12 }, category: 'lunch' },
  { id: 'chipotle-chicken-burrito', restaurant: 'Chipotle', name: 'Chicken Burrito', calories: 1010, macros: { protein: 52, carbs: 103, fat: 40, fiber: 15 }, category: 'lunch' },
  { id: 'chipotle-carnitas-tacos', restaurant: 'Chipotle', name: 'Carnitas Tacos (3)', calories: 555, macros: { protein: 25, carbs: 39, fat: 33, fiber: 6 }, category: 'lunch' },
  { id: 'chipotle-chips-guac', restaurant: 'Chipotle', name: 'Chips & Guacamole', calories: 770, macros: { protein: 10, carbs: 69, fat: 51, fiber: 14 }, category: 'snack' },

  // Starbucks
  { id: 'sbux-latte-grande', restaurant: 'Starbucks', name: 'Caffè Latte (Grande)', calories: 190, macros: { protein: 13, carbs: 18, fat: 7, fiber: 0 }, category: 'drink' },
  { id: 'sbux-mocha-grande', restaurant: 'Starbucks', name: 'Caffè Mocha (Grande)', calories: 360, macros: { protein: 13, carbs: 44, fat: 14, fiber: 3 }, category: 'drink' },
  { id: 'sbux-frapp-caramel', restaurant: 'Starbucks', name: 'Caramel Frappuccino (Grande)', calories: 380, macros: { protein: 5, carbs: 57, fat: 15, fiber: 0 }, category: 'drink' },
  { id: 'sbux-croissant', restaurant: 'Starbucks', name: 'Butter Croissant', calories: 260, macros: { protein: 5, carbs: 30, fat: 14, fiber: 1 }, category: 'breakfast' },
  { id: 'sbux-bacon-sandwich', restaurant: 'Starbucks', name: 'Bacon, Gouda & Egg Sandwich', calories: 370, macros: { protein: 19, carbs: 34, fat: 18, fiber: 1 }, category: 'breakfast' },
  { id: 'sbux-cake-pop', restaurant: 'Starbucks', name: 'Birthday Cake Pop', calories: 180, macros: { protein: 2, carbs: 22, fat: 9, fiber: 0 }, category: 'snack' },

  // Subway
  { id: 'subway-italian-bmt', restaurant: 'Subway', name: 'Italian B.M.T. (6")', calories: 410, macros: { protein: 20, carbs: 43, fat: 18, fiber: 3 }, category: 'lunch' },
  { id: 'subway-turkey', restaurant: 'Subway', name: 'Turkey Breast (6")', calories: 280, macros: { protein: 18, carbs: 41, fat: 4, fiber: 3 }, category: 'lunch' },
  { id: 'subway-chicken-teriyaki', restaurant: 'Subway', name: 'Sweet Onion Chicken Teriyaki (6")', calories: 370, macros: { protein: 26, carbs: 52, fat: 5, fiber: 4 }, category: 'lunch' },
  { id: 'subway-meatball', restaurant: 'Subway', name: 'Meatball Marinara (6")', calories: 480, macros: { protein: 22, carbs: 52, fat: 20, fiber: 5 }, category: 'lunch' },
  { id: 'subway-veggie-delite', restaurant: 'Subway', name: 'Veggie Delite (6")', calories: 230, macros: { protein: 8, carbs: 40, fat: 3, fiber: 4 }, category: 'lunch' },
  { id: 'subway-cookie', restaurant: 'Subway', name: 'Chocolate Chip Cookie', calories: 200, macros: { protein: 2, carbs: 28, fat: 9, fiber: 1 }, category: 'snack' },

  // Taco Bell
  { id: 'tb-crunchy-taco', restaurant: 'Taco Bell', name: 'Crunchy Taco', calories: 170, macros: { protein: 8, carbs: 13, fat: 10, fiber: 2 }, category: 'lunch' },
  { id: 'tb-burrito-supreme', restaurant: 'Taco Bell', name: 'Burrito Supreme (Beef)', calories: 390, macros: { protein: 15, carbs: 42, fat: 17, fiber: 5 }, category: 'lunch' },
  { id: 'tb-crunchwrap', restaurant: 'Taco Bell', name: 'Crunchwrap Supreme', calories: 530, macros: { protein: 16, carbs: 53, fat: 24, fiber: 4 }, category: 'lunch' },
  { id: 'tb-quesadilla-chicken', restaurant: 'Taco Bell', name: 'Chicken Quesadilla', calories: 500, macros: { protein: 27, carbs: 37, fat: 28, fiber: 3 }, category: 'lunch' },
  { id: 'tb-nachos-bellgrande', restaurant: 'Taco Bell', name: 'Nachos BellGrande', calories: 740, macros: { protein: 16, carbs: 80, fat: 38, fiber: 11 }, category: 'snack' },
  { id: 'tb-cheesy-gordita', restaurant: 'Taco Bell', name: 'Cheesy Gordita Crunch', calories: 500, macros: { protein: 19, carbs: 40, fat: 28, fiber: 4 }, category: 'lunch' },

  // Wendy's
  { id: 'wendys-baconator', restaurant: "Wendy's", name: 'Baconator', calories: 950, macros: { protein: 57, carbs: 38, fat: 65, fiber: 1 }, category: 'lunch' },
  { id: 'wendys-dave-single', restaurant: "Wendy's", name: "Dave's Single", calories: 570, macros: { protein: 30, carbs: 39, fat: 34, fiber: 2 }, category: 'lunch' },
  { id: 'wendys-jr-bacon', restaurant: "Wendy's", name: 'Jr. Bacon Cheeseburger', calories: 370, macros: { protein: 18, carbs: 26, fat: 22, fiber: 1 }, category: 'lunch' },
  { id: 'wendys-spicy-chicken', restaurant: "Wendy's", name: 'Spicy Chicken Sandwich', calories: 500, macros: { protein: 30, carbs: 47, fat: 21, fiber: 3 }, category: 'lunch' },
  { id: 'wendys-nuggets-10', restaurant: "Wendy's", name: 'Chicken Nuggets (10 pc)', calories: 450, macros: { protein: 23, carbs: 28, fat: 28, fiber: 0 }, category: 'lunch' },
  { id: 'wendys-frosty-med', restaurant: "Wendy's", name: 'Chocolate Frosty (Medium)', calories: 460, macros: { protein: 11, carbs: 76, fat: 12, fiber: 1 }, category: 'snack' },
  { id: 'wendys-baked-potato', restaurant: "Wendy's", name: 'Baked Potato (plain)', calories: 270, macros: { protein: 7, carbs: 61, fat: 0, fiber: 6 }, category: 'lunch' },

  // Panera Bread
  { id: 'panera-broccoli-soup', restaurant: 'Panera Bread', name: 'Broccoli Cheddar Soup (Bowl)', calories: 360, macros: { protein: 14, carbs: 29, fat: 21, fiber: 6 }, category: 'lunch' },
  { id: 'panera-mac-cheese', restaurant: 'Panera Bread', name: 'Mac & Cheese (Bowl)', calories: 690, macros: { protein: 23, carbs: 61, fat: 40, fiber: 2 }, category: 'lunch' },
  { id: 'panera-caesar-salad', restaurant: 'Panera Bread', name: 'Caesar Salad w/ Chicken', calories: 470, macros: { protein: 33, carbs: 21, fat: 30, fiber: 5 }, category: 'lunch' },
  { id: 'panera-turkey-avocado', restaurant: 'Panera Bread', name: 'Turkey Avocado BLT', calories: 620, macros: { protein: 30, carbs: 54, fat: 32, fiber: 5 }, category: 'lunch' },
  { id: 'panera-bagel-cc', restaurant: 'Panera Bread', name: 'Bagel with Cream Cheese', calories: 450, macros: { protein: 12, carbs: 64, fat: 16, fiber: 2 }, category: 'breakfast' },

  // Panda Express
  { id: 'panda-orange-chicken', restaurant: 'Panda Express', name: 'Orange Chicken', calories: 490, macros: { protein: 25, carbs: 51, fat: 21, fiber: 2 }, category: 'lunch' },
  { id: 'panda-beijing-beef', restaurant: 'Panda Express', name: 'Beijing Beef', calories: 470, macros: { protein: 14, carbs: 56, fat: 22, fiber: 1 }, category: 'lunch' },
  { id: 'panda-teriyaki-chicken', restaurant: 'Panda Express', name: 'Grilled Teriyaki Chicken', calories: 300, macros: { protein: 36, carbs: 11, fat: 13, fiber: 1 }, category: 'lunch' },
  { id: 'panda-fried-rice', restaurant: 'Panda Express', name: 'Fried Rice', calories: 530, macros: { protein: 11, carbs: 82, fat: 17, fiber: 1 }, category: 'lunch' },
  { id: 'panda-chow-mein', restaurant: 'Panda Express', name: 'Chow Mein', calories: 500, macros: { protein: 13, carbs: 80, fat: 15, fiber: 7 }, category: 'lunch' },
  { id: 'panda-broccoli-beef', restaurant: 'Panda Express', name: 'Broccoli Beef', calories: 150, macros: { protein: 10, carbs: 13, fat: 7, fiber: 3 }, category: 'lunch' },

  // In-N-Out
  { id: 'ino-double-double', restaurant: 'In-N-Out', name: 'Double-Double', calories: 670, macros: { protein: 37, carbs: 39, fat: 41, fiber: 3 }, category: 'lunch' },
  { id: 'ino-cheeseburger', restaurant: 'In-N-Out', name: 'Cheeseburger', calories: 480, macros: { protein: 22, carbs: 39, fat: 27, fiber: 3 }, category: 'lunch' },
  { id: 'ino-protein-style', restaurant: 'In-N-Out', name: 'Double-Double Protein Style', calories: 520, macros: { protein: 33, carbs: 11, fat: 39, fiber: 3 }, category: 'lunch' },
  { id: 'ino-fries', restaurant: 'In-N-Out', name: 'French Fries', calories: 395, macros: { protein: 7, carbs: 54, fat: 18, fiber: 2 }, category: 'snack' },
  { id: 'ino-shake-vanilla', restaurant: 'In-N-Out', name: 'Vanilla Shake', calories: 580, macros: { protein: 15, carbs: 78, fat: 31, fiber: 0 }, category: 'drink' },

  // Five Guys
  { id: 'fg-cheeseburger', restaurant: 'Five Guys', name: 'Cheeseburger', calories: 840, macros: { protein: 47, carbs: 40, fat: 55, fiber: 2 }, category: 'lunch' },
  { id: 'fg-little-cheeseburger', restaurant: 'Five Guys', name: 'Little Cheeseburger', calories: 550, macros: { protein: 27, carbs: 39, fat: 32, fiber: 2 }, category: 'lunch' },
  { id: 'fg-bacon-burger', restaurant: 'Five Guys', name: 'Bacon Burger', calories: 920, macros: { protein: 51, carbs: 39, fat: 62, fiber: 2 }, category: 'lunch' },
  { id: 'fg-fries-reg', restaurant: 'Five Guys', name: 'Regular Fries', calories: 526, macros: { protein: 7, carbs: 70, fat: 24, fiber: 6 }, category: 'snack' },
  { id: 'fg-hot-dog', restaurant: 'Five Guys', name: 'Hot Dog', calories: 545, macros: { protein: 18, carbs: 40, fat: 35, fiber: 2 }, category: 'lunch' },

  // HEALTHY CHAINS
  // Sweetgreen
  { id: 'sg-harvest-bowl', restaurant: 'Sweetgreen', name: 'Harvest Bowl', calories: 705, macros: { protein: 26, carbs: 48, fat: 44, fiber: 8 }, category: 'lunch' },
  { id: 'sg-kale-caesar', restaurant: 'Sweetgreen', name: 'Kale Caesar', calories: 450, macros: { protein: 25, carbs: 25, fat: 28, fiber: 5 }, category: 'lunch' },
  { id: 'sg-guacamole-greens', restaurant: 'Sweetgreen', name: 'Guacamole Greens', calories: 535, macros: { protein: 22, carbs: 38, fat: 34, fiber: 12 }, category: 'lunch' },
  { id: 'sg-chicken-pesto', restaurant: 'Sweetgreen', name: 'Chicken Pesto Parm', calories: 620, macros: { protein: 42, carbs: 35, fat: 35, fiber: 6 }, category: 'lunch' },
  { id: 'sg-shroomami', restaurant: 'Sweetgreen', name: 'Shroomami', calories: 540, macros: { protein: 15, carbs: 62, fat: 26, fiber: 8 }, category: 'lunch' },

  // CAVA
  { id: 'cava-greens-grain', restaurant: 'CAVA', name: 'Greens + Grains Bowl', calories: 620, macros: { protein: 35, carbs: 55, fat: 28, fiber: 10 }, category: 'lunch' },
  { id: 'cava-chicken-bowl', restaurant: 'CAVA', name: 'Grilled Chicken Bowl', calories: 580, macros: { protein: 42, carbs: 45, fat: 24, fiber: 8 }, category: 'lunch' },
  { id: 'cava-falafel-bowl', restaurant: 'CAVA', name: 'Falafel Bowl', calories: 650, macros: { protein: 18, carbs: 72, fat: 32, fiber: 14 }, category: 'lunch' },
  { id: 'cava-lamb-bowl', restaurant: 'CAVA', name: 'Braised Lamb Bowl', calories: 710, macros: { protein: 38, carbs: 52, fat: 38, fiber: 9 }, category: 'lunch' },
  { id: 'cava-pita', restaurant: 'CAVA', name: 'Chicken Pita', calories: 520, macros: { protein: 32, carbs: 48, fat: 20, fiber: 4 }, category: 'lunch' },

  // Freshii
  { id: 'freshii-buddha', restaurant: 'Freshii', name: 'Buddha Satay Bowl', calories: 490, macros: { protein: 22, carbs: 58, fat: 18, fiber: 9 }, category: 'lunch' },
  { id: 'freshii-pangoa', restaurant: 'Freshii', name: 'Pangoa Bowl', calories: 520, macros: { protein: 28, carbs: 52, fat: 22, fiber: 10 }, category: 'lunch' },
  { id: 'freshii-teriyaki', restaurant: 'Freshii', name: 'Teriyaki Twist Bowl', calories: 460, macros: { protein: 32, carbs: 48, fat: 14, fiber: 6 }, category: 'lunch' },
  { id: 'freshii-energia', restaurant: 'Freshii', name: 'Energii Bites (3)', calories: 180, macros: { protein: 5, carbs: 22, fat: 8, fiber: 3 }, category: 'snack' },

  // Just Salad
  { id: 'js-thai-chicken', restaurant: 'Just Salad', name: 'Thai Chicken Crunch', calories: 480, macros: { protein: 38, carbs: 32, fat: 24, fiber: 8 }, category: 'lunch' },
  { id: 'js-crispy-chicken', restaurant: 'Just Salad', name: 'Crispy Chicken Poblano', calories: 560, macros: { protein: 35, carbs: 42, fat: 28, fiber: 7 }, category: 'lunch' },
  { id: 'js-tokyo-supergreen', restaurant: 'Just Salad', name: 'Tokyo Supergreen', calories: 420, macros: { protein: 28, carbs: 38, fat: 18, fiber: 9 }, category: 'lunch' },

  // Tender Greens
  { id: 'tg-happy-vegan', restaurant: 'Tender Greens', name: 'Happy Vegan Bowl', calories: 450, macros: { protein: 14, carbs: 52, fat: 22, fiber: 12 }, category: 'lunch' },
  { id: 'tg-steak-salad', restaurant: 'Tender Greens', name: 'Chipotle BBQ Steak Salad', calories: 580, macros: { protein: 42, carbs: 28, fat: 34, fiber: 8 }, category: 'lunch' },
  { id: 'tg-miso-salmon', restaurant: 'Tender Greens', name: 'Miso Glazed Salmon', calories: 520, macros: { protein: 38, carbs: 35, fat: 26, fiber: 6 }, category: 'dinner' },

  // SIT-DOWN RESTAURANTS
  // Olive Garden
  { id: 'og-chicken-parm', restaurant: 'Olive Garden', name: 'Chicken Parmigiana', calories: 1060, macros: { protein: 58, carbs: 82, fat: 52, fiber: 8 }, category: 'dinner' },
  { id: 'og-fettuccine', restaurant: 'Olive Garden', name: 'Fettuccine Alfredo', calories: 1310, macros: { protein: 35, carbs: 98, fat: 85, fiber: 5 }, category: 'dinner' },
  { id: 'og-shrimp-scampi', restaurant: 'Olive Garden', name: 'Shrimp Scampi', calories: 720, macros: { protein: 38, carbs: 68, fat: 32, fiber: 4 }, category: 'dinner' },
  { id: 'og-tour-italy', restaurant: 'Olive Garden', name: 'Tour of Italy', calories: 1500, macros: { protein: 72, carbs: 106, fat: 84, fiber: 9 }, category: 'dinner' },
  { id: 'og-soup-salad', restaurant: 'Olive Garden', name: 'Soup & Salad (unlimited)', calories: 350, macros: { protein: 12, carbs: 38, fat: 18, fiber: 6 }, category: 'lunch' },
  { id: 'og-breadstick', restaurant: 'Olive Garden', name: 'Breadstick (1)', calories: 140, macros: { protein: 4, carbs: 26, fat: 2, fiber: 1 }, category: 'snack' },

  // Applebee's
  { id: 'ab-bourbon-steak', restaurant: "Applebee's", name: 'Bourbon Street Steak', calories: 620, macros: { protein: 48, carbs: 22, fat: 38, fiber: 3 }, category: 'dinner' },
  { id: 'ab-riblets', restaurant: "Applebee's", name: 'Riblets Platter', calories: 1280, macros: { protein: 52, carbs: 98, fat: 72, fiber: 6 }, category: 'dinner' },
  { id: 'ab-oriental-salad', restaurant: "Applebee's", name: 'Oriental Chicken Salad', calories: 540, macros: { protein: 38, carbs: 42, fat: 25, fiber: 8 }, category: 'lunch' },
  { id: 'ab-fiesta-lime', restaurant: "Applebee's", name: 'Fiesta Lime Chicken', calories: 730, macros: { protein: 45, carbs: 58, fat: 35, fiber: 5 }, category: 'dinner' },

  // Chili's
  { id: 'chilis-fajitas', restaurant: "Chili's", name: 'Chicken Fajitas', calories: 690, macros: { protein: 52, carbs: 38, fat: 36, fiber: 6 }, category: 'dinner' },
  { id: 'chilis-burger', restaurant: "Chili's", name: 'Oldtimer Burger', calories: 1150, macros: { protein: 56, carbs: 58, fat: 74, fiber: 4 }, category: 'lunch' },
  { id: 'chilis-crispers', restaurant: "Chili's", name: 'Chicken Crispers', calories: 1320, macros: { protein: 48, carbs: 102, fat: 78, fiber: 5 }, category: 'dinner' },
  { id: 'chilis-molten', restaurant: "Chili's", name: 'Molten Chocolate Cake', calories: 1130, macros: { protein: 14, carbs: 142, fat: 58, fiber: 4 }, category: 'snack' },
  { id: 'chilis-guiltless', restaurant: "Chili's", name: 'Guiltless Chicken (lighter)', calories: 480, macros: { protein: 42, carbs: 38, fat: 18, fiber: 8 }, category: 'dinner' },

  // Cheesecake Factory
  { id: 'cf-chicken-madeira', restaurant: 'Cheesecake Factory', name: 'Chicken Madeira', calories: 1540, macros: { protein: 78, carbs: 82, fat: 98, fiber: 8 }, category: 'dinner' },
  { id: 'cf-factory-burger', restaurant: 'Cheesecake Factory', name: 'Factory Burger', calories: 1480, macros: { protein: 68, carbs: 78, fat: 98, fiber: 5 }, category: 'lunch' },
  { id: 'cf-salmon', restaurant: 'Cheesecake Factory', name: 'Fresh Grilled Salmon', calories: 620, macros: { protein: 52, carbs: 28, fat: 34, fiber: 6 }, category: 'dinner' },
  { id: 'cf-skinnylicious-chicken', restaurant: 'Cheesecake Factory', name: 'SkinnyLicious Chicken', calories: 590, macros: { protein: 48, carbs: 42, fat: 24, fiber: 8 }, category: 'dinner' },
  { id: 'cf-cheesecake-original', restaurant: 'Cheesecake Factory', name: 'Original Cheesecake', calories: 830, macros: { protein: 12, carbs: 68, fat: 58, fiber: 1 }, category: 'snack' },

  // Red Lobster
  { id: 'rl-garlic-shrimp', restaurant: 'Red Lobster', name: 'Garlic Shrimp Scampi', calories: 580, macros: { protein: 32, carbs: 42, fat: 32, fiber: 3 }, category: 'dinner' },
  { id: 'rl-lobster-tail', restaurant: 'Red Lobster', name: 'Rock Lobster Tail', calories: 280, macros: { protein: 38, carbs: 8, fat: 12, fiber: 0 }, category: 'dinner' },
  { id: 'rl-crunchy-popcorn', restaurant: 'Red Lobster', name: 'Crunchy Popcorn Shrimp', calories: 690, macros: { protein: 24, carbs: 58, fat: 38, fiber: 4 }, category: 'dinner' },
  { id: 'rl-lighthouse-salmon', restaurant: 'Red Lobster', name: 'Lighthouse Grilled Salmon', calories: 480, macros: { protein: 42, carbs: 22, fat: 24, fiber: 5 }, category: 'dinner' },
  { id: 'rl-biscuit', restaurant: 'Red Lobster', name: 'Cheddar Bay Biscuit (1)', calories: 160, macros: { protein: 3, carbs: 17, fat: 9, fiber: 1 }, category: 'snack' },

  // Outback Steakhouse
  { id: 'ob-bloomin-onion', restaurant: 'Outback Steakhouse', name: 'Bloomin Onion', calories: 1950, macros: { protein: 24, carbs: 162, fat: 134, fiber: 14 }, category: 'snack' },
  { id: 'ob-ribeye', restaurant: 'Outback Steakhouse', name: 'Ribeye (12 oz)', calories: 780, macros: { protein: 68, carbs: 2, fat: 56, fiber: 0 }, category: 'dinner' },
  { id: 'ob-alice-chicken', restaurant: 'Outback Steakhouse', name: 'Alice Springs Chicken', calories: 920, macros: { protein: 72, carbs: 28, fat: 58, fiber: 4 }, category: 'dinner' },
  { id: 'ob-grilled-salmon', restaurant: 'Outback Steakhouse', name: 'Perfectly Grilled Salmon', calories: 540, macros: { protein: 48, carbs: 12, fat: 34, fiber: 2 }, category: 'dinner' },

  // Texas Roadhouse
  { id: 'tr-ribeye', restaurant: 'Texas Roadhouse', name: 'Bone-In Ribeye (16 oz)', calories: 1050, macros: { protein: 82, carbs: 0, fat: 78, fiber: 0 }, category: 'dinner' },
  { id: 'tr-country-chicken', restaurant: 'Texas Roadhouse', name: 'Country Fried Chicken', calories: 1120, macros: { protein: 58, carbs: 78, fat: 62, fiber: 5 }, category: 'dinner' },
  { id: 'tr-grilled-chicken', restaurant: 'Texas Roadhouse', name: 'Grilled BBQ Chicken', calories: 420, macros: { protein: 52, carbs: 18, fat: 16, fiber: 1 }, category: 'dinner' },
  { id: 'tr-rolls', restaurant: 'Texas Roadhouse', name: 'Rolls with Butter (2)', calories: 380, macros: { protein: 8, carbs: 48, fat: 18, fiber: 2 }, category: 'snack' },

  // Cracker Barrel
  { id: 'cb-sunrise-sampler', restaurant: 'Cracker Barrel', name: 'Sunrise Sampler', calories: 940, macros: { protein: 42, carbs: 78, fat: 52, fiber: 5 }, category: 'breakfast' },
  { id: 'cb-chicken-fried', restaurant: 'Cracker Barrel', name: 'Chicken Fried Steak', calories: 1180, macros: { protein: 48, carbs: 92, fat: 68, fiber: 6 }, category: 'dinner' },
  { id: 'cb-grilled-trout', restaurant: 'Cracker Barrel', name: 'Grilled Rainbow Trout', calories: 380, macros: { protein: 42, carbs: 8, fat: 20, fiber: 2 }, category: 'dinner' },
  { id: 'cb-meatloaf', restaurant: 'Cracker Barrel', name: 'Meatloaf Dinner', calories: 620, macros: { protein: 35, carbs: 42, fat: 35, fiber: 4 }, category: 'dinner' },

  // IHOP
  { id: 'ihop-pancakes', restaurant: 'IHOP', name: 'Original Buttermilk Pancakes (3)', calories: 440, macros: { protein: 10, carbs: 72, fat: 12, fiber: 2 }, category: 'breakfast' },
  { id: 'ihop-omelette', restaurant: 'IHOP', name: 'Big Steak Omelette', calories: 1240, macros: { protein: 62, carbs: 18, fat: 102, fiber: 2 }, category: 'breakfast' },
  { id: 'ihop-french-toast', restaurant: 'IHOP', name: 'Original French Toast (2)', calories: 480, macros: { protein: 12, carbs: 68, fat: 18, fiber: 2 }, category: 'breakfast' },
  { id: 'ihop-fit-omelette', restaurant: 'IHOP', name: 'Simple & Fit Veggie Omelette', calories: 330, macros: { protein: 26, carbs: 12, fat: 20, fiber: 4 }, category: 'breakfast' },

  // Denny's
  { id: 'dennys-grand-slam', restaurant: "Denny's", name: 'Original Grand Slam', calories: 770, macros: { protein: 34, carbs: 62, fat: 42, fiber: 3 }, category: 'breakfast' },
  { id: 'dennys-fit-fare', restaurant: "Denny's", name: 'Fit Fare Veggie Skillet', calories: 340, macros: { protein: 22, carbs: 28, fat: 16, fiber: 6 }, category: 'breakfast' },
  { id: 'dennys-club', restaurant: "Denny's", name: 'Club Sandwich', calories: 820, macros: { protein: 42, carbs: 58, fat: 48, fiber: 4 }, category: 'lunch' },
];

// Restaurant categories for filtering
export type RestaurantCategory = 'fast-food' | 'healthy' | 'sit-down' | 'breakfast';

export interface RestaurantInfo {
  name: string;
  category: RestaurantCategory;
}

export const RESTAURANT_INFO: RestaurantInfo[] = [
  // Fast Food
  { name: "McDonald's", category: 'fast-food' },
  { name: 'Chick-fil-A', category: 'fast-food' },
  { name: 'Chipotle', category: 'fast-food' },
  { name: 'Subway', category: 'fast-food' },
  { name: 'Taco Bell', category: 'fast-food' },
  { name: "Wendy's", category: 'fast-food' },
  { name: 'Panda Express', category: 'fast-food' },
  { name: 'In-N-Out', category: 'fast-food' },
  { name: 'Five Guys', category: 'fast-food' },
  // Healthy
  { name: 'Sweetgreen', category: 'healthy' },
  { name: 'CAVA', category: 'healthy' },
  { name: 'Freshii', category: 'healthy' },
  { name: 'Just Salad', category: 'healthy' },
  { name: 'Tender Greens', category: 'healthy' },
  { name: 'Panera Bread', category: 'healthy' },
  // Sit-Down
  { name: 'Olive Garden', category: 'sit-down' },
  { name: "Applebee's", category: 'sit-down' },
  { name: "Chili's", category: 'sit-down' },
  { name: 'Cheesecake Factory', category: 'sit-down' },
  { name: 'Red Lobster', category: 'sit-down' },
  { name: 'Outback Steakhouse', category: 'sit-down' },
  { name: 'Texas Roadhouse', category: 'sit-down' },
  { name: 'Cracker Barrel', category: 'sit-down' },
  // Breakfast / Coffee
  { name: 'Starbucks', category: 'breakfast' },
  { name: 'IHOP', category: 'breakfast' },
  { name: "Denny's", category: 'breakfast' },
];

// Get unique restaurants
export const getRestaurants = (): string[] => {
  return [...new Set(RESTAURANT_MEALS.map(meal => meal.restaurant))].sort();
};

// Get meals by restaurant
export const getMealsByRestaurant = (restaurant: string): RestaurantMeal[] => {
  return RESTAURANT_MEALS.filter(meal => meal.restaurant === restaurant);
};

// Get ingredient categories with readable names
export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: 'Fruits & Vegetables',
  meats: 'Proteins & Meats',
  dairy: 'Dairy & Eggs',
  grains: 'Grains & Carbs',
  spices: 'Spices & Herbs',
  canned: 'Legumes & Canned',
  frozen: 'Frozen Foods',
  beverages: 'Beverages',
  condiments: 'Condiments & Sauces',
  other: 'Snacks & Other',
};

// Get ingredients by category
export const getIngredientsByCategory = (category: IngredientCategory): FoodItem[] => {
  return INGREDIENT_DATABASE.filter(item => item.category === category);
};

// Calculate nutrition for a serving
export const calculateNutrition = (
  item: FoodItem,
  servings: number
): { calories: number; macros: MacroNutrients } => {
  const multiplier = (item.defaultServingGrams / 100) * servings;
  return {
    calories: Math.round(item.caloriesPer100g * multiplier),
    macros: {
      protein: Math.round(item.macrosPer100g.protein * multiplier),
      carbs: Math.round(item.macrosPer100g.carbs * multiplier),
      fat: Math.round(item.macrosPer100g.fat * multiplier),
      fiber: Math.round(item.macrosPer100g.fiber * multiplier),
    },
  };
};

// Get all ingredients including custom ones
export const getAllIngredients = (customIngredients: FoodItem[] = []): FoodItem[] => {
  return [...INGREDIENT_DATABASE, ...customIngredients];
};

// Search ingredients by name
export const searchIngredients = (
  query: string,
  customIngredients: FoodItem[] = []
): FoodItem[] => {
  const allIngredients = getAllIngredients(customIngredients);
  const lowerQuery = query.toLowerCase();
  return allIngredients.filter((item) =>
    item.name.toLowerCase().includes(lowerQuery)
  );
};

// Helper functions for custom restaurants
export const getAllRestaurantInfo = (customRestaurants: Array<{ id: string; name: string; category: string }> = []): RestaurantInfo[] => {
  const customInfo = customRestaurants.map(r => ({
    name: r.name,
    category: r.category as RestaurantCategory
  }));
  return [...RESTAURANT_INFO, ...customInfo];
};

export const getAllRestaurantMeals = (customMeals: Array<{ restaurant: string; [key: string]: any }> = []): RestaurantMeal[] => {
  return [...RESTAURANT_MEALS, ...customMeals as RestaurantMeal[]];
};

export const getMealsByRestaurantWithCustom = (
  restaurant: string,
  customMeals: Array<{ restaurant: string; [key: string]: any }> = []
): RestaurantMeal[] => {
  const allMeals = getAllRestaurantMeals(customMeals);
  return allMeals.filter(meal => meal.restaurant === restaurant);
};
