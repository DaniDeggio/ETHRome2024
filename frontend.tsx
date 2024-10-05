"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation"; // Usa il router di Next.js

const Home = () => {
  const router = useRouter(); // Inizializza useRouter
  const [userInput, setUserInput] = useState("");
  const [isPublic, setIsPublic] = useState(true); // State to manage toggle switch

  // Funzione per gestire il click del bottone
  const handleButtonClick = () => {
    router.push('/info'); // Naviga verso la pagina /info
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(userInput, isPublic ? "Pubblica" : "Anonima");
    setUserInput(""); // Pulisci l'input dopo il submit
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
              className={py-2 px-4 rounded-l-lg ${isPublic ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}}
            >
              Pubblica
            </button>
            <button
              type="button"
              onClick={() => setIsPublic(false)}
              className={py-2 px-4 rounded-r-lg ${!isPublic ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}}
            >
              Anonima
            </button>
          </div>
          <button type="submit" className="bg-primary text-white py-2 px-4 rounded-full hover:bg-secondary transition">
            Invia
          </button>
        </form>
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