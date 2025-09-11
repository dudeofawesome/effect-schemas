# effect-schemas

A set of common data schemas, for Effect Schema.

## Schemas

### Internet IDs

#### `UrlString`

Validates that the given string is a valid URL using the [`URL` constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL).

#### `UrlOriginString`

Validates that the given string is a valid [origin](https://web.dev/articles/url-parts#origin), and only an origin.

#### `EmailString`

Validates that the given string looks like an email. Is extremely permissive, allowing emails such as `x@x`.

### UUIDs

#### `UUID`

Validates that the given string is a valid UUID.

#### `UUIDv4`

Validates that the given string is a valid UUIDv4. Can also allow special UUIDs (such as nil & omni) to pass.
