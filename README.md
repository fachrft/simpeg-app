# SIMPEG Frontend

[Sistem Informasi Manajemen Kepegawaian](https://simpeg.unsri.ac.id/) Frontend application built with Nuxt UI.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- Node.js (>= 20)
- pnpm

## Installation Guide

Follow these steps to set up the project locally after cloning the repository:

### 1. Install Dependencies
Run the following command to install all Node.js dependencies:
```bash
pnpm install
```

### 2. Environment Configuration
Copy the `.env.example` file to create your `.env` file:
```bash
cp .env.example .env
```

### 3. Configure API Base URL
Update the `NUXT_PUBLIC_API_BASE` variable in your `.env` file to point to your Laravel backend API:
```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

## Running the Application

To start the development server, run:
```bash
pnpm dev
```
The application will be accessible at `http://localhost:3001`.

## Build for Production

To create a production build:
```bash
pnpm build
```

## Preview Production Build

To preview the production build locally:
```bash
pnpm preview
```

## Reasoning Task

To run the reasoning task, you can execute the `penalaran.js` file using Node.js:

```bash
node penalaran.js
```
