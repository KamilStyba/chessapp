import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transformSync } from 'esbuild';

const EXT_TRY = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    const base = context.parentURL ? new URL(specifier, context.parentURL) : new URL(pathToFileURL(specifier));
    if (existsSync(fileURLToPath(base))) {
      return nextResolve(specifier, context);
    }
    for (const ext of EXT_TRY) {
      const candidate = new URL(specifier + ext, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return { url: candidate.href, shortCircuit: true, format: 'ts' };
      }
    }
  }
  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  if (context.format === 'ts' || url.endsWith('.ts') || url.endsWith('.tsx')) {
    const path = fileURLToPath(url);
    const src = readFileSync(path, 'utf8');
    const { code } = transformSync(src, {
      loader: url.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'es2022',
    });
    return { format: 'module', source: code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
