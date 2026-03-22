import { useQuery } from '@tanstack/react-query';
import { ChefHat, Check, X } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { getRecipeSuggestions } from '../api/recipes.api';

interface Ingredient {
  name: string;
  inStock: boolean;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  matchPercentage: number;
  ingredients: Ingredient[];
  missingIngredients: string[];
}

export default function RecipesPage() {
  const { data, isLoading } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: getRecipeSuggestions,
  });

  const recipes = data ?? [];

  return (
    <div>
      <PageHeader
        title="Sugerencias de Recetas"
        helpKey="recipes"
        subtitle="Recetas basadas en tu inventario actual"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded mb-3" />
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded mb-2" />
              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded mb-4" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="bg-gray-200 dark:bg-gray-700 h-4 w-1/2 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center animate-fade-in">
          <ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay sugerencias de recetas disponibles
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Agrega productos a tu inventario para obtener sugerencias
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in hover:shadow-lg transition-shadow"
            >
              {/* Header with match badge */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white pr-2">
                  {recipe.name}
                </h3>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                    recipe.matchPercentage >= 80
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : recipe.matchPercentage >= 50
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {recipe.matchPercentage}%
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {recipe.description}
              </p>

              {/* Ingredients */}
              <div className="space-y-1.5 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Ingredientes
                </p>
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {ing.inStock ? (
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span
                      className={
                        ing.inStock
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-red-500 dark:text-red-400 line-through'
                      }
                    >
                      {ing.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Missing ingredients */}
              {recipe.missingIngredients.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                    Te faltan {recipe.missingIngredients.length} ingrediente(s):
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {recipe.missingIngredients.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
