## 0.19.3 (2021-12-11)

### Bug fixes

Stop parsing at a given line length to avoid freezing the editor on very long lines.

Make sure the stream parser doesn't get stuck at the end of the viewport.

## 0.19.2 (2021-09-06)

### Bug fixes

Fix a bug where tree fragments near changes were reused too eagerly.

## 0.19.1 (2021-08-11)

### Bug fixes

Fix incorrect versions for @lezer dependencies.

## 0.19.0 (2021-08-11)

### Breaking changes

Update dependencies to 0.19.0

## 0.18.2 (2021-04-13)

### Bug fixes

Fix a misformed .d.ts file in the previous release.

## 0.18.1 (2021-03-09)

### Bug fixes

Fix the node offsets in trees produced by a parse starting in the middle of a document.

Fix a bug that would cause a stream parser to get stuck when a nested stream parse ended before the end of the viewport.

## 0.18.0 (2021-03-03)

### Breaking changes

Update dependencies to 0.18.

## 0.17.1 (2021-01-06)

### New features

The package now also exports a CommonJS module.

## 0.17.0 (2020-12-29)

### Breaking changes

First numbered release.

