use cosmwasm_std::{Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Binary, to_binary};
use cosmwasm_storage::{singleton, singleton_read}; // Importa le funzioni di cosmwasm_storage
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use thiserror::Error;

// Cambia il nome della costante
pub const REPORTS: &[u8] = b"reports"; // Definisci la chiave come array di byte

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Report {
    pub report_id: String,
    pub content: String, // Questo sarà il contenuto criptato
    pub reporter: String, // Indirizzo wallet del reporter
}

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),
    #[error("Unauthorized")]
    Unauthorized {},
}

// Funzione per memorizzare il report
pub fn store_report(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    report_content: String,
) -> Result<Response, ContractError> {
    // Genera un ID unico per il report
    let report_id = env.block.height.to_string() + &info.sender.to_string();
    
    // Memorizza il contenuto criptato nel contratto
    let encrypted_content = encrypt_content(report_content)?;
    let new_report = Report {
        report_id: report_id.clone(),
        content: encrypted_content,
        reporter: info.sender.to_string(),
    };

    // Usa singleton per salvare il report
    let mut reports_storage = singleton(deps.storage, REPORTS);
    reports_storage.save(&new_report)?; // Salva il report direttamente

    Ok(Response::new()
        .add_attribute("action", "store_report")
        .add_attribute("report_id", report_id))
}

fn encrypt_content(content: String) -> StdResult<String> {
    // Placeholder per la logica di crittografia
    Ok(content) // Sostituisci questo con una vera crittografia
}

pub fn get_report(
    deps: Deps,
    info: MessageInfo,
    report_id: String,
) -> StdResult<Binary> {
    // Recupera il report tramite il suo ID
    let reports_storage = singleton_read(deps.storage, REPORTS);
    
    // Devi gestire la chiave qui per identificare il report specifico
    // Nota: Potresti voler salvare i report in un formato più complesso se vuoi accedere a più report
    let report: Report = reports_storage.load()?; // Carica il report direttamente

    // Solo il reporter o il creatore del contratto possono decrittarlo
    if info.sender != report.reporter {
        return Err(StdError::generic_err("Unauthorized"));
    }

    // Decripta il contenuto
    let decrypted_content = decrypt_content(report.content)?;

    Ok(to_binary(&decrypted_content)?)
}

fn decrypt_content(encrypted_content: String) -> StdResult<String> {
    // Aggiungi la tua logica di decrittazione qui utilizzando il sistema di chiavi private di Secret
    Ok(encrypted_content) // Placeholder: sostituisci con la vera decrittazione
}
