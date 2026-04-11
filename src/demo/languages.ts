import type { LanguageId } from './types'

export const LANGUAGE_LABELS: Record<LanguageId, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  css: 'CSS',
  bash: 'Bash',
  sql: 'SQL',
  yaml: 'YAML',
  markdown: 'Markdown',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  go: 'Go',
  rust: 'Rust',
  csharp: 'C#',
  php: 'PHP',
  html: 'HTML',
  json: 'JSON',
  python: 'Python'
}

export const LANGUAGE_SNIPPETS: Record<LanguageId, string> = {
  javascript: `/*
 * ES2020 完整语法测试
 * 演示所有核心语法特性
 */

// 1. 变量声明 + ES2020 BigInt
const num1 = 123n; // BigInt
const num2 = 0b1010n; // 二进制 BigInt
let str1 = "Hello, World!";
var x = 10;

// 2. ES2020 可选链和空值合并
const city = user?.address?.city ?? "Unknown";
const result = obj?.method?.() ?? "default";

// 3. ES2020 globalThis
console.log(globalThis);

// 4. ES2020 Promise.allSettled
Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));

// 5. ES2020 动态导入
import("./module.js")
  .then(module => {
    module.hello();
  })
  .catch(err => {
    console.error(err);
  });

// 6. 类定义
class Person extends Object {
  constructor(name, age) {
    super();
    this.name = name;
    this.age = age;
  }

  static create(name, age) {
    return new Person(name, age);
  }

  get info() {
    return \`\${this.name} is \${this.age} years old\`;
  }

  async greet() {
    await fetch('/api');
    return 'Hello';
  }
}

// 7. 箭头函数
const add = (a, b) => a + b;
const multiply = (x) => x * 2;

// 8. 模板字符串
const template = \`Hello, \${name}!
Welcome to ES2020.\`;

// 9. 多行注释
/*
 * 这是一个多行注释
 * 可以跨越多行
 */

// 10. 对象字面量
const obj = {
  key: "value",
  method() {
    return "hello";
  }
};

// 11. 运算符
const a = 10, b = 20;
const result2 = (a + b) * (a - b) === 0 && a || b;`,
  typescript: `import type { ApiUser, ApiResponse } from "./types"
export type UserId = string | number

interface User {
  readonly id: UserId
  name: string
  role?: "admin" | "guest"
}

type ValueOf<T> = T[keyof T]
type UnboxPromise<T> = T extends Promise<infer R> ? R : T
type EventName<T extends string> = \`on\${Capitalize<T>}\`

type ReadonlyPick<T, K extends keyof T> = {
  readonly [P in K]?: T[P]
}

type Pair = [head: string, ...tail: number[]]

enum Status {
  Active = "active",
  Disabled = "disabled"
}

abstract class BaseService<T extends object> {
  protected cache = new Map<string, T>()
}

class UserService<T extends User> extends BaseService<T> implements User {
  public id: UserId = 1
  public name: string = "coder"
  public role: "admin" | "guest" = "admin"
  private status: Status = Status.Active

  constructor(name: string) {
    super()
    this.name = name
  }

  get profile(): ReadonlyPick<T, "id" | "name"> {
    return { id: this.id as T["id"], name: this.name as T["name"] }
  }

  async load<R extends ApiResponse<ApiUser>>(resp: R): Promise<UnboxPromise<Promise<R>>> {
    return Promise.resolve(resp)
  }
}

function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null
}

const defaultConfig = {
  retry: 3,
  mode: "strict"
} as const

const settings = {
  cache: true,
  strategy: "lru"
} satisfies Record<string, unknown>

const service = new UserService<User>("Alice")
const role = service.profile.name!.toUpperCase()
const city: string = profile?.address?.city ?? "Unknown"`,
  css: `/* layout + theme */
:root {
  --brand: #2563eb;
  --surface: #f8fafc;
}

@media screen and (min-width: 768px) {
  .card-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

#app[data-theme="dark"] .card:hover::before {
  content: "new";
  color: rgba(255, 255, 255, 0.92) !important;
  background: linear-gradient(90deg, #1e293b, #0f172a);
  border: 1px solid var(--brand);
  transform: translateY(-2px);
}`,
  bash: `#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$ROOT_DIR/logs/deploy.log"

build() {
  local target="\${1:-prod}"
  echo "building for $target"
  npm run build | tee -a "$LOG_FILE"
}

if [ "\${CI:-false}" = "true" ]; then
  export NODE_ENV=production
  build "ci"
else
  build
fi`,
  sql: `-- analytics query
WITH paid_orders AS (
  SELECT o.user_id, SUM(o.total) AS paid_total
  FROM orders o
  WHERE o.status = 'paid' AND o.created_at >= :start_date
  GROUP BY o.user_id
)
SELECT u.id,
       u.email,
       COALESCE(p.paid_total, 0) AS revenue
FROM users u
LEFT JOIN paid_orders p ON p.user_id = u.id
WHERE u.deleted_at IS NULL
  AND u.region IN ('CN', 'US')
  AND u.id = $1
ORDER BY revenue DESC
LIMIT 20;`,
  yaml: `---
app:
  name: coder-mate
  version: 1
  enabled: true
  owner: &owner
    id: 42
    role: !user admin
  maintainers:
    - *owner
    - id: 7
      role: guest
  metadata:
    retries: 3
    timeout_ms: 1500
    note: "hello yaml"
...
`,
  markdown: `# Coder Mate Markdown Showcase

> Build once, highlight everywhere.  
> This block shows common Markdown syntax in one place.

## Quick Start

1. Install dependencies with \`bun install\`
2. Run tests with \`bun test\`
3. Start demo with \`bun run dev\`

## Lists

- Unordered item A
- Unordered item B
  - Nested item B.1
  - Nested item B.2
- Task list style:
  - [x] Core tokenizer
  - [x] Language registry
  - [ ] More language packs

## Text Styles

This sentence contains **bold**, *italic*, and \`inline code\`.
You can also write mixed emphasis like **bold with *italic* inside**.

## Links and Images

- Project docs: [coder-mate docs](https://example.com/docs)
- Issue tracker: [open issues](https://example.com/issues?q=is%3Aopen)
- Image syntax: ![architecture](https://example.com/diagram.png)

## Code Blocks

\`\`\`ts
type User = {
  id: number
  name: string
}

const greet = (user: User) => \`hello, \${user.name}\`
console.log(greet({ id: 1, name: "coder" }))
\`\`\`

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
echo "deploy start"
\`\`\`

## Table

| Language | Status | Notes |
| --- | --- | --- |
| JavaScript | done | baseline |
| Markdown | in progress | parser expansion |
| YAML | done | config focused |

## Quote + Rule

> Keep things practical first, then refine edge cases.

---

<!-- markdown comment -->
<details>
  <summary>Inline HTML in Markdown</summary>
  <p>Some markdown engines allow embedded HTML blocks.</p>
</details>
`,
  java: `package com.example.payment;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PaymentService extends BaseService implements AutoCloseable {
  private static final int MAX_RETRY = 3;
  private static final BigDecimal TAX_RATE = new BigDecimal("0.13");
  private final Map<String, PaymentOrder> cache = new ConcurrentHashMap<>();
  private final PaymentRepository repository;

  public PaymentService(PaymentRepository repository) {
    this.repository = repository;
  }

  @Override
  public void close() throws Exception {
    cache.clear();
  }

  public record PaymentResult(String id, BigDecimal amount, boolean success) {}

  public enum Status {
    CREATED, PAID, FAILED
  }

  public List<PaymentResult> settleBatch(List<PaymentOrder> orders) {
    if (orders == null || orders.isEmpty()) {
      return List.of();
    }

    var normalized = orders.stream()
      .filter(Objects::nonNull)
      .sorted(Comparator.comparing(PaymentOrder::createdAt))
      .map(this::normalize)
      .toList();

    String auditLog = """
      {
        "event": "settle_batch",
        "size": %d
      }
      """.formatted(normalized.size());
    System.out.println(auditLog);

    List<PaymentResult> results = new ArrayList<>();
    for (PaymentOrder order : normalized) {
      var amountWithTax = order.amount().multiply(BigDecimal.ONE.add(TAX_RATE));
      var saved = repository.save(order.id(), amountWithTax, LocalDateTime.now());
      var result = new PaymentResult(order.id(), amountWithTax, saved);
      results.add(result);
      cache.put(order.id(), order);
    }

    int failCount = (int) results.stream().filter(r -> !r.success()).count();
    int exitCode = switch (failCount) {
      case 0 -> 0;
      case 1, 2 -> 1;
      default -> 2;
    };

    if (exitCode > 0) {
      System.err.println("settle failed, code=" + exitCode);
    }

    return results;
  }

  private PaymentOrder normalize(PaymentOrder order) {
    String id = Optional.ofNullable(order.id()).orElse("UNKNOWN");
    char flag = 'Y';
    boolean active = true;
    long ts = 1710000000L;
    if (flag == 'Y' && active && ts > 0) {
      return order.withId(id.trim().toUpperCase());
    }
    return order;
  }

  public Map<Status, List<PaymentOrder>> groupByStatus(List<PaymentOrder> orders) {
    return orders.stream().collect(Collectors.groupingBy(PaymentOrder::status));
  }

  public PaymentOrder findOrThrow(String id) throws IOException {
    var order = repository.findById(id);
    if (order == null) {
      throw new IOException("order not found: " + id);
    }
    return order;
  }
}
`,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <stdint.h>

#define APP_NAME "coder-mate"
#define MAX_RETRY 3
#define SQUARE(x) ((x) * (x))
#define LOG(fmt, ...) printf("[LOG] " fmt "\\n", __VA_ARGS__)

typedef enum Status {
  STATUS_INIT = 0,
  STATUS_READY = 1,
  STATUS_FAILED = 2
} Status;

typedef struct User {
  int id;
  const char *name;
  bool active;
} User;

typedef int (*Comparator)(const User *lhs, const User *rhs);

static uint32_t total_count = 0;

static int compare_user_id(const User *lhs, const User *rhs) {
  if (lhs == NULL || rhs == NULL) {
    return 0;
  }
  return lhs->id - rhs->id;
}

static void print_users(const User users[], size_t len) {
  for (size_t i = 0; i < len; ++i) {
    const char *state = users[i].active ? "active" : "inactive";
    printf("user[%zu] id=%d name=%s state=%s\\n", i, users[i].id, users[i].name, state);
  }
}

int sum(int a, int b) {
  return a + b;
}

int main(void) {
  User users[] = {
    {1, "Alice", true},
    {2, "Bob", false},
    {3, "Carol", true}
  };
  size_t len = sizeof(users) / sizeof(users[0]);

  if (len == 0 || users[0].name == NULL) {
    fprintf(stderr, "invalid users for %s\\n", APP_NAME);
    return EXIT_FAILURE;
  }

  print_users(users, len);

  for (size_t i = 0; i < len; i++) {
    if (!users[i].active) {
      continue;
    }
    total_count += (uint32_t)SQUARE(users[i].id);
    if (total_count > 100) {
      break;
    }
  }

  size_t idx = 0;
  while (idx < len) {
    printf("while idx=%zu\\n", idx);
    idx++;
  }

  do {
    total_count -= (total_count > 0) ? 1u : 0u;
  } while (total_count > 9);

  char grade = 'A';
  switch (grade) {
    case 'A':
      puts("excellent");
      break;
    case 'B':
      puts("good");
      break;
    default:
      puts("normal");
      break;
  }

  Comparator cmp = compare_user_id;
  int diff = cmp(&users[0], &users[1]);
  LOG("diff=%d count=%u", diff, total_count);

  uint32_t *buffer = (uint32_t *)malloc(len * sizeof(uint32_t));
  if (buffer == NULL) {
    fprintf(stderr, "malloc failed\\n");
    return EXIT_FAILURE;
  }

  memset(buffer, 0, len * sizeof(uint32_t));
  for (size_t i = 0; i < len; ++i) {
    buffer[i] = (uint32_t)sum(users[i].id, (int)i);
    printf("buffer[%zu]=%u\\n", i, buffer[i]);
  }

  free(buffer);
  return EXIT_SUCCESS;
}
`,
  cpp: `#include <algorithm>
#include <iostream>
#include <memory>
#include <optional>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

#define APP_NAME "coder-mate-cpp"
#define LOG_INFO(msg) std::cout << "[INFO] " << msg << std::endl

namespace app {

enum class Status {
  Init = 0,
  Active = 1,
  Disabled = 2
};

struct User {
  int id;
  std::string name;
  bool active;
  Status status;
};

template <typename T>
class Repository final {
public:
  using MapType = std::unordered_map<int, T>;

  explicit Repository(MapType map) : data_(std::move(map)) {}

  void upsert(const T &value) {
    data_[value.id] = value;
  }

  std::optional<T> findById(int id) const {
    auto it = data_.find(id);
    if (it == data_.end()) {
      return std::nullopt;
    }
    return it->second;
  }

  std::vector<T> list() const {
    std::vector<T> items;
    items.reserve(data_.size());
    for (const auto &[id, value] : data_) {
      (void)id;
      items.push_back(value);
    }
    std::sort(items.begin(), items.end(), [](const T &lhs, const T &rhs) {
      return lhs.id < rhs.id;
    });
    return items;
  }

private:
  MapType data_;
};

inline std::string joinNames(const std::vector<User> &users) {
  std::string result;
  for (std::size_t i = 0; i < users.size(); ++i) {
    result += users[i].name;
    if (i + 1 < users.size()) {
      result += ", ";
    }
  }
  return result;
}

} // namespace app

int main() {
  app::Repository<app::User> repo({
    {1, {1, "Alice", true, app::Status::Active}},
    {2, {2, "Bob", false, app::Status::Disabled}},
    {3, {3, "Carol", true, app::Status::Active}}
  });

  repo.upsert({4, "Dave", true, app::Status::Init});
  auto allUsers = repo.list();

  const char level = 'A';
  const char *json = R"({"lang":"cpp","ok":true,"service":"highlight"})";

  LOG_INFO(APP_NAME);
  std::cout << "users: " << app::joinNames(allUsers) << std::endl;
  std::cout << "payload: " << json << std::endl;

  auto isEnabled = [](const app::User &user) {
    return user.active && user.status != app::Status::Disabled;
  };

  std::size_t enabledCount = 0;
  for (const auto &user : allUsers) {
    if (isEnabled(user) && level == 'A') {
      ++enabledCount;
    }
  }

  std::unique_ptr<int> ptr = std::make_unique<int>(42);
  if (ptr != nullptr) {
    std::cout << "ptr=" << *ptr << ", enabled=" << enabledCount << std::endl;
  }

  try {
    auto maybeUser = repo.findById(99);
    if (!maybeUser.has_value()) {
      throw std::runtime_error("user not found");
    }
  } catch (const std::exception &ex) {
    std::cerr << "error: " << ex.what() << std::endl;
  }

  return 0;
}
`,
  go: `package main

import (
  "context"
  "errors"
  "fmt"
  m "math"
  "strings"
  "sync"
  "time"
)

const AppName = "coder-mate-go"
const DefaultRetry = 3

type Status int

const (
  StatusInit Status = iota
  StatusActive
  StatusDisabled
)

type User struct {
  ID     int
  Name   string
  Active bool
  Status Status
}

type Repository interface {
  FindByID(ctx context.Context, id int) (*User, error)
  Save(ctx context.Context, user User) error
}

type InMemoryRepo struct {
  mu   sync.RWMutex
  data map[int]User
}

func NewInMemoryRepo(users []User) *InMemoryRepo {
  store := make(map[int]User, len(users))
  for _, user := range users {
    store[user.ID] = user
  }
  return &InMemoryRepo{data: store}
}

func (r *InMemoryRepo) FindByID(ctx context.Context, id int) (*User, error) {
  _ = ctx
  r.mu.RLock()
  defer r.mu.RUnlock()

  user, ok := r.data[id]
  if !ok {
    return nil, fmt.Errorf("user %d not found", id)
  }
  return &user, nil
}

func (r *InMemoryRepo) Save(ctx context.Context, user User) error {
  if ctx == nil {
    return errors.New("nil context")
  }
  r.mu.Lock()
  defer r.mu.Unlock()
  r.data[user.ID] = user
  return nil
}

func normalizeName(name string) string {
  parts := strings.Fields(strings.TrimSpace(name))
  for i := range parts {
    parts[i] = strings.Title(strings.ToLower(parts[i]))
  }
  return strings.Join(parts, " ")
}

func syncUsers(ctx context.Context, repo Repository, ids []int) error {
  ch := make(chan User, len(ids))
  errCh := make(chan error, 1)
  defer close(ch)
  defer close(errCh)

  go func() {
    for _, id := range ids {
      user, err := repo.FindByID(ctx, id)
      if err != nil || user == nil {
        continue
      }
      user.Name = normalizeName(user.Name)
      ch <- *user
    }
  }()

  timeout := time.After(100 * time.Millisecond)
  for {
    select {
    case <-ctx.Done():
      return ctx.Err()
    case <-timeout:
      return nil
    case err := <-errCh:
      if err != nil {
        return err
      }
    case user := <-ch:
      score := m.Abs(float64(user.ID))
      tag := 'A'
      raw := \`{"from":"go","ok":true}\`
      fmt.Printf("%s user=%s score=%.1f tag=%c payload=%s\\n", AppName, user.Name, score, tag, raw)
      if !user.Active || user.Status == StatusDisabled {
        continue
      }
      if err := repo.Save(ctx, user); err != nil {
        return err
      }
    default:
      break
    }
  }
}

func main() {
  repo := NewInMemoryRepo([]User{
    {ID: 1, Name: "alice", Active: true, Status: StatusActive},
    {ID: 2, Name: "bob", Active: false, Status: StatusDisabled},
    {ID: 3, Name: "carol", Active: true, Status: StatusInit},
  })
  ctx, cancel := context.WithTimeout(context.Background(), time.Second)
  defer cancel()

  if err := syncUsers(ctx, repo, []int{1, 2, 3, 4}); err != nil {
    fmt.Println("sync failed:", err)
  }
}
`,
  rust: `use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;

#[derive(Debug, Clone)]
pub struct User {
  pub id: u64,
  pub name: String,
  pub active: bool,
}

#[derive(Debug, Clone, Copy)]
pub enum Status {
  Init,
  Active,
  Disabled,
}

pub trait UserRepo {
  fn find_by_id(&self, id: u64) -> Option<User>;
  fn save(&mut self, user: User) -> Result<(), String>;
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

  fn save(&mut self, user: User) -> Result<(), String> {
    self.store.insert(user.id, user);
    Ok(())
  }
}

pub async fn sync_users(repo: Arc<Mutex<InMemoryRepo>>) -> Result<(), String> {
  let retries = 3u8;
  let tag = 'A';
  let raw = r#"{"lang":"rust","ok":true}"#;
  let none_value: Option<u64> = None;
  let mut total: i64 = 0;

  for id in 1..=retries {
    total += id as i64;
    let guard = repo.lock().map_err(|_| "lock error".to_string())?;
    match guard.find_by_id(id as u64) {
      Some(user) if user.active => {
        println!("user={} tag={} payload={}", user.name, tag, raw);
      }
      Some(_) => continue,
      None => break,
    }
  }

  if total > 0 && none_value.is_none() {
    tokio::time::sleep(Duration::from_millis(10)).await;
    return Ok(());
  }
  Err(format!("sync failed: total={}, self={:?}", total, self::sync_users))
}

#[tokio::main]
async fn main() {
  let repo = Arc::new(Mutex::new(InMemoryRepo::new(vec![
    User { id: 1, name: "Alice".to_string(), active: true },
    User { id: 2, name: "Bob".to_string(), active: false },
    User { id: 3, name: "Carol".to_string(), active: true },
  ])));

  if let Err(err) = sync_users(repo.clone()).await {
    eprintln!("error: {}", err);
  }
}
`,
  csharp: `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Demo.Highlighter;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class TracingAttribute : Attribute
{
  public string Name { get; }
  public TracingAttribute(string name) => Name = name;
}

public enum UserStatus
{
  Init = 0,
  Active = 1,
  Disabled = 2
}

public readonly record struct User(int Id, string Name, bool Active, UserStatus Status);

public interface IUserRepository
{
  Task<User?> FindByIdAsync(int id, CancellationToken ct);
  Task SaveAsync(User user, CancellationToken ct);
}

public sealed class InMemoryRepository : IUserRepository
{
  private readonly Dictionary<int, User> _store = new();
  private readonly object _gate = new();

  public InMemoryRepository(IEnumerable<User> seed)
  {
    foreach (var user in seed)
    {
      _store[user.Id] = user;
    }
  }

  public Task<User?> FindByIdAsync(int id, CancellationToken ct)
  {
    ct.ThrowIfCancellationRequested();
    return Task.FromResult(_store.TryGetValue(id, out var user) ? user : (User?)null);
  }

  public Task SaveAsync(User user, CancellationToken ct)
  {
    ct.ThrowIfCancellationRequested();
    lock (_gate)
    {
      _store[user.Id] = user;
    }
    return Task.CompletedTask;
  }
}

public delegate void SyncCompletedHandler(int syncedCount);

[Tracing("sync-service")]
public sealed class UserSyncService
{
  private readonly IUserRepository _repository;
  public event SyncCompletedHandler? SyncCompleted;

  public UserSyncService(IUserRepository repository) => _repository = repository;

  public async Task<List<User>> SyncAsync(IEnumerable<int> ids, CancellationToken ct = default)
  {
#if DEBUG
    Console.WriteLine("sync in debug mode");
#endif
    var path = @"C:\\temp\\logs\\sync.log";
    var payload = """
{
  "lang": "csharp",
  "feature": "tokenizer",
  "ok": true
}
""";
    char tag = 'A';
    bool enabled = true;
    object? maybe = null;

    var picked = new List<User>();
    foreach (var id in ids)
    {
      if (id <= 0)
      {
        continue;
      }

      var found = await _repository.FindByIdAsync(id, ct);
      if (found is null || !found.Value.Active)
      {
        continue;
      }
      picked.Add(found.Value);
    }

    var normalized = picked
      .Where(u => u.Status is UserStatus.Active or UserStatus.Init)
      .OrderBy(u => u.Name)
      .Select(u => u with { Name = u.Name.Trim() })
      .ToList();

    var query = from u in normalized
                where u.Active
                group u by u.Status into g
                orderby g.Key
                select new { Status = g.Key, Count = g.Count() };

    foreach (var item in query)
    {
      Console.WriteLine($"status={item.Status} count={item.Count} tag={tag}");
    }

    try
    {
      foreach (var user in normalized)
      {
        await _repository.SaveAsync(user, ct);
      }

      if (enabled && maybe is null)
      {
        SyncCompleted?.Invoke(normalized.Count);
      }

      return normalized;
    }
    catch (OperationCanceledException)
    {
      throw;
    }
    catch (Exception ex) when (ex.Message.Length > 0)
    {
      Console.Error.WriteLine($"sync failed: {ex.Message}; file={path}; payload={payload}");
      return [];
    }
    finally
    {
      Console.WriteLine("sync finished");
    }
  }
}

public static class Program
{
  public static async Task Main()
  {
    var repo = new InMemoryRepository(new[]
    {
      new User(1, " Alice ", true, UserStatus.Active),
      new User(2, "Bob", false, UserStatus.Disabled),
      new User(3, "Carol", true, UserStatus.Init)
    });

    var service = new UserSyncService(repo);
    service.SyncCompleted += count => Console.WriteLine($"synced={count}");

    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(1));
    var result = await service.SyncAsync(new[] { 1, 2, 3, 4 }, cts.Token);
    Console.WriteLine($"done total={result.Count}");
  }
}
`,
  php: `<?php
declare(strict_types=1);

namespace App\\Service;

use DateTimeImmutable;
use RuntimeException;
use Throwable;

interface UserRepository
{
  public function findById(int $id): ?array;
  public function save(array $user): void;
}

trait LogsActivity
{
  protected function log(string $message): void
  {
    echo "[LOG] " . $message . PHP_EOL;
  }
}

enum SyncStatus: string
{
  case Init = 'init';
  case Running = 'running';
  case Done = 'done';
  case Failed = 'failed';
}

final class InMemoryUserRepository implements UserRepository
{
  private array $store = [];

  public function __construct(array $seed = [])
  {
    foreach ($seed as $user) {
      $id = (int)($user['id'] ?? 0);
      if ($id > 0) {
        $this->store[$id] = $user;
      }
    }
  }

  public function findById(int $id): ?array
  {
    return $this->store[$id] ?? null;
  }

  public function save(array $user): void
  {
    $id = (int)($user['id'] ?? 0);
    if ($id <= 0) {
      throw new RuntimeException('invalid id');
    }
    $this->store[$id] = $user;
  }
}

#[Service('user-sync')]
final class UserSyncService
{
  use LogsActivity;

  private const MAX_RETRY = 3;

  public function __construct(
    private readonly UserRepository $repo
  ) {}

  public function sync(array $ids, bool $dryRun = false): array
  {
    $status = SyncStatus::Init;
    $result = [];
    $attempt = 0;
    $startedAt = new DateTimeImmutable('now');
    $path = __DIR__ . '/sync.log';
    $cmdOutput = \`whoami\`;
    $enabled = true;

    while ($attempt < self::MAX_RETRY) {
      $attempt++;
      if (!$enabled) {
        break;
      }
      $status = SyncStatus::Running;
      foreach ($ids as $id) {
        if (!is_int($id) || $id <= 0) {
          continue;
        }

        $row = $this->repo->findById($id);
        if ($row === null) {
          $row = [
            'id' => $id,
            'name' => 'user-' . $id,
            'active' => true,
            'tags' => ['new', 'sync']
          ];
        }

        if (($row['active'] ?? false) !== true) {
          continue;
        }

        $row['synced_at'] = $startedAt->format(DateTimeImmutable::ATOM);
        $row['status'] = match (true) {
          $id % 2 === 0 => 'even',
          default => 'odd'
        };

        if (!$dryRun) {
          $this->repo->save($row);
        }
        $result[] = $row;
      }

      if (count($result) > 0) {
        $status = SyncStatus::Done;
        break;
      }
      do {
        $enabled = $attempt < self::MAX_RETRY;
      } while (false);
    }

    try {
      if ($status !== SyncStatus::Done) {
        throw new RuntimeException('sync failed: ' . $status->value);
      }

      $summary = array_map(
        fn(array $u): string => (string)($u['name'] ?? 'unknown'),
        $result
      );
      $this->log('path=' . $path . '; cmd=' . trim((string)$cmdOutput));
      return [
        'ok' => true,
        'status' => $status->value,
        'count' => count($result),
        'users' => $summary
      ];
    } catch (Throwable $ex) {
      $status = SyncStatus::Failed;
      return [
        'ok' => false,
        'status' => $status->value,
        'error' => $ex->getMessage()
      ];
    } finally {
      $this->log('finished with status=' . $status->value);
    }
  }
}

$repo = new InMemoryUserRepository([
  ['id' => 1, 'name' => 'Alice', 'active' => true],
  ['id' => 2, 'name' => 'Bob', 'active' => false],
  ['id' => 3, 'name' => 'Carol', 'active' => true],
]);

$service = new UserSyncService($repo);
$response = $service->sync([1, 2, 3, 4], dryRun: false);
echo json_encode($response, JSON_PRETTY_PRINT) . PHP_EOL;
?>`,
  html: `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="HTML syntax showcase for tokenizer demo" />
    <meta name='theme-color' content='#0f172a' />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preload" as="image" href="/hero.webp" />
    <title>Coder Mate HTML Showcase</title>
    <style>
      :root { --brand: #2563eb; }
      body { margin: 0; font-family: system-ui; }
      .card { border: 1px solid #ddd; padding: 12px; }
    </style>
  </head>
  <body class="theme-light" data-mode='demo' data-version=1>
    <!-- 顶部导航 -->
    <header id="top" class="site-header">
      <h1>HTML&nbsp;Tokenizer&nbsp;Demo</h1>
      <p>Common tags, attrs, entities: &amp; &lt; &gt; &copy;</p>
      <nav aria-label="main nav">
        <a href="#content">Content</a>
        <a href="#form" target="_blank" rel="noopener noreferrer">Form</a>
        <a href="#table">Table</a>
      </nav>
    </header>

    <main id="content">
      <section class="card" aria-labelledby="text-title">
        <h2 id="text-title">Text Semantics</h2>
        <p>
          This is <strong>strong</strong>, <em>emphasis</em>, <mark>mark</mark>,
          <small>small</small>, <code>inline-code</code>, <kbd>Ctrl + K</kbd>.
        </p>
        <blockquote cite="https://example.com">
          Keep it simple, keep it robust.
        </blockquote>
        <pre><code>&lt;button type="button"&gt;Hello&lt;/button&gt;</code></pre>
        <hr />
      </section>

      <section class="card" aria-labelledby="list-title">
        <h2 id="list-title">Lists</h2>
        <ul>
          <li>unordered item A</li>
          <li>unordered item B</li>
        </ul>
        <ol start=3>
          <li>ordered item C</li>
          <li>ordered item D</li>
        </ol>
        <dl>
          <dt>HTML</dt>
          <dd>HyperText Markup Language</dd>
        </dl>
      </section>

      <section class="card" aria-labelledby="media-title">
        <h2 id="media-title">Media</h2>
        <img src="/cover.png" alt="cover" width=240 loading=lazy decoding=async />
        <picture>
          <source srcset="/hero.avif" type="image/avif" />
          <source srcset='/hero.webp' type='image/webp' />
          <img src="/hero.jpg" alt="hero image fallback" />
        </picture>
        <video controls preload="metadata" width="320">
          <source src="/intro.mp4" type="video/mp4" />
          <track kind="captions" src="/intro.vtt" srclang="en" label="English" />
        </video>
        <audio controls>
          <source src="/intro.mp3" type="audio/mpeg" />
        </audio>
        <iframe src="https://example.com" title="preview" loading=lazy></iframe>
      </section>

      <section id="form" class="card" aria-labelledby="form-title">
        <h2 id="form-title">Form</h2>
        <form action="/submit" method="post" autocomplete=on novalidate>
          <fieldset>
            <legend>User Profile</legend>

            <label for="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@example.com" />

            <label for='password'>Password</label>
            <input id='password' name='password' type='password' minlength=8 />

            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows=4 cols="36">Hello world</textarea>

            <label for="role">Role</label>
            <select id="role" name="role">
              <option value="">Please select</option>
              <option value="admin">Admin</option>
              <option value="editor" selected>Editor</option>
            </select>

            <label>
              <input type="checkbox" name="agree" checked />
              I agree to terms
            </label>

            <label>
              <input type="radio" name="plan" value="pro" />
              Pro
            </label>
            <label>
              <input type="radio" name="plan" value="team" />
              Team
            </label>

            <input type=text name=token value=abc123 readonly />
            <button type="submit">Submit</button>
            <button type="reset" disabled>Reset</button>
          </fieldset>
        </form>
      </section>

      <section id="table" class="card" aria-labelledby="table-title">
        <h2 id="table-title">Table</h2>
        <table>
          <caption>Quarterly Revenue</caption>
          <thead>
            <tr>
              <th scope="col">Quarter</th>
              <th scope="col">Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>$12,000</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>$18,500</td>
            </tr>
          </tbody>
        </table>
      </section>

      <details>
        <summary>More content</summary>
        <p>Hidden by default, expanded on click.</p>
      </details>
    </main>

    <footer class="site-footer">
      <p>Built with semantic HTML and tokenizer-friendly syntax.</p>
      <br />
    </footer>

    <!-- 多行注释示例
         tokenizer should keep this as comment.block.html -->
    <script type="module">
      const root = document.getElementById("top");
      if (root) root.dataset.ready = "true";
    </script>
  </body>
</html>`,
  json: `{
  "project": "coder-mate-core-js",
  "version": 1,
  "stable": true,
  "threshold": -12.5e+2,
  "items": [1, 2, 3],
  "meta": null
}`,
  python: `from typing import Optional, Iterable
from dataclasses import dataclass

DEFAULT_LIMIT = 5

@dataclass
class User:
    id: int
    name: str
    score: float = 0.0


def to_label(user: User, idx: int) -> str:
    note = """multi-line
python doc text"""
    return f"[{idx:02d}] {user.name!r} => {user.score:.2f} | {note!s}"


class UserService:
    def __init__(self, source: str = "users.txt") -> None:
        self.source = source

    @staticmethod
    def normalize_name(name: str) -> str:
        return name.strip().title()

    async def fetch_remote(self, key: str) -> Optional[str]:
        # 模拟异步流程
        await sleep(0)
        return key if key else None

    def load(self, limit: int = DEFAULT_LIMIT) -> list[str]:
        values = [x for x in range(limit) if x > 0]
        tags = {f"u-{x}" for x in values}
        index_map = {x: f"item-{x}" for x in values}

        try:
            with open(self.source) as f:
                first_line = f.readline()
        except OSError as err:
            print(err)
            first_line = "fallback"

        if first_line is None:
            return []

        users = [
            User(id=i, name=self.normalize_name(f"user_{i}"), score=float(i) / 3)
            for i in values
        ]

        result = [to_label(u, i) for i, u in enumerate(users) if u.score >= 0]

        match len(result):
            case 0:
                return ["empty"]
            case 1:
                return result
            case _:
                return [f"{line} | {index_map.get(i, 'N/A')}" for i, line in enumerate(result)]


def sum_positive(nums: Iterable[int]) -> int:
    total = 0
    for n in nums:
        if n is None:
            continue
        if n > 0:
            total += n
    return total


service = UserService()
lines = service.load()
print(lines)
print(sum_positive([1, 2, 3, -4]))`
}
