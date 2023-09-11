import '@testing-library/jest-dom'
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

import providers from '@/app/providers'

type AsyncServerComponent = Promise<ReactElement>

export const renderApp = async (
  ui: ReactElement | AsyncServerComponent,
  options?: RenderOptions
) => {
  let uiTemp = ui as ReactElement

  if (ui instanceof Promise) {
    const Result = await ui
    const Ui = () => Result
    uiTemp = <Ui />
  }

  return render(uiTemp, {
    wrapper: providers,
    ...options,
  })
}
