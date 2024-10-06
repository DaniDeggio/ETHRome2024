"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { sendToSecretPath } from '../../scripts/sendToSecretPath'; // Importa il tuo script

const Home = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [message, setMessage] = useState(""); // Stato per il messaggio
  const [showMessage, setShowMessage] = useState(false); // Stato per mostrare/nascondere il messaggio

  // Funzione per gestire il click del bottone
  const handleButtonClick = () => {
    router.push('/info');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await sendToSecretPath(userInput, isPublic);
      setMessage(`Risultato: ${result}`); // Imposta il messaggio di ritorno
      setShowMessage(true); // Mostra il messaggio
      setTimeout(() => setShowMessage(false), 5000); // Nascondi il messaggio dopo 5 secondi
    } catch (error) {
      setMessage("Errore durante l'invio");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000); // Nascondi il messaggio dopo 5 secondi
    }

    setUserInput("");
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center bg-gradient-to-r from-primary to-secondary py-24">
        <h1 className="text-5xl font-bold text-white">Benvenuto in VoxPopuli!</h1>
        <p className="mt-4 text-lg text-white">Esplora le nostre funzionalità e inizia il tuo viaggio con noi.</p>
        <button onClick={handleButtonClick} className="mt-6 bg-white text-primary py-2 px-4 rounded-full hover:bg-gray-200 transition">
          Scopri di più
        </button>
      </header>

      {/* Input Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Parla con noi!</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Scrivi qui..."
            className="w-full max-w-5xl h-40 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary mb-4 resize-none"
          />
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={() => setIsPublic(true)}
              className={`py-2 px-4 rounded-l-lg ${isPublic ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Pubblica
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={`py-2 px-4 rounded-r-lg ${!isPublic ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Anonima
            </button>
          </div>
          <button type="submit" className="bg-primary text-white py-2 px-4 rounded-full hover:bg-secondary transition">
            Invia
          </button>
        </form>

        {/* Sezione per visualizzare il messaggio */}
        {showMessage && (
          <div className="mt-4 p-4 bg-green-200 text-green-800 rounded-lg">
            {message}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-base-300 text-center">
        <h2 className="text-3xl font-bold">Pronto per iniziare?</h2>
        <p className="mt-4">Unisciti a noi e scopri di più sulle nostre offerte!</p>
        <button className="mt-6 bg-primary text-white py-2 px-4 rounded-full hover:bg-secondary transition">
          Inizia ora
        </button>
      </section>

      {/* Footer Section */}
      <footer className="py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Il Tuo Nome o Azienda. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
};

export default Home;
