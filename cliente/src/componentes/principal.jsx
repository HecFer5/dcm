import React, { useEffect, useState } from 'react';
import { fetchRandomMovie } from '../tmdbApi'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

const translateTitle = async (title) => {
    try {
        const response = await axios.post('https://api-free.deepl.com/v2/translate', null, {
            params: {
                auth_key: 'YOUR_DEEPL_API_KEY', // Reemplaza con tu clave de API de DeepL
                text: title,
                target_lang: 'ES',
            },
        });
        return response.data.translations[0].text;
    } catch (error) {
        console.error('Error translating title:', error);
        return title; // Devuelve el título original si hay un error
    }
};

const RandomMovie = () => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getRandomMovie = async () => {
            try {
                const randomMovie = await fetchRandomMovie();
                let title = randomMovie.title;

                // Si el título está en inglés, intenta traducirlo
                if (!randomMovie.title_es) { // Asegúrate de que la propiedad exista
                    title = await translateTitle(title);
                } else {
                    title = randomMovie.title_es; // Usa el título en español si está disponible
                }

                // Actualiza el estado de la película con el título traducido
                setMovie({ ...randomMovie, title });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getRandomMovie();
    }, []);

    if (loading) {
        return <div className="text-center text-xl">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden pt-20">
                            <h1 className="text-2xl font-auto mb-2 ">{movie.title}</h1>

            <img 
                className="w-full h-64 object-cover" 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
            />
            <div className="p-4">
                <p className="text-gray-700">{movie.overview}</p>
            </div>
        </div>
    );
};

export default RandomMovie;