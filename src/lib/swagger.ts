import { createSwaggerSpec } from 'next-swagger-doc'

export async function getApiDocs() {
  const spec = createSwaggerSpec({
    apiFolder: './src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Digimon API',
        version: '1.0.0',
      },
    },
  })

  return spec
}
