use secret_toolkit::storage::{Bucket, Singleton};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, StdResult};

const DATA_BUCKET: &[u8] = b"data";
const OWNER_KEY: &[u8] = b"owner";

let init = WasmMsg::Instantiate {
    admin: Some(info.sender.to_string()), // Aggiungi questo campo
    code_id: code_id,
    msg: to_binary(&msg)?,
    funds: vec![],
    label: "My Contract".to_string(),
};

pub fn set_data(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    text: String,
) -> StdResult<Response> {
    let id = generate_id(); // Funzione per generare un ID unico
    let data = (text, info.sender.clone());
    let mut bucket = Bucket::new(deps.storage, DATA_BUCKET);
    bucket.save(id.as_bytes(), &data)?;
    let mut owner = Singleton::new(deps.storage, OWNER_KEY);
    owner.save(&info.sender)?;
    Ok(Response::new().add_attribute("id", id))
}
