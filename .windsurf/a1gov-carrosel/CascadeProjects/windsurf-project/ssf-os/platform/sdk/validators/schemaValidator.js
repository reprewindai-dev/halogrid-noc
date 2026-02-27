import { ZodError } from 'zod';

export async function schemaValidator({ schema, output }) {
  if (!schema) {
    return {
      id: 'schema_validator',
      label: 'Schema Validator',
      passed: true,
      details: 'No schema provided; skipping.',
      disclaimers: [],
    };
  }
  try {
    schema.parse(output);
    return {
      id: 'schema_validator',
      label: 'Schema Validator',
      passed: true,
      details: 'Schema validated.',
      disclaimers: [],
    };
  } catch (err) {
    const issues = err instanceof ZodError ? err.issues : [{ message: err.message }];
    return {
      id: 'schema_validator',
      label: 'Schema Validator',
      passed: false,
      details: issues.map((i) => i.message).join('; '),
      disclaimers: [],
    };
  }
}
