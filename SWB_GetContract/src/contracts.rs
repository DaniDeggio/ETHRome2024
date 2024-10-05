use secret_toolkit::storage::{Bucket, Singleton};
use cosmwasm_std::{Deps, Env, StdResult, StdError, MessageInfo};

const OWNER_KEY: &[u8] = b"owner";

pub fn get_data(
    deps: Deps,
    env: Env,
    info: MessageInfo,
    id: String,
) -> StdResult<String> {
    let bucket = Bucket::new(deps.storage, DATA_BUCKET);
    let (text, owner): (String, Addr) = bucket.load(id.as_bytes())?;
    let owner_storage = Singleton::new(deps.storage, OWNER_KEY);
    let contract_owner: Addr = owner_storage.load()?;
    if info.sender == owner || info.sender == contract_owner {
        Ok(text)
    } else {
        Err(StdError::generic_err("Unauthorized"))
    }
}
