import { ethers } from "ethers";
import abi from "../config/abi";
import { generateKeys } from "./functions/secretpath/generateKeys";
import { getPublicClientAddress } from "./functions/secretpath/getPublicClientAddress";
import { constructPayload } from "./functions/secretpath/constructPayload";
import { encryptPayload } from "./functions/secretpath/encryptPayload";
import { hexlify } from "ethers/lib/utils";

export async function handleSubmit(e, key, value, viewing_key, anonymous) {
  try {
    e.preventDefault();

    console.log('Inizio handleSubmit...');
    console.log('Chiavi passate:', { key, value, viewing_key, anonymous });

    // Controlla i parametri chiave
    if (!key || !value || !viewing_key || anonymous === undefined) {
      console.error("Dati mancanti o non validi per handleSubmit:", { key, value, viewing_key, anonymous });
      return;
    }

    // const routing_contract = process.env.REACT_APP_SECRET_ADDRESS;
    // const routing_code_hash = process.env.REACT_APP_CODE_HASH;

    const routing_contract = "secret1l58zscj0tdhukvanuug0l5qtsck2m5nkvd9qfj";
    const routing_code_hash = "c7ebf12bfca7cde052450e50eedca2ef44470a91d9138002c8d370418ab916be"

    // Controlla se i dati di routing sono validi
    if (!routing_contract || !routing_code_hash) {
      console.error("Valore mancante:", { routing_contract, routing_code_hash });
      return;
    }

    const iface = new ethers.utils.Interface(abi);
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const [myAddress] = await provider.send("eth_requestAccounts", []);
    console.log('Indirizzo account:', myAddress);

    const { userPrivateKeyBytes, userPublicKeyBytes, sharedKey } = await generateKeys();
    console.log('Chiavi generate:', { userPrivateKeyBytes, userPublicKeyBytes, sharedKey });

    const callbackSelector = iface.getSighash(iface.getFunction("upgradeHandler"));
    console.log("Callback selector:", callbackSelector);

    const callbackGasLimit = 90000;
    const handle = "store_value";

    const data = JSON.stringify({
      key: key,
      value: value,
      viewing_key: viewing_key,
      anonymous: anonymous,
    });
    console.log('Payload dati:', data);

    const chainId = (await provider.getNetwork()).chainId.toString();
    console.log('Chain ID:', chainId);

    const publicClientAddress = await getPublicClientAddress(chainId);
    const callbackAddress = publicClientAddress.toLowerCase();
    console.log("Indirizzo callback:", callbackAddress);

    const payload = constructPayload(
      data,
      routing_contract,
      routing_code_hash,
      myAddress,
      userPublicKeyBytes,
      callbackAddress,
      callbackSelector,
      callbackGasLimit
    );

    // Controlla se il payload è stato costruito correttamente
    if (!payload) {
      console.error("Errore durante la costruzione del payload:", payload);
      return;
    }
    console.log('Payload costruito:', payload);

    const { ciphertext, payloadHash, payloadSignature, _info } = await encryptPayload(
      payload,
      sharedKey,
      provider,
      myAddress,
      userPublicKeyBytes,
      routing_code_hash,
      handle,
      callbackGasLimit,
      iface,
      callbackSelector
    );

    // Controlla se il payload è stato crittografato correttamente
    if (!ciphertext || !payloadHash || !payloadSignature || !_info) {
      console.error("Errore durante la crittografia del payload:", { ciphertext, payloadHash, payloadSignature, _info });
      return;
    }
    console.log('Payload crittografato:', { ciphertext, payloadHash, payloadSignature, _info });

    // Verifica la validità dei parametri per la funzione di invio
    if (!payloadHash || !myAddress || !routing_contract || !_info) {
      console.error("Parametri mancanti per encodeFunctionData:", { payloadHash, myAddress, routing_contract, _info });
      return;
    }

    const functionData = iface.encodeFunctionData("send", [payloadHash, myAddress, routing_contract, _info]);
    console.log('Dati della funzione da inviare:', functionData);

    const feeData = await provider.getFeeData();
    console.log('Dati delle fee:', feeData);

    const maxFeePerGas = feeData.maxFeePerGas;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    const gasFee = maxFeePerGas && maxPriorityFeePerGas ? maxFeePerGas.add(maxPriorityFeePerGas) : await provider.getGasPrice();
    console.log('Tariffa gas calcolata:', gasFee.toString());

    let amountOfGas;
    let my_gas = 150000;

    console.log("Configurazione gas per chainId:", chainId);
    if (chainId === "4202") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(100000).div(2);
    } else if (chainId === "128123") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(1000).div(2);
      my_gas = 15000000;
    } else if (chainId === "80002") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(100).div(2);
      console.log("Gas calcolato per chainId 80002:", amountOfGas);
    } else {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
    }
    console.log("Valore amountOfGas:", amountOfGas.toString());

    const tx_params = {
      gas: hexlify(my_gas),
      to: publicClientAddress,
      from: myAddress,
      value: hexlify(amountOfGas),
      data: functionData,
    };
    console.log("Parametri della transazione:", tx_params);

    const txHash = await provider.send("eth_sendTransaction", [tx_params]);
    console.log(`Transaction Hash: ${txHash}`);
  } catch (error) {
    console.error('Errore in handleSubmit:', error.message);
    console.error('Stack di errore:', error.stack);
    throw error;
  }
}
