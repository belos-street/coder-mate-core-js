# Agent Skills Index

## Available Skills

| Skill | Name | Description |
|-------|------|-------------|
| [belos-street](belos-street/skill.md) | Belos Street Coding Conventions | 个人编码习惯与最佳实践，包含命名规范、代码组织、代码风格和测试理念 |
| [brainstorming](brainstorming/SKILL.md) | Brainstorming Ideas Into Designs | 在任何创意工作前使用，通过自然对话协作将想法转化为完整的设计和规格说明 |
| [bun](bun/skill.md) | Bun Runtime | 快速、现代的 JavaScript 运行时和工具包，重要：这是 Bun，不是 Node.js |
| [writing-plans](writing-plans/SKILL.md) | Writing Plans | 当有规格说明或多步骤任务的需求时使用，在接触代码前编写完整的实现计划 |

---

## Skill Workflow

```
brainstorming (设计探索)
    ↓
writing-plans (编写计划)
    ↓
implementation (执行实现)
```

---

## Quick Reference

### When to use each skill:

| Situation | Skill |
|-----------|-------|
| 新功能/特性开发 | `brainstorming` |
| 需要实现计划 | `writing-plans` |
| 编码规范问题 | `belos-street` |
| Bun 项目开发 | `bun` |

---

## Skill Details

### brainstorming
- **触发条件**: 任何创意工作 - 创建功能、构建组件、添加功能或修改行为
- **核心原则**: 在展示设计并获得用户批准前，**不要**调用任何实现技能、编写代码或采取实施行动
- **输出**: 设计文档保存至 `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

### writing-plans
- **触发条件**: 已有规格说明或需求的多步骤任务
- **前置条件**: 应在 brainstorming 之后运行
- **输出**: 实现计划保存至 `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

### belos-street
- **用途**: 编码约定和最佳实践参考
- **内容**: 命名规范、代码组织、代码风格、测试理念

### bun
- **用途**: Bun 运行时开发参考
- **注意**: 使用 Bun 特有的 API，不要使用 Node.js 写法

---

## Sub-Skills Reference

### belos-street/reference
- [naming-conventions](belos-street/reference/naming-conventions.md) - 命名约定
- [code-organization](belos-street/reference/code-organization.md) - 代码组织
- [code-style](belos-street/reference/code-style.md) - 代码风格
- [testing-philosophy](belos-street/reference/testing-philosophy.md) - 测试理念

### bun/reference
- [basics](bun/reference/basics.md) - Bun 基础
- [cli-tools](bun/reference/cli-tools.md) - CLI 工具
- [package-manager](bun/reference/package-manager.md) - 包管理器
- [server](bun/reference/server.md) - 服务器开发
- [testing](bun/reference/testing.md) - 测试
- [toolchain](bun/reference/toolchain.md) - 工具链
