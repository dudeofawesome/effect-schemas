import { Effect, Schema as S } from 'effect';
import { Url } from '@effect/platform';

/**
 * Validates that the given string is a valid URL using the
 * [`URL` constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL).
 */
export const UrlString = S.String.pipe(
  S.filterEffect((value) =>
    Url.fromString(value).pipe(
      Effect.map(() => !value.includes(':///')),
      Effect.catchAll(() => Effect.succeed(false)),
    ),
  ),
);

/**
 * Validates that the given string is a valid
 * [origin](https://web.dev/articles/url-parts#origin), and only an origin.
 */
export const UrlOriginString = UrlString.pipe(
  S.filterEffect((value) =>
    Url.fromString(value).pipe(
      Effect.map((url) => {
        if (url.pathname !== '/') return `Must not have a path`;
        if (url.search !== '') return `Must not have a search string`;
        if (url.hash !== '') return `Must not have a hash string`;
        if (url.username !== '' || url.password !== '')
          return `Must not have basic auth`;
        return true;
      }),
      Effect.catchAll(() => Effect.succeed(`Must be a valid URL`)),
    ),
  ),
);

export type EmailString = `${string}@${string}`;

/**
 * Validates that the given string looks like an email. Is extremely permissive,
 * allowing emails such as `x@x`.
 */
export const EmailString: () => S.Schema<EmailString> = () =>
  S.TemplateLiteral(S.String, '@', S.String).pipe(S.pattern(/\S+@\S+/u));
