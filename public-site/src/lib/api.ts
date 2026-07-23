const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Reemplaza espacios con -
    .replace(/[^\w\-]+/g, '')   // Remueve caracteres no alfanuméricos
    .replace(/\-\-+/g, '-')     // Reemplaza múltiples - por un solo -
    .replace(/^-+/, '')         // Quita guiones del principio
    .replace(/-+$/, '');        // Quita guiones del final
}

const mapMovie = (m: any) => ({
  ...m,
  slug: generateSlug(m.title),
  poster_url: m.poster_url || m.poster_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
  backdrop_url: m.backdrop_url || m.backdrop_path || "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop",
  release_year: m.release_year || (m.release_date ? new Date(m.release_date).getFullYear() : 2024),
  duration: m.duration ? (typeof m.duration === 'string' && m.duration.includes('m') ? m.duration : `${m.duration} min`) : "2h 00m",
  categories: Array.isArray(m.categories) 
    ? m.categories.map((c: any) => typeof c === 'string' ? c : c.name) 
    : []
});

export async function fetchFeaturedMovies() {
  try {
    const res = await fetch(`${API_URL}/banners`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error fetching banners');
    const movies = await res.json();
    
    // Return all featured movies
    const featuredMovies = movies.filter((m: any) => m.is_featured);
    // If no featured movies exist, fallback to the first movie
    if (featuredMovies.length === 0 && movies.length > 0) {
      return [mapMovie(movies[0])];
    }
    
    return featuredMovies.map(mapMovie);
  } catch (error) {
    console.error('fetchFeaturedMovies error:', error);
    return [];
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

export async function fetchMovieBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/movies/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const movie = await res.json();
    return mapMovie(movie);
  } catch (error) {
    console.error('fetchMovieBySlug error:', error);
    return null;
  }
}

export async function recordMovieView(id: string) {
  try {
    fetch(`${API_URL}/movies/${id}/view`, { method: 'POST' }).catch(() => {});
  } catch (error) {
    // Ignorar errores de tracking
  }
}

export async function recordSiteView() {
  try {
    fetch(`${API_URL}/dashboard/visit`, { method: 'POST' }).catch(() => {});
  } catch (error) {
    // Ignorar errores de tracking
  }
}
export async function fetchMovieStreamingUrl(id: string) {
  try {
    const res = await fetch(`${API_URL}/streaming/embed/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.available ? data.embed_url : null;
  } catch (error) {
    console.error('fetchMovieStreamingUrl error:', error);
    return null;
  }
}

export async function fetchTMDBDetails(tmdbId: number) {
  try {
    const res = await fetch(`${API_URL}/tmdb/details/${tmdbId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('fetchTMDBDetails error:', error);
    return null;
  }
}

export async function fetchGlobalSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { next: { revalidate: 10 } }); // revalidate every 10 seconds for relatively fast updates
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('fetchGlobalSettings error:', error);
    return null;
  }
}

