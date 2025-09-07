import { Schema as S } from 'effect';

export const UrlString = S.String.pipe(
  S.filter((value) => {
    try {
      new URL(value);
      return !value.includes(':///');
    } catch (_) {
      return false;
    }
  }),
);

export const UrlOriginString = UrlString.pipe(
  S.filter((value) => {
    try {
      const url = new URL(value);
      if (url.pathname !== '/') return `Must not have a path`;
      if (url.search !== '') return `Must not have a search string`;
      if (url.hash !== '') return `Must not have a hash string`;
      return true;
    } catch (_) {
      return `Must be a valid URL`;
    }
  }),
);

export const EmailString = S.TemplateLiteral(S.String, '@', S.String).pipe(
  S.pattern(/\S+@\S+/u),
);
