extern crate aeternal;
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
extern crate dotenv;
#[macro_use]
extern crate assert_json_diff;
#[macro_use]
extern crate serde_json;
extern crate postgres;

use aeternal::loader::BlockLoader;
use aeternal::loader::PGCONNECTION;
use aeternal::models::*;
use aeternal::schema::key_blocks;
use aeternal::schema::key_blocks::dsl::*;
use diesel::query_dsl::filter_dsl::FilterDsl;
use diesel::sql_query;
use diesel::BelongingToDsl;
use diesel::Connection;
use diesel::ExpressionMethods;
use diesel::PgConnection;
use diesel::RunQueryDsl;
use dotenv::dotenv;
use postgres::*;
use std::env;

embed_migrations!("migrations/");

fn get_test_connection() -> PgConnection {
    dotenv().ok(); // Grabbing ENV vars
    let database_url = env::var("TEST_DATABASE_URL").expect("TEST_DATABASE_URL must be set");
    PgConnection::establish(&database_url).unwrap()
}

fn get_test_sql_connection() -> postgres::Connection {
    dotenv().ok(); // Grabbing ENV vars
    let database_url = env::var("TEST_DATABASE_URL").expect("TEST_DATABASE_URL must be set");
    postgres::Connection::connect(database_url.as_str(), postgres::TlsMode::None).unwrap()
}

fn get_blockloader() -> BlockLoader {
    dotenv().ok();
    let url = env::var("NODE_URL")
        .expect("NODE_URL must be set")
        .to_string();
    BlockLoader::new(url)
}

fn load_blocks(list: Vec<i64>) {
    let loader = get_blockloader();
    for block in list {
        loader.load_blocks(block).unwrap();
    }
}

fn reset_database() {
    let conn = aeternal::loader::SQLCONNECTION.get().unwrap();
    conn.execute("DROP DATABASE IF EXISTS aeternal_test", &[])
        .unwrap();
    conn.execute("CREATE DATABASE aeternal_test", &[]).unwrap();
    let conn2 = get_test_connection();
    embedded_migrations::run(&conn2).unwrap();
}

#[test]
pub fn test_names() {
    reset_database();
}

/**
 * Load contract and one call via block heights, and test the call data against what it
 * ought to be
 */
//#[test]
pub fn test_contract_call() {
    load_blocks(vec![7132, 7139]);
    let conn = get_test_connection();
    let calls: Vec<ContractCall> = sql_query("SELECT CC.* FROM contract_calls cc, transactions t WHERE cc.transaction_id=t.id AND t.block_height=7139".to_string()).load(&conn).unwrap();
    assert_eq!(calls.len(), 1);
    println!("{:?}", &calls[0]);
    let args = json!({"function": "createProof",
                      "arguments": [{"type": "string", "value": "testtest"}]});
    let result = json!({"data": {"type": "tuple", "value": []}});
    let cc = &calls[0];
    println!("args:{:?} result:{:?}", args, result);
    assert_json_eq!(cc.arguments.clone(), args);
    assert_json_eq!(cc.result.clone().unwrap(), result);

    // some more tests we can do quickly, to check everything looks OK
    let key_block = key_blocks::table
        .filter(height.eq(7132))
        .first::<KeyBlock>(&conn)
        .unwrap();
    let micro_blocks: Vec<MicroBlock> = MicroBlock::belonging_to(&key_block).load(&conn).unwrap();
    assert_eq!(micro_blocks.len(), 1);
    let transactions: Vec<Transaction> = Transaction::belonging_to(&micro_blocks[0])
        .load(&conn)
        .unwrap();
    assert_eq!(transactions.len(), 1);
}

#[test]
pub fn test_oracle_queries() {
    load_blocks(vec![34424]);
    let conn = &*PGCONNECTION.get().unwrap();
}
