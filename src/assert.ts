import { AiFileAssertions } from "./types";

export interface AssertionResult {
  passed: boolean;
  error?: string;
}

export function checkAssertions(
  output: string,
  assertions: AiFileAssertions,
): AssertionResult {
  const checks = normalizeContains(assertions.contains);

  for (const expected of checks) {
    if (!output.toLowerCase().includes(expected.toLowerCase())) {
      return {
        passed: false,
        error: `missing "${expected}"`,
      };
    }
  }

  return { passed: true };
}

function normalizeContains(
  value: string | string[] | undefined,
): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
