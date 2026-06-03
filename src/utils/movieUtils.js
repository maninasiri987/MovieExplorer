export const getMovieSlug = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const normalizeSearchText = (value) =>
  String(value ?? "").toLowerCase().trim();

export const getMovieSearchText = (movie) =>
  normalizeSearchText([
    movie.title,
    movie.genre,
    movie.year,
    movie.rating,
    movie.director,
    ...(movie.cast || []),
  ].join(" "));

export const movieMatchesSearch = (movie, query) => {
  const normalizedQuery = normalizeSearchText(query);
  return !normalizedQuery || getMovieSearchText(movie).includes(normalizedQuery);
};
