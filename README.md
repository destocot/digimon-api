# Digimon API

A RESTful API for Digimon data built with Next.js.

## Overview

This project provides a modern, well-documented API for accessing Digimon information. It leverages Next.js App Router for API routes and includes Swagger UI documentation.

## Features

- **RESTful API endpoints** for accessing Digimon data
- **Interactive API documentation** using Swagger UI
- **Modern architecture** using Next.js App Router
- **Clean code structure** for easy maintenance and extension

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/destocot/digimon-api.git
cd digimon-api
```

## Documentation

### https://digimon-api-v1.vercel.app/docs

![2025_04_29_11_04_28_digimon_api_v1 vercel app_docs](https://github.com/user-attachments/assets/1edf4b47-4642-4a18-8e4a-4aa286192ad1)

## API Endpoints

### GET /api/digimon

Returns a list of all Digimon

### GET /api/digimon/level/{level}

Returns a list of Digimon filtered by level

### GET /api/digimon/name/{name}

Returns a specific Digimon by name

# Digimon API: Search Parameters Guide

## Query Parameters for `/api/digimon` Endpoint

### Search

- `query=agumon` - Find all Digimon containing "agumon" in their name

### Pagination

- `page=2` - Display the second page of results
- `per_page=20` - Show 20 Digimon per page (default is all)

### Sorting

- `sort=name|level` - Sort by name or level
- `sort_order=asc|desc` - Sort in ascending or descending order

### Example Combined Query

/api/digimon?sort=level&sort_order=desc&query=mon&page=1&per_page=10

This returns the first 10 Digimon with "mon" in their name, sorted by level from highest to lowest.

All parameters are validated with helpful error responses for invalid inputs.

## Technologies Used

- Next.js
- TypeScript
- Valibot

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
