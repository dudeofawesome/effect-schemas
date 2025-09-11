import { describe, it, expect } from '@effect/vitest';
import { EmailString, UUIDv4 } from '@dudeofawesome/effect-schemas';

describe('index', () => {
  it('should import correctly from barrel', () => {
    expect(UUIDv4).toBeTruthy();
    expect(EmailString).toBeTruthy();
  });
});
