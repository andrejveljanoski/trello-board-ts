# Trello Board TypeScript Clone

This project is a clone of the basic functionalities of Trello, built with TypeScript. It's an improvement over the initial JS version, with the addition of TypeScript for type safety and better code quality, and some refactoring to improve the readability and maintainability of the code.

Original project: [Trello Board JS](https://github.com/andrejveljanoski/trello-board)

## Technologies Used

- TypeScript: The project is written in TypeScript, a statically typed superset of JavaScript that adds types.
- Webpack: Used for bundling the project's assets.
- ESLint: This tool is used to maintain code quality and find and fix problems in the JavaScript code.
- Firebase: Used for backend services like authentication and storage of the board data.

## How to run the project after cloning

### Install the project dependencies:

```sh
yarn
```

### Start the development server:

```sh
yarn start
```

### Build the project:

```sh
yarn build
```

### Lint the project:

```sh
yarn lint
```

## Project Structure

The project's source code is located in the `src/` directory. This includes:

`api/`: Contains modules for interacting with backend services.

`index.css`: The main stylesheet for the project.

`index.html`: The main HTML file for the project.

`index.ts`: The main TypeScript file for the project.

`state.ts`: Contains the state management logic for the project.

`types.ts`: Contains type definitions and utility functions related to types used throughout the project.
