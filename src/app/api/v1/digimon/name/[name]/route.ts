import digimon from '@/data/digimon.json'
import { NameParamsSchema } from '@/lib/validators'
import { NextRequest, NextResponse } from 'next/server'
import { safeParse, flatten } from 'valibot'

/**
 * @swagger
 * /api/v1/digimon/name/{name}:
 *   get:
 *     summary: Get a specific Digimon by name
 *     description: Retrieve details of a Digimon based on its name.
 *     tags:
 *      - Digimon
 *     parameters:
 *       - name: name
 *         in: path
 *         description: The name of the Digimon
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Digimon object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     level:
 *                       type: string
 *                     img:
 *                       type: string
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
 *                     name:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Digimon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Digimon not found"
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const parsedParams = safeParse(NameParamsSchema, await params)

  if (!parsedParams.success) {
    return NextResponse.json(
      {
        error: flatten<typeof NameParamsSchema>(parsedParams.issues).nested,
      },
      { status: 400 },
    )
  }

  const { name } = parsedParams.output

  const found = digimon.find((d) => d.name.toLowerCase() === name.toLowerCase())

  if (!found) {
    return NextResponse.json({ message: 'Digimon not found' }, { status: 404 })
  }

  return NextResponse.json({ data: found })
}
