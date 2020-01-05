import React from 'react'
import { Surface } from 'gl-react-dom'
import { Blur } from 'gl-react-blur'

import { Darken } from './shaders'

const Background = ({ src = '', blur = true }) => {

  const blurValues = blur
    ? { factor: 6, passes: 6 }
    : { factor: 0, passes: 1 }

  const brightness = blur ? 0.5 : 1

  return (
    <div className='root__background'>
      <Surface width={1920} height={1080}>
        <Darken brightness={brightness}>
          <Blur factor={blurValues.factor} passes={blurValues.passes}>
            {src}
          </Blur>
        </Darken>
      </Surface>
    </div>
  )
}

export default Background
