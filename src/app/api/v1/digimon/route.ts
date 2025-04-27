import digimon from '@/data/digimon.json'
import { NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'

const PageParamSchema = v.pipe(v.string(), v.transform(Number), v.integer())

const SearchParamsSchema = v.object({
  sort: v.optional(v.picklist(['name', 'level']), 'name'),
  sort_order: v.optional(v.picklist(['asc', 'desc']), 'asc'),
  page: v.optional(PageParamSchema, '1'),
  per_page: v.optional(PageParamSchema, digimon.length.toString()),
  query: v.optional(v.pipe(v.string(), v.nonEmpty())),
})

const LEVEL_ORDER = ['Fresh', 'In Training', 'Rookie', 'Armor', 'Champion', 'Ultimate', 'Mega']

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const parsedSearchParams = v.safeParse(SearchParamsSchema, Object.fromEntries(searchParams))

  if (!parsedSearchParams.success) {
    return NextResponse.json(
      {
        error: v.flatten<typeof SearchParamsSchema>(parsedSearchParams.issues),
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
