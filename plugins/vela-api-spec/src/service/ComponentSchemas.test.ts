import { describe, it, expect } from '@jest/globals';
import { ComponentSchemas } from './ComponentSchemas';

describe('ComponentSchemas', () => {
  let schemas: ComponentSchemas;

  beforeEach(() => {
    schemas = new ComponentSchemas();
  });

  it('should return all component schemas', () => {
    const allSchemas = schemas.getAllSchemas();
    expect(allSchemas).toBeDefined();
    expect(Object.keys(allSchemas)).toContain('hero');
    expect(Object.keys(allSchemas)).toContain('features');
    expect(Object.keys(allSchemas)).toContain('cta');
  });

  it('should return specific component schema', () => {
    const heroSchema = schemas.getSchema('hero');
    expect(heroSchema).toBeDefined();
    expect(heroSchema.required).toContain('title');
    expect(heroSchema.required).toContain('cta');
  });

  it('should return null for unknown component type', () => {
    const schema = schemas.getSchema('unknown-component');
    expect(schema).toBeNull();
  });

  it('should have example in hero schema', () => {
    const heroSchema = schemas.getSchema('hero');
    expect(heroSchema.example).toBeDefined();
    expect(heroSchema.example.type).toBe('hero');
  });
});
