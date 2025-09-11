import { Effect, Schema as S } from 'effect';
import { Url } from '@effect/platform';

export const UrlString = S.String.pipe(
  S.filterEffect((value) =>
    Url.fromString(value).pipe(
      Effect.map(() => !value.includes(':///')),
      Effect.catchAll(() => Effect.succeed(false)),
    ),
  ),
);

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

export const EmailString: () => S.Schema<EmailString> = () =>
  S.TemplateLiteral(S.String, '@', S.String).pipe(S.pattern(/\S+@\S+/u));
