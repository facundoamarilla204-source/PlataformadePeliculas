const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const mapMovie = (m: any) => ({
  ...m,
  poster_url: m.poster_url || m.poster_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
  backdrop_url: m.backdrop_url || m.backdrop_path || "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop",
  release_year: m.release_year || (m.release_date ? new Date(m.release_date).getFullYear() : 2024),
  duration: m.duration ? `${m.duration} min` : "2h 00m",
  categories: m.categories && m.categories.length > 0 ? m.categories : ["Acción", "Drama"]
});

export async function fetchFeaturedMovie() {
  try {
    const res = await fetch(`${API_URL}/movies`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Error fetching movies');
    const movies = await res.json();
    
    return movies.length > 0 ? mapMovie(movies[0]) : null;
  } catch (error) {
    console.error('fetchFeaturedMovie error:', error);
    return null;
  }
}

export async function fetchMoviesByCategory(categorySlug?: string) {
  try {
    const url = categorySlug 
      ? `${API_URL}/categories/slug/${categorySlug}/movies`
      : `${API_URL}/movies`;
      
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Error fetching movies');
    let movies = await res.json();

    return movies.map(mapMovie);
  } catch (error) {
    console.error('fetchMoviesByCategory error:', error);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Error fetching categories');
    const result = await res.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (error) {
    console.error('fetchCategories error:', error);
    return [];
  }
}

export async function fetchMovieById(id: string) {
  try {
    const res = await fetch(`${API_URL}/movies/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const movie = await res.json();
    return mapMovie(movie);
  } catch (error) {
    console.error('fetchMovieById error:', error);
    return null;
  }
}
