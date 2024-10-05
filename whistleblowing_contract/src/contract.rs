use cosmwasm_std::{Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Binary, to_binary};
use cosmwasm_storage::{bucket, bucket_read}; 
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use thiserror::Error;

pub const REPORTS: &[u8] = b"reports"; // Definisci uno spazio di archiviazione per i report

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Report {
    pub report_id: String,
    pub content: String, 
    pub reporter: String, 
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
    // Genera un report_id univoco
    let report_id = env.block.height.to_string() + &info.sender.to_string();
    
    // Crittografa il contenuto
    let encrypted_content = encrypt_content(report_content.clone())?;

    let new_report = Report {
        report_id: report_id.clone(),
        content: encrypted_content,
        reporter: info.sender.to_string(),
    };

    // Usa bucket per salvare il report con l'ID come chiave
    let mut reports_storage = bucket(deps.storage, REPORTS);
    reports_storage.save(report_id.as_bytes(), &new_report)?; // Salva il report usando l'ID come chiave

    // Restituisci una risposta con il report_id
    Ok(Response::new()
        .add_attribute("action", "store_report")
        .add_attribute("report_id", report_id))
}

// Funzione di crittografia (puoi sostituire con la tua logica di crittografia)
fn encrypt_content(content: String) -> StdResult<String> {
    Ok(content) // Placeholder: sostituisci con la vera crittografia
}

// Funzione per recuperare un report in base al report_id
pub fn get_report(
    deps: Deps,
    info: MessageInfo,
    report_id: String,
) -> StdResult<Binary> {
    // Carica il report dal bucket usando il report_id come chiave
    let reports_storage = bucket_read(deps.storage, REPORTS);
    
    let report: Report = reports_storage.load(report_id.as_bytes())?; 

    // Verifica se il chiamante è l'autore del report
    if info.sender != report.reporter {
        return Err(StdError::generic_err("Unauthorized"));
    }

    // Decripta il contenuto
    let decrypted_content = decrypt_content(report.content)?;

    // Restituisci il contenuto decrittato come Binary
    Ok(to_binary(&decrypted_content)?)
}

// Funzione di decrittazione (puoi sostituire con la tua logica di decrittazione)
fn decrypt_content(encrypted_content: String) -> StdResult<String> {
    Ok(encrypted_content) // Placeholder: sostituisci con la vera decrittazione
}
