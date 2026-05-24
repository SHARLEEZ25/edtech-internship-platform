# Thozhil Frontend

Frontend application for the Thozhil platform, built using React and Vite.

## Tech Stack
- React
- TypeScript
- Vite
- npm

## Project Setup

### Prerequisites
- Node.js (v18 or above recommended)
- npm

### Installation
Clone the repository and install dependencies:

npm install

## State Management and API Handling

### Zustand
Zustand is used for global state management in the application. It provides a lightweight and scalable way to manage shared state without the complexity of traditional state management libraries. This helps avoid prop drilling and keeps state logic simple and maintainable as the application grows.

### Axios
Axios is used for handling HTTP requests to the backend. It allows centralized API configuration, cleaner request and response handling, and easier integration of features such as authentication interceptors and error handling.

### react-hook-form
react-hook-form is used to manage form state and validation in the application. It minimizes unnecessary re-renders, simplifies validation logic, and provides a scalable structure for handling complex forms such as authentication, order, and data entry flows.

### @types/node 
Required for TypeScript path aliases & Node globals


### Development
Start the local development server:

npm run dev

The application will be available at http://localhost:5173

## Project Initialization Notes
This project was initialized using Vite inside an existing Git repository using:

npm create vite@latest .

Experimental features such as rolldown-vite were intentionally skipped to maintain stability.

## Status
Project setup complete. Development in progress.
