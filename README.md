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

## API Endpoints

### GET /api/digimon

Returns a list of all Digimon

### GET /api/digimon/level/{level}

Returns a list of Digimon filtered by level

### GET /api/digimon/name/{name}

Returns a specific Digimon by name

## Technologies Used

- Next.js
- TypeScript
- Valibot

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
