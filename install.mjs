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
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = dirname(fileURLToPath(import.meta.url));
const TARGET = process.cwd();

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

function queueClaudeCode() {
  const destDir = join(TARGET, '.claude', 'skills', 'documentation');
  actions.push({
    label: 'Claude Code',
    dest: destDir,
    op: () => {
      mkdirSync(destDir, { recursive: true });
      cpSync(join(SOURCE, 'SKILL.md'), join(destDir, 'SKILL.md'));
      cpSync(join(SOURCE, 'assets'), join(destDir, 'assets'), { recursive: true });
    },
  });
}

function queueCursor() {
  const destDir = join(TARGET, '.cursor', 'rules');
  const dest = join(destDir, 'documentation.mdc');
  actions.push({
    label: 'Cursor',
    dest,
    op: () => {
      mkdirSync(destDir, { recursive: true });
      cpSync(join(SOURCE, 'adapters', 'cursor', 'documentation.mdc'), dest);
    },
  });
}

function queueCodex() {
  const dest = join(TARGET, 'AGENTS.md');
  actions.push({
    label: 'Codex',
    dest,
    op: () => {
      const snippet = readFileSync(join(SOURCE, 'adapters', 'codex', 'AGENTS.snippet.md'), 'utf8').trim();
      if (existsSync(dest)) {
        const existing = readFileSync(dest, 'utf8');
        if (existing.includes('<!-- documentation-skill:start -->')) {
          console.log(`  skipped (already installed): ${dest}`);
          return;
        }
        writeFileSync(dest, `${existing.trimEnd()}\n\n${snippet}\n`);
      } else {
        writeFileSync(dest, `${snippet}\n`);
      }
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
  console.log(`  ${a.label.padEnd(12)} -> ${a.dest}`);
  if (!dryRun) a.op();
}

console.log('');
console.log(dryRun ? 'dry run — nothing written.' : 'done.');
