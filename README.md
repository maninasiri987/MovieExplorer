# Movie Explorer

Movie Explorer is a responsive React + Vite app for browsing movies, searching by multiple fields, pinning favorites, and opening detail pages with dynamic browser titles.

[Live demo](https://maninasiri987.github.io/MovieExplorer/)

## Features

- Smooth, responsive home carousel with optimized transform updates
- Dynamic browser titles for every route and selected movie
- Search by movie title, actor, director, genre, year, or rating
- Genre filters and rating/year sorting
- Pin/unpin favorite movies with `localStorage` persistence
- Clear all pinned movies from the Pins page
- Movie detail pages with poster, backdrop, plot, director, cast, rating, and year
- Shared utilities for movie slugs and search matching
- Local movie data separated from app routing/state
- Mobile-friendly layouts for the carousel, search results, pins, and details pages

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- React Icons
- GitHub Pages deployment with `gh-pages`

## Project Structure

```text
src/
  assets/           Local movie posters and background images
  components/       Reusable UI pieces such as cards, navigation, dots, and buttons
  data/             Local movie catalog data
  hooks/            Shared hooks for page titles and viewport detection
  pages/            Route pages: Home, Search, Pins, MovieDetails
  utils/            Movie helpers for slugs and search text
  App.jsx           App routes, pin state, and localStorage persistence
  main.jsx          React entry point
  main.css          Tailwind import and global styles
```

## Dynamic Page Titles

The app updates the browser tab title for every page:

- Home: `Home | Movie Explorer`
- Search: `Search | Movie Explorer`
- Pins: `Pinned Movies | Movie Explorer`
- Movie details: `{Movie Title} | Movie Explorer`
- Missing movie: `Movie Not Found | Movie Explorer`

## Performance Notes

The carousel and routing code were tuned to reduce unnecessary work:

- Cards are memoized to avoid avoidable re-renders.
- The home carousel throttles scroll calculations with `requestAnimationFrame`.
- Duplicate inline style writes are skipped during scroll transforms.
- Heavy blur filters were removed from active scroll animations.
- Mobile viewport detection is shared in one hook instead of repeated per page/component.
- Derived values such as filtered movies and pinned movies use memoized calculations.

## MoviesAPI.ir Notes

[MoviesAPI.ir](https://moviesapi.ir/) is a possible future data source. Its documentation says basic movie and genre requests do not need an API key, and it lists endpoints for movie lists, search, details, genres, and genre-based movie lists.

Useful documented endpoints:

| Purpose | Endpoint |
| --- | --- |
| List movies | `GET https://moviesapi.ir/api/v1/movies?page={page}` |
| Search movies | `GET https://moviesapi.ir/api/v1/movies?q={name}&page={page}` |
| Movie details | `GET https://moviesapi.ir/api/v1/movies/{movie_id}` |
| List genres | `GET https://moviesapi.ir/api/v1/genres` |
| Movies by genre | `GET https://moviesapi.ir/api/v1/genres/{genre_id}/movies?page={page}` |

Current project status: the app still uses local data from `src/data/movies.js`. A good next feature would be to add `src/services/moviesApi.js`, map the API response shape to the app's movie shape, and keep local data as a fallback if the API is unavailable.

## Run Locally

Install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
npm run deploy   # Deploy dist/ to GitHub Pages
```

## Recommended Next Steps

1. Add an API service layer for MoviesAPI.ir.
2. Add loading and error states for API-powered pages.
3. Add pagination or infinite scroll for larger movie lists.
4. Add more movies or real trending/movie search data.
5. Add screenshots to this README after final UI polish.
