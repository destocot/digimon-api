import { getApiDocs } from '@/lib/swagger'
import { ReactSwagger } from './react-swagger'

export default async function Page() {
  const spec = await getApiDocs()

  return (
    <section>
      <ReactSwagger spec={spec} />
    </section>
  )
}
