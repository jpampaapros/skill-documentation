#!/usr/bin/env node
// documentation skill — cross-platform installer
// Installs the skill into the project at process.cwd().
//
// Usage (from the target project root):
//   node <path-to-skill>/install.mjs
//   node <path-to-skill>/install.mjs --target=claude-code
//   node <path-to-skill>/install.mjs --target=cursor
//   node <path-to-skill>/install.mjs --target=codex
//   node <path-to-skill>/install.mjs --target=all
//   node <path-to-skill>/install.mjs --dry-run

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = dirname(fileURLToPath(import.meta.url));
const TARGET = process.cwd();
const CODEX_HOME = process.env.CODEX_HOME || join(homedir(), '.codex');

const args = process.argv.slice(2);
const getArg = (name) => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  return match ? match.split('=')[1] : null;
};
const hasFlag = (name) => args.includes(`--${name}`);

const target = getArg('target') || 'all';
const dryRun = hasFlag('dry-run');

if (hasFlag('help') || hasFlag('h')) {
  console.log(readFileSync(join(SOURCE, 'install.help.txt'), 'utf8').replace(/\n$/, ''));
  process.exit(0);
}

if (SOURCE === TARGET) {
  console.error('Refusing to install into the skill source directory itself.');
  console.error('Run this command from the target project root:');
  console.error(`  cd /path/to/your-project && node ${join(SOURCE, 'install.mjs')}`);
  process.exit(1);
}

const validTargets = ['claude-code', 'cursor', 'codex', 'all'];
if (!validTargets.includes(target)) {
  console.error(`Unknown target "${target}". Valid targets: ${validTargets.join(', ')}`);
  process.exit(1);
}

console.log('');
console.log('documentation skill installer');
console.log(`  source: ${SOURCE}`);
console.log(`  target: ${TARGET}`);
console.log(`  mode:   ${target}${dryRun ? ' (dry-run)' : ''}`);
console.log('');

const actions = [];

const OPERATION_COMMANDS = ['documentation-scaffold', 'documentation-update', 'documentation-bundle'];

function queueClaudeCode() {
  const skillDir = join(TARGET, '.claude', 'skills', 'documentation');
  const commandsDir = join(TARGET, '.claude', 'commands');

  actions.push({
    label: 'Claude Code (skill)',
    dest: skillDir,
    op: () => {
      mkdirSync(skillDir, { recursive: true });
      cpSync(join(SOURCE, 'SKILL.md'), join(skillDir, 'SKILL.md'));
      cpSync(join(SOURCE, 'assets'), join(skillDir, 'assets'), { recursive: true });
    },
  });
  for (const cmd of OPERATION_COMMANDS) {
    const dest = join(commandsDir, `${cmd}.md`);
    actions.push({
      label: `Claude Code (/${cmd.replace('documentation-', '')})`,
      dest,
      op: () => {
        mkdirSync(commandsDir, { recursive: true });
        cpSync(join(SOURCE, 'adapters', 'claude-code', `${cmd}.command.md`), dest);
      },
    });
  }
}

function queueCursor() {
  const rulesDir = join(TARGET, '.cursor', 'rules');
  const rulesDest = join(rulesDir, 'documentation.mdc');
  const commandsDir = join(TARGET, '.cursor', 'commands');

  actions.push({
    label: 'Cursor (rule)',
    dest: rulesDest,
    op: () => {
      mkdirSync(rulesDir, { recursive: true });
      cpSync(join(SOURCE, 'adapters', 'cursor', 'documentation.mdc'), rulesDest);
    },
  });
  for (const cmd of OPERATION_COMMANDS) {
    const dest = join(commandsDir, `${cmd}.md`);
    actions.push({
      label: `Cursor (/${cmd.replace('documentation-', '')})`,
      dest,
      op: () => {
        mkdirSync(commandsDir, { recursive: true });
        cpSync(join(SOURCE, 'adapters', 'cursor', `${cmd}.command.md`), dest);
      },
    });
  }
}

function queueCodex() {
  const agentsDest = join(TARGET, 'AGENTS.md');
  const skillDir = join(CODEX_HOME, 'skills', 'documentation');

  actions.push({
    label: 'Codex (ctx)',
    dest: agentsDest,
    op: () => {
      const snippet = readFileSync(join(SOURCE, 'adapters', 'codex', 'AGENTS.snippet.md'), 'utf8').trim();
      if (existsSync(agentsDest)) {
        const existing = readFileSync(agentsDest, 'utf8');
        if (existing.includes('<!-- documentation-skill:start -->')) {
          console.log(`  skipped (already installed): ${agentsDest}`);
          return;
        }
        writeFileSync(agentsDest, `${existing.trimEnd()}\n\n${snippet}\n`);
      } else {
        writeFileSync(agentsDest, `${snippet}\n`);
      }
    },
  });
  actions.push({
    label: 'Codex (skill)',
    dest: skillDir,
    op: () => {
      mkdirSync(skillDir, { recursive: true });
      cpSync(join(SOURCE, 'SKILL.md'), join(skillDir, 'SKILL.md'));
      cpSync(join(SOURCE, 'assets'), join(skillDir, 'assets'), { recursive: true });
    },
  });
}

const selected = target === 'all' ? ['claude-code', 'cursor', 'codex'] : [target];
for (const t of selected) {
  if (t === 'claude-code') queueClaudeCode();
  else if (t === 'cursor') queueCursor();
  else if (t === 'codex') queueCodex();
}

for (const a of actions) {
  console.log(`  ${a.label.padEnd(24)} -> ${a.dest}`);
  if (!dryRun) a.op();
}

console.log('');
console.log(dryRun ? 'dry run — nothing written.' : 'done.');
