import fs from 'node:fs';
import path from 'node:path';

function parseDotenv(text) {
  const values = {};

  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !(key in values)) {
      values[key] = value;
    }
  }

  return values;
}

export function loadContactEnv(cwd = process.cwd()) {
  const envPath = path.join(cwd, '.env');
  const fileValues = fs.existsSync(envPath)
    ? parseDotenv(fs.readFileSync(envPath, 'utf8'))
    : {};

  return {
    ...fileValues,
    ...process.env,
  };
}

export function maskSecret(value) {
  if (!value) {
    return '(missing)';
  }

  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
