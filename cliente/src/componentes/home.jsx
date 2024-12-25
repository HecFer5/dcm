import React, { useState, useEffect } from "react";
import { fetchRandomMovie } from "../tmdbApi"; // Asegúrate de que la ruta sea correcta
import axios from "axios";

// Función para traducir texto usando LibreTranslate
const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "auto", // Detecta automáticamente el idioma de origen
      target: targetLanguage, // Idioma de destino
      format: "text",
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Si hay un error, devuelve el texto original
  }
};

function Home() {
  const [selectedColors, setSelectedColors] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [randomMovieTitle, setRandomMovieTitle] = useState("");
  const [timeLeft, setTimeLeft] = useState(null); // Estado para el tiempo restante
  const [elapsedTime, setElapsedTime] = useState(0); // Estado para el tiempo transcurrido
  const [pointsAwarded, setPointsAwarded] = useState(0); // Estado para los puntos otorgados
  const [isFinished, setIsFinished] = useState(false); // Estado para mostrar "FIN"
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Estado para controlar si el temporizador está activo
  const [scores, setScores] = useState({}); // Estado para almacenar los puntajes de los equipos

  const handleColorChange = (color) => {
    setShowPanel(true);
    setSelectedColors((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color); // Eliminar color si ya está seleccionado
      } else {
        return [...prev, color]; // Agregar color si no está seleccionado
      }
    });
  };

  const handleChooseMovie = async () => {
    try {
      const movie = await fetchRandomMovie();
      const translatedTitle = await translateText(movie.title, "es");
      setRandomMovieTitle(translatedTitle);
    } catch (error) {
      console.error("Error fetching or translating movie:", error);
    }
  };

  const handleStartStopTimer = (color) => {
    if (isTimerRunning) {
      // Si el temporizador está activo, detenerlo
      setIsTimerRunning(false);
      assignPoints(color, elapsedTime); // Asigna puntos solo al equipo correspondiente
      setTimeLeft(null); // Reinicia el tiempo
      setIsFinished(false); // Reinicia el estado de "FIN"
    } else {
      // Si el temporizador no está activo, iniciarlo
      setTimeLeft(20); // Inicializa el tiempo en 20 segundos
      setElapsedTime(0); // Reinicia el tiempo transcurrido
      setPointsAwarded(0); // Reinicia los puntos otorgados
      setIsTimerRunning(true);
      setIsFinished(false); // Reinicia el estado de "FIN"
    }
  };

  const assignPoints = (color, elapsed) => {
    let points = 0;
    if (elapsed <= 5) {
      points = 4; // Primer cuarto
    } else if (elapsed <= 10) {
      points = 3; // Segundo cuarto
    } else if (elapsed <= 15) {
      points = 2; // Tercer cuarto
    } else {
      points = 1; // Cuarto cuarto
    }

    // Actualiza el puntaje del equipo correspondiente
    setScores((prevScores) => {
      const newScores = { ...prevScores };
      if (!newScores[color]) {
        newScores[color] = 0; // Inicializa el puntaje si no existe
      }
      newScores[color] += points; // Suma los puntos
      return newScores;
    });

    // Guarda los puntos otorgados
    setPointsAwarded(points);
  };

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (!isTimerRunning || timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) {
        setIsFinished(true); // Muestra "FIN" cuando el tiempo llega a 0
        setIsTimerRunning(false); // Detiene el temporizador
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1); // Reduce el tiempo en 1 segundo
      setElapsedTime((prev) => prev + 1); // Aumenta el tiempo transcurrido
    }, 1000);

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [timeLeft, isTimerRunning]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Lado Izquierdo */}
      <div className="flex flex-col justify-center items-center bg-gray-200 w-full md:w-1/3 p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleChooseMovie} // Llama a la función al hacer clic
        >
          ELEGIR PELÍCULA
        </button>

        {randomMovieTitle && (
          <h2 className="mt-4 text-lg font-semibold">{randomMovieTitle}</h2>
        )}{" "}
        {/* Muestra el título traducido */}
        {timeLeft !== null && !isFinished && (
          <h2 className="mt-4 text-lg font-semibold">
            Tiempo restante: {timeLeft}s
          </h2>
        )}{" "}
        {/* Muestra el tiempo restante */}
        {isFinished && <h2 className="mt-4 text-lg font-semibold">FIN</h2>}{" "}
        {/* Muestra "FIN" cuando el tiempo termina */}
        {!isTimerRunning && elapsedTime > 0 && (
          <h2 className="mt-4 text-lg font-semibold">
            Tiempo transcurrido: {elapsedTime}s - Puntos otorgados: {pointsAwarded}
          </h2>
        )}{" "}
        {/* Muestra el tiempo transcurrido y los puntos otorgados cuando el temporizador se detiene */}
      </div>

      {/* Lado Derecho */}
      <div className="flex flex-col justify-center items-center bg-white w-full md:w-1/3 p-4">
        <h1 className="text-2xl font-bold mb-4">EQUIPOS</h1>

        {/* Opciones de colores */}
        <div className="flex flex-col space-y-2">
          {["Rojo", "Azul", "Amarillo", "Verde"].map((color) => (
            <label key={color} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                onChange={() => handleColorChange(color)}
              />
              <span className="ml-2">{color}</span>
              <span className="ml-2 font-bold">{scores[color] || 0}</span> {/* Muestra el puntaje del equipo */}
            </label>
          ))}
        </div>
      </div>

      {/* Tercera Columna */}
      {showPanel && (
        <div className="flex flex-col justify-center items-center bg-gray-100 w-full md:w-1/3 p-4">
          <h2 className="text-xl font-bold mb-4">Equipos Elegidos</h2>
          <div className="flex flex-col space-y-2">
            {selectedColors.map((color) => (
              <div key={color} className="flex justify-between w-full">
                <span>{color}</span>
                <span className="font-bold pl-3">{scores[color] || 0}</span> {/* Muestra el puntaje del equipo */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 ml-4 rounded"
                  onClick={() => handleStartStopTimer(color)} // Inicia o detiene el temporizador al hacer clic
                >
                  {isTimerRunning ? "DETENER" : "COMENZAR"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;