import digimon from '@/data/digimon.json'
import { LevelParamsSchema, LevelSearchParamsSchema } from '@/lib/validators'
import { NextRequest, NextResponse } from 'next/server'
import { flatten, safeParse } from 'valibot'

/**
 * @swagger
 * /api/digimon/level/{level}:
 *   get:
 *     summary: Get a list of Digimon by level
 *     description: Retrieve a list of Digimon with optional filtering, sorting, and pagination.
 *     tags:
 *      - Digimon
 *     parameters:
 *       - name: level
 *         in: path
 *         description: The level of the Digimon
 *         required: true
 *         schema:
 *           type: string
 *           enum: [fresh, in-training, rookie, armor, champion, ultimate, mega]
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
 *         description: Number of items per page (default returns all items)
 *         required: false
 *         schema:
 *           type: integer
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
export async function GET(req: NextRequest, { params }: { params: Promise<{ level: string }> }) {
  const parsedParams = safeParse(LevelParamsSchema, await params)
  const searchParams = req.nextUrl.searchParams
  const parsedSearchParams = safeParse(LevelSearchParamsSchema, Object.fromEntries(searchParams))

  if (!parsedParams.success) {
    return NextResponse.json(
      {
        error: flatten<typeof LevelParamsSchema>(parsedParams.issues).nested,
      },
      { status: 400 },
    )
  }

  if (!parsedSearchParams.success) {
    return NextResponse.json(
      {
        error: flatten<typeof LevelSearchParamsSchema>(parsedSearchParams.issues).nested,
      },
      { status: 400 },
    )
  }

  const { level } = parsedParams.output
  const { sort_order, page, query } = parsedSearchParams.output

  let filtered = digimon.filter((d) => d.level.toLowerCase() === level.toLowerCase())

  const items = filtered.length
  const per_page = parsedSearchParams.output.per_page || items

  filtered = query
    ? filtered.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : filtered

  const sorted = filtered.sort((a, b) => {
    const compare = a.name.localeCompare(b.name)
    return sort_order === 'asc' ? compare : -compare
  })

  const pages = Math.ceil(sorted.length / per_page)
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
