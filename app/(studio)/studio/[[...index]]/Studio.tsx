'use client'

import { StaffToolbar } from 'components/StaffToolbar'
import { NextStudio } from 'next-sanity/studio'
import { Suspense } from 'react'

import config from 'sanity.config'

export function Studio() {
  //  Supports the same props as `import {Studio} from 'sanity'`, `config` is required
  return (
    <>
      <NextStudio config={config} />
      <Suspense>
        <StaffToolbar />
      </Suspense>
    </>
  )
}
