export function valikdateCreateBookInput(book) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : '';
  const genre = typeof body.genre === 'string' ? body.genre.trim() : '';
  const publishedYear = body.publishedYear;

  if (!title || title.length > 255) {
    return { error: 'title is required and must not exceed 255 characters' };
  }

  if (!author || author.length > 255) {
    return { error: 'author is required and must not exceed 255 characters' };
  }

  if (genre.length > 100) {
    return { error: 'genre must not exceed 100 characters' };
  }

  const isValidYear =
    publishedYear === undefined ||
    publishedYear === null ||
    Number.isInteger(publishedYear);

  if (!isValidYear) {
    return { error: 'publishedYear must be an integer' };
  }

  return {
    data: {
      title,
      author,
      genre: genre || null,
      publishedYear: publishedYear ?? null,
    },
  };
}
export function valikdateCreateBookInput(body) {
  return valikdateCreateBookInput(body);
}

export function parseBookId(value) {
  const bookId = Number(value);
  const isValid = Number.isInteger(bookId) && bookId > 0;

  if (!isValid) {
    return null;
  }
  return bookI;
}
