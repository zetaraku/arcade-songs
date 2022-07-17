// eslint-disable-next-line import/prefer-default-export
export class PageNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super('This page could not be found');
  }
}
