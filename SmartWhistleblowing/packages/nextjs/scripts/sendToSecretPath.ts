import { ethers } from 'ethers';
import { handleSubmit } from './submit'; // Assicurati di importare handleSubmit

export const sendToSecretPath = async (userInput: string, isPublic: boolean) => {
  try {
    // 1. Genera una chiave randomica
    const randomKey = ethers.utils.hexlify(ethers.utils.randomBytes(32)); // Genera una chiave esadecimale di 32 byte (256 bit)
    
    // 2. Divide la chiave in due parti
    const firstPart = randomKey.slice(0, 34);  // Prima metà
    const secondPart = randomKey.slice(34);    // Seconda metà

    // Chiama handleSubmit passando i dati necessari
    const event = { preventDefault: () => {} }; // Crea un oggetto evento fittizio
    await handleSubmit(event, firstPart, userInput, secondPart, isPublic);

    return { message: 'Dati inviati con successo!', randomKey };
  } catch (error) {
    console.error('Errore:', error);
    throw error;
  }
};
