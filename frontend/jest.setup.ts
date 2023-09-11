import '@testing-library/jest-dom'
import * as fs from 'fs'

// -----------------------------------------------------------------------------

global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

// -----------------------------------------------------------------------------

jest.mock('@/shared/utils', () => {
  const required = jest.requireActual('@/shared/utils')

  return { ...required, shuffleArray: (arr: any[]) => arr }
})

// -----------------------------------------------------------------------------

const WAMessage = `
// This is a file generated as workaround an issue with the new Next.Js "use server" directive.
// You should not edit nor commit this file.
// more info about the bug in:
// https://github.com/vercel/next.js/issues/47448
// https://github.com/vercel/next.js/issues/54757
`

const WAFiles = [{ path: './services/memo-tests-session-server', ext: 'ts' }]

for (const { path, ext } of WAFiles) {
  jest.mock(path, () => {
    const file = fs
      .readFileSync(`${path}.${ext}`, 'utf-8')
      .replaceAll("'use server'", '')
    const tempPath = `${path}.temp-4-test.${ext}`

    fs.writeFileSync(tempPath, WAMessage.concat(file), {
      encoding: 'utf-8',
    })

    const required = jest.requireActual(`${path}.temp-4-test`)

    fs.unlinkSync(tempPath)

    return required
  })
}
