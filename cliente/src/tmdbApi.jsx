import axios from 'axios';

const API_KEY = 'f71b4d73b7259028d106f248d6e78698'; 
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchRandomMovie = async () => {
    try {
        // Obtener el total de películas
        const totalResponse = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`);
        const totalMovies = totalResponse.data.total_results;
        console.log('Total Movies:', totalMovies); // Para depuración

        // Calcular el número de páginas (asumiendo 20 resultados por página)
        const totalPages = Math.ceil(totalMovies / 20);
        
        // Limitar el número de páginas a un máximo razonable
        const maxPages = Math.min(totalPages, 500); // Limitar a 500 páginas como máximo

        // Asegurarse de que maxPages sea al menos 1
        if (maxPages < 1) {
            throw new Error('No hay películas disponibles.');
        }

        // Elegir una página aleatoria, asegurándose de que esté dentro del rango
        const randomPage = Math.floor(Math.random() * maxPages) + 1;
        console.log('Random Page:', randomPage); // Para depuración

        // Obtener películas de la página aleatoria
        const moviesResponse = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${randomPage}`);
        
        // Verificar si hay resultados
        if (!moviesResponse.data.results || moviesResponse.data.results.length === 0) {
            throw new Error('No se encontraron películas en esta página.');
        }

        const movies = moviesResponse.data.results;

        // Seleccionar una película al azar de los resultados
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        // Obtener detalles de la película seleccionada en español
        const detailsResponse = await axios.get(`${BASE_URL}/movie/${randomMovie.id}?api_key=${API_KEY}&language=es-ES`);
        return detailsResponse.data;

    } catch (error) {
        console.error('Error fetching random movie:', error);
        throw error;
    }
};