import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('Rust 解析测试', () => {
  test('基础语法 token', () => {
    const code = `use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone)]
pub struct User {
  pub id: u64,
  pub name: String,
  pub active: bool,
}

pub enum Status {
  Init,
  Active,
  Disabled,
}

pub trait UserRepo {
  fn find_by_id(&self, id: u64) -> Option<User>;
}

pub struct InMemoryRepo {
  store: HashMap<u64, User>,
}

impl InMemoryRepo {
  pub fn new(users: Vec<User>) -> Self {
    let mut store = HashMap::new();
    for user in users {
      store.insert(user.id, user);
    }
    Self { store }
  }
}

impl UserRepo for InMemoryRepo {
  fn find_by_id(&self, id: u64) -> Option<User> {
    self.store.get(&id).cloned()
  }
}

pub async fn sync_users(repo: Arc<Mutex<dyn UserRepo>>) -> Result<(), String> {
  let note = r#"{"source":"rust","ok":true}"#;
  let default_tag = 'A';
  let none_value: Option<u32> = None;
  let retries = 3u8;
  let mut total = 0_i64;
  let enabled = true;

  for id in 1..=retries {
    total += id as i64;
    let guard = repo.lock().map_err(|_| "lock error".to_string())?;
    match guard.find_by_id(id as u64) {
      Some(user) if user.active && enabled && !false => {
        println!("{} {} {}", user.name, default_tag, note);
      }
      Some(_) => continue,
      None => break,
    }
  }

  if total > 0 && none_value.is_none() {
    return Ok(());
  }
  Err(format!("total={}, self={:?}", total, self::sync_users as usize))
    }
`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'meta.attribute.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.declaration.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.control.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'keyword.modifier.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'support.type.builtin.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.type.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'entity.name.function.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.namespace.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'entity.name.macro.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'variable.language.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'constant.language.boolean.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.language.null.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'constant.numeric.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'string.quoted.double.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.single.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'string.quoted.raw.rust')).toBe(true)
    expect(tokens.some((t) => t.scope === 'operator.rust')).toBe(true)
  })

  test('支持行注释与块注释', () => {
    const code = `// line comment
/* block
   comment */
fn run() -> i32 {
  return 1;
}`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.line.double-slash.rust')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'comment.block.rust')).toBe(true)
    expect(tokens.some((t) => t.text === 'run')).toBe(true)
  })

  test('未闭合字符串/注释不应崩溃', () => {
    const code = `let name = "coder
/* not closed`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'string.quoted.double.rust' ||
          t.scope === 'comment.block.rust'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `fn add(a: i32, b: i32) -> i32 {
  let sum = a + b;
  return sum;
}`
    const tokens = parse(code).flat()
    const returnToken = tokens.find(
      (t) => t.text === 'return' && t.scope === 'keyword.control.rust'
    )

    expect(returnToken?.line).toBe(3)
  })
})
