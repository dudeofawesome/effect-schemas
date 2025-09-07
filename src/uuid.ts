import { ParseResult, Schema as S } from 'effect';

type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`;
function isUUIDv4(str: string): str is UUIDv4 {
  return (
    str.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu,
    ) != null
  );
}
export const UUIDv4: S.Schema<UUIDv4, string> = S.transformOrFail(
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
      isUUIDv4(input)
        ? ParseResult.succeed(input)
        : ParseResult.fail(
            new ParseResult.Type(ast, input, `Input is not a UUIDv4`),
          ),
    encode: (s) => ParseResult.succeed(s),
  },
);
