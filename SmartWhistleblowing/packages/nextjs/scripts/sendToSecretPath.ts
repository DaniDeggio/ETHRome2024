import { ethers } from 'ethers';
import { handleSubmit } from './submit'; // Assicurati di importare handleSubmit

export const sendToSecretPath = async (userInput: string, isPublic: boolean) => {
  try {
    console.log('Inizio invio a SecretPath...');

    // 1. Genera una chiave randomica
    const randomKey = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    console.log('Chiave generata:', randomKey);

    // 2. Divide la chiave in due parti
    const firstPart = randomKey.slice(0, 34);
    const secondPart = randomKey.slice(34);
    console.log('Prima parte:', firstPart);
    console.log('Seconda parte:', secondPart);

    // Chiama handleSubmit passando i dati necessari
    const event = { preventDefault: () => {} };
    await handleSubmit(event, firstPart, userInput, secondPart, isPublic);

    console.log('Dati inviati con successo!');

    // Restituisci un oggetto serializzato per evitare [object Object]
    return JSON.stringify({ 
      message: 'Dati inviati con successo!', 
      randomKey 
    });
  } catch (error) {
    console.error('Errore durante l\'invio a SecretPath:', error.message);
    console.error('Stack di errore:', error.stack);
    throw error;
  }
};
