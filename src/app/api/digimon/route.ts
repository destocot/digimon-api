import digimon from '@/data/digimon.json'
import { SearchParamsSchema } from '@/lib/validators'
import { NextRequest, NextResponse } from 'next/server'
import { flatten, safeParse } from 'valibot'

const LEVEL_ORDER = ['Fresh', 'In Training', 'Rookie', 'Armor', 'Champion', 'Ultimate', 'Mega']

/**
 * @swagger
 * /api/digimon:
 *   get:
 *     summary: Get a list of Digimon
 *     description: Retrieve a list of Digimon with optional filtering, sorting, and pagination.
 *     tags:
 *      - Digimon
 *     parameters:
 *       - name: sort
 *         in: query
 *         description: Sort by field
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name, level]
 *           default: name
 *       - name: sort_order
 *         in: query
 *         description: Sort order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: per_page
 *         in: query
 *         description: Number of items per page (default is 209, which returns all items)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 209
 *       - name: query
 *         in: query
 *         description: Search query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Digimon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     per_page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     urls:
 *                       type: object
 *                       properties:
 *                         prev:
 *                           type: string
 *                         next:
 *                           type: string
 *                     items:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       level:
 *                         type: string
 *                       img:
 *                         type: string
 *       400:
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     sort_order:
 *                       type: array
 *                       items:
 *                         type: string
 *                     sort:
 *                       type: array
 *                       items:
 *                         type: string
 *                     query:
 *                       type: array
 *                       items:
 *                         type: string
 *                     page:
 *                       type: array
 *                       items:
 *                         type: string
 *                     per_page:
 *                       type: array
 *                       items:
 *                         type: string
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const parsedSearchParams = safeParse(
    SearchParamsSchema(digimon.length.toString()),
    Object.fromEntries(searchParams),
  )

  if (!parsedSearchParams.success) {
    return NextResponse.json(
      {
        error: flatten<ReturnType<typeof SearchParamsSchema>>(parsedSearchParams.issues).nested,
      },
      { status: 400 },
    )
  }

  const { sort, sort_order, page, per_page, query } = parsedSearchParams.output

  const filterd = query
    ? digimon.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : digimon

  const sorted = [...filterd].sort((a, b) => {
    let compare = 0

    if (sort === 'name') {
      compare = a.name.localeCompare(b.name)
    } else if (sort === 'level') {
      compare = LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
    }

    return sort_order === 'asc' ? compare : -compare
  })

  const pages = Math.ceil(sorted.length / per_page)
  const items = sorted.length

  const results = sorted.slice((page - 1) * per_page, page * per_page)

  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < pages ? page + 1 : null
  const baseUrl = req.nextUrl.origin + req.nextUrl.pathname

  searchParams.delete('page')
  const prevUrl = prevPage ? `${baseUrl}?${searchParams.toString()}&page=${prevPage}` : null
  const nextUrl = nextPage ? `${baseUrl}?${searchParams.toString()}&page=${nextPage}` : null

  const pagination = {
    per_page,
    pages,
    page,
    urls: {
      ...(prevUrl ? { prev: prevUrl } : {}),
      ...(nextUrl ? { next: nextUrl } : {}),
    },
    items,
  }

  return NextResponse.json({ pagination, data: results })
}
