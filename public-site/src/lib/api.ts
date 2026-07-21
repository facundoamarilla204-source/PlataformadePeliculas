import { MOCK_MOVIES, MOCK_CATEGORIES } from "./mockData";

export async function fetchFeaturedMovie() {
  return MOCK_MOVIES.find(m => m.is_featured) || MOCK_MOVIES[0];
}

export async function fetchMoviesByCategory(categoryName?: string) {
  if (categoryName) {
    return MOCK_MOVIES.filter(m => m.categories.includes(categoryName));
  }
  return MOCK_MOVIES;
}

export async function fetchCategories() {
  return MOCK_CATEGORIES;
}

export async function fetchMovieById(id: string) {
  return MOCK_MOVIES.find(m => m.id === id) || null;
}
