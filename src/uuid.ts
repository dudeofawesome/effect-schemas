import { ParseResult, Schema as S, Match } from 'effect';

function isNilUUID<
  Masquerade extends string = '00000000-0000-0000-0000-000000000000',
>(str: string): str is Masquerade {
  return str === '00000000-0000-0000-0000-000000000000';
}

function isOmniUUID<
  Masquerade extends string = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
>(str: string): str is Masquerade {
  return str === 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
function isUUID(str: string): str is UUID {
  return (
    isNilUUID(str) ||
    isOmniUUID(str) ||
    str.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
    ) != null
  );
}
export const UUID: S.Schema<UUID, string> = S.transformOrFail(
  S.String,
  S.TemplateLiteral(
    S.String,
    '-',
    S.String,
    '-',
    S.String,
    '-',
    S.String,
    '-',
    S.String,
  ),
  {
    strict: true,
    decode: (input, options, ast) =>
      isUUID(input)
        ? ParseResult.succeed(input)
        : ParseResult.fail(
            new ParseResult.Type(ast, input, `Input is not a UUID`),
          ),
    encode: (s) => ParseResult.succeed(s),
  },
);

export type UUIDv4 = `${string}-${string}-4${string}-${string}-${string}`;
function isUUIDv4(str: string): str is UUIDv4 {
  return (
    str.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
    ) != null
  );
}
export const UUIDv4: (opts: {
  includeSpecial: boolean;
}) => S.Schema<UUIDv4, string> = (
  { includeSpecial } = { includeSpecial: true },
) =>
  S.transformOrFail(
    S.String,
    S.TemplateLiteral(
      S.String,
      '-',
      S.String,
      '-4',
      S.String,
      '-',
      S.String,
      '-',
      S.String,
    ),
    {
      strict: true,
      decode: (input, options, ast) =>
        Match.value({
          v4: isUUIDv4(input),
          includeSpecial,
          nil: isNilUUID<UUIDv4>(input),
          omni: isOmniUUID<UUIDv4>(input),
        }).pipe(
          Match.whenOr(
            { v4: true },
            { includeSpecial: true, nil: true },
            { includeSpecial: true, omni: true },
            () => ParseResult.succeed(input as UUIDv4),
          ),
          Match.orElse(() =>
            ParseResult.fail(
              new ParseResult.Type(ast, input, `Input is not a UUIDv4`),
            ),
          ),
        ),
      encode: (s) => ParseResult.succeed(s),
    },
  );
