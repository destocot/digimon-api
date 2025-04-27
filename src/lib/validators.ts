import * as v from 'valibot'

export const LevelParamsSchema = v.object({
  level: v.pipe(
    v.picklist(['fresh', 'in-training', 'rookie', 'armor', 'champion', 'ultimate', 'mega']),
    v.transform((x) => x.charAt(0).toUpperCase() + x.slice(1).replace(/-/g, ' ')),
  ),
})

export const NameParamsSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
})

const PageParamSchema = v.pipe(v.string(), v.transform(Number), v.integer())

const DefaultSearchParamsSchema = v.object({
  sort_order: v.optional(v.picklist(['asc', 'desc']), 'asc'),
  page: v.optional(PageParamSchema, '1'),
  query: v.optional(v.pipe(v.string(), v.nonEmpty())),
})

export const SearchParamsSchema = (defaultPerPage: string) =>
  v.object({
    ...DefaultSearchParamsSchema.entries,
    sort: v.optional(v.picklist(['name', 'level']), 'name'),
    per_page: v.optional(PageParamSchema, defaultPerPage),
  })

export const LevelSearchParamsSchema = v.object({
  ...DefaultSearchParamsSchema.entries,
  per_page: v.optional(PageParamSchema),
})
