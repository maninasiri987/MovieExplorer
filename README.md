# Movie Explorer

Movie Explorer is a responsive React movie browsing app with an animated home carousel, search and filters, pinned favorites, and detail pages for each movie.

[Live demo](https://maninasiri987.github.io/MovieExplorer/)

## Features

- Animated movie carousel on the home page
- Dynamic browser titles for each page and selected movie
- Search movies by title
- Filter movies by genre
- Sort movies by rating or release year
- Pin favorite movies with `localStorage` persistence
- Dedicated pinned movies page
- Movie detail pages with poster, backdrop, description, director, cast, rating, and release year
- Responsive layouts for desktop and mobile

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- React Icons
- GitHub Pages deployment via `gh-pages`

## Project Structure

```text
src/
  components/       Reusable UI pieces like cards, navigation, dots, and buttons
  hooks/            Shared React hooks
  pages/            Route-level pages: Home, Search, Pins, MovieDetails
  assets/           Local movie posters and background images
  App.jsx           App routes, movie data, and pinned movie state
  main.jsx          React entry point
  main.css          Tailwind import and global styles
```

## Dynamic Page Titles

The app updates the browser tab title per route:

- Home page: `Home | Movie Explorer`
- Search page: `Search | Movie Explorer`
- Pins page: `Pinned Movies | Movie Explorer`
- Movie details page: `{Movie Title} | Movie Explorer`
- Missing movie page: `Movie Not Found | Movie Explorer`

## MoviesAPI.ir Notes

I checked [MoviesAPI.ir](https://moviesapi.ir/) as a possible future data source. The service is designed as an educational movie API and, according to its documentation, does **not** require an API key for basic movie and genre requests.

Useful documented endpoints:

| Purpose | Endpoint |
| --- | --- |
| List movies | `GET https://moviesapi.ir/api/v1/movies?page={page}` |
| Search movies | `GET https://moviesapi.ir/api/v1/movies?q={name}&page={page}` |
| Movie details | `GET https://moviesapi.ir/api/v1/movies/{movie_id}` |
| List genres | `GET https://moviesapi.ir/api/v1/genres` |
| Movies by genre | `GET https://moviesapi.ir/api/v1/genres/{genre_id}/movies?page={page}` |

Current project status: this app still uses local movie data from `App.jsx`. A good next feature would be to add a `src/services/moviesApi.js` file and load movie lists/search results from MoviesAPI.ir.

> Note: API requests from this Codex environment returned a proxy `403`, so I used the public documentation page to review the available endpoints. Please test the endpoints from your local machine/browser before integrating them.

## Run Locally

Clone the project, install dependencies, and start the Vite development server:

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

## Suggested Next Steps

1. Move hard-coded movie data from `App.jsx` into `src/data/movies.js`.
2. Create reusable movie helpers, such as a `getMovieSlug` function.
3. Improve search so it checks title, director, cast, genre, and year.
4. Integrate MoviesAPI.ir or another movie API for real movie data.
5. Add loading and error states for API-powered pages.
