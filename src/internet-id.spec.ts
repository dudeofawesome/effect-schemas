import { Effect, Exit, Schema as S } from 'effect';
import { describe, it, expect } from '@effect/vitest';

import { UrlString, UrlOriginString, EmailString } from './internet-id.js';

describe('internet-id', () => {
  describe('UrlString', () => {
    it.effect.each([
      'https://example.com',
      'https://example.com:443',
      'http://example.com',
    ])(`should parse valid origin "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UrlString)(str).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(str));
      }),
    );

    it.effect.each([
      'https://example.com/foo',
      'https://example.com:443/foo',
      'https://example.com/foo#bar',
      'https://example.com/foo?bar=baz',
    ])(`should parse valid URL "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UrlString)(str).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(str));
      }),
    );

    it.effect.each(['', 'example.com', 'https://', '/foo', 'https:///qux'])(
      `shouldn't parse incomplete URL "%s"`,
      (str) =>
        Effect.gen(function* () {
          const result = yield* S.decode(UrlString)(str).pipe(Effect.exit);
          expect(Exit.isFailure(result)).toBe(true);
          // expect(Exit.isFailure(result) ? result.cause : false).toMatchObject({
          //   failure: { _id: 'ParseError' },
          // });
        }),
    );
  });

  describe('UrlOriginString', () => {
    it.effect.each([
      'https://example.com',
      'https://example.com:443',
      'http://example.com',
    ])(`should parse valid origin "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UrlOriginString)(str).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(str));
      }),
    );

    it.effect.each([
      '',
      'https://example.com/foo',
      'https://example.com#bar',
      'https://example.com?bar=baz',
      'https://user:pass@example.com',
      'example.com',
    ])(`shouldn't parse URL with extra components "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(UrlOriginString)(str).pipe(Effect.exit);
        expect(Exit.isFailure(result)).toBe(true);
      }),
    );
  });

  describe(EmailString.name, () => {
    it.effect.each([
      'test@example.com',
      'test+plus@example.com',
      'test.dot@example.com',
      'test@sub.example.com',
      '1@example.com',
      '1a@example.com',
      'test@example',
    ] as EmailString[])(`should parse valid email "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(EmailString())(str).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(str));
      }),
    );

    it.effect.each([
      '',
      'test',
      'test@',
      'example.com',
      '@example.com',
      'foo @example.com',
    ] as EmailString[])(`shouldn't parse invalid email "%s"`, (str) =>
      Effect.gen(function* () {
        const result = yield* S.decode(EmailString())(str).pipe(Effect.exit);
        expect(Exit.isFailure(result)).toBe(true);
      }),
    );
  });
});
