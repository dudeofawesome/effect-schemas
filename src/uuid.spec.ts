import { Effect, Exit, Schema as S } from 'effect';
import { describe, it, expect } from '@effect/vitest';

import { UUID, UUIDv4 } from './uuid.js';

describe('uuid', () => {
  describe('UUID', () => {
    it.effect.each([
      '00000000-0000-0000-0000-000000000000',
      'B6BBAF20-1323-3711-8982-1D952875B310',
      'B6BBAF20-1323-4711-8982-1D952875B310',
      'D10746E4-52F9-4768-B2FA-254390F4F10A',
      'C30CAE8E-8E05-4199-A900-1F222FCF550A',
      '9C7D99C4-1387-4952-B042-AF1EFA3CAAB6',
      'B6BBAF20-1323-5711-8982-1D952875B310',
      'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
    ] as (typeof UUID.Type)[])(`should parse valid UUID "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UUID)(str).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(str));
      }),
    );

    it.effect.each([
      '',
      'no',
      '000000000000000000000000000000000000',
      '------------------------------------',
    ])(`shouldn't parse invalid UUID "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UUID)(str).pipe(Effect.exit);
        expect(Exit.isFailure(result)).toBe(true);
      }),
    );
  });

  describe('UUIDv4', () => {
    it.effect.each([
      'B6BBAF20-1323-4711-8982-1D952875B310',
      'D10746E4-52F9-4768-B2FA-254390F4F10A',
      'C30CAE8E-8E05-4199-A900-1F222FCF550A',
      '9C7D99C4-1387-4952-B042-AF1EFA3CAAB6',
    ] as UUIDv4[])(`should parse valid UUIDv4 "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UUIDv4())(str).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(str));
      }),
    );

    it.effect.each([
      '',
      'no',
      '000000000000000000000000000000000000',
      '------------------------------------',
      '00000000-0000-0000-0000-000000000000',
      'B6BBAF20-1323-A711-8982-1D952875B310',
    ])(`shouldn't parse invalid UUIDv4 "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UUIDv4())(str).pipe(Effect.exit);
        expect(Exit.isFailure(result)).toBe(true);
      }),
    );
  });
});
