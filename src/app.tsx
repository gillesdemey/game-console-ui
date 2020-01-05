import React, { useEffect, useState } from 'react'
import { useKeyPress } from 'react-use'
import { ToastProvider } from 'react-toast-notifications'
import { useSpring, animated } from 'react-spring'
import { Surface } from 'gl-react-dom'
import { Blur } from 'gl-react-blur'

import useGamepad from './useGamepad'
import { Darken } from './shaders'

const GAMES = [{
    id: 0,
    title: 'Death Stranding',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1syk.jpg',
  bg: './assets/EJcySkAW4AEzorg.jpg'
  }, {
    id: 1,
    title: 'God of War',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg',
    bg: './assets/m8vl75f1aunebleaa0zj.png'
  }, {
    id: 2,
    title: 'Red Dead Redemption 2',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg',
    bg: './assets/dhw6ucx9laj5esv6rngn.png'
  }, {
    id: 3,
    title: 'NieR: Automata',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/qhok1pi6egmfizjjii7r.jpg',
    bg: './assets/ar5l1.png'
  },{
    id: 4,
    title: 'Persona 5',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg',
    bg: './assets/hv41uaug9qpyhf0ecf9a.jpeg'
  }, {
    id: 5,
    title: 'DOOM',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1nc7.jpg',
    bg: './assets/ar4h6.png'
  }, {
    id: 6,
    title: 'The Witcher 3: Wild Hunt',
    cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rsc.jpg',
    bg: './assets/rwznddfodf1x5mmj8zva.jpg'
  }]

const App = () => {
  const [selected, setSelected] = useState(1)

  const [leftPressed] = useKeyPress('ArrowLeft')
  const [rightPressed] = useKeyPress('ArrowRight')

  useEffect(() => {
    if (!leftPressed) return
    setSelected(selected => Math.max(0, selected - 1))
  }, [leftPressed])

  useEffect(() => {
    if (!rightPressed) return
    setSelected(selected => Math.min(GAMES.length - 1, selected + 1))
  }, [rightPressed])

  function handleSelect (index) {
    setSelected(index)
  }

  return (
    <ToastProvider autoDismiss autoDismissTimeout={2000}>
      <Listeners />
      <Background src={GAMES[selected].bg} />
      <div className='root__content'>
        <CoverList handleSelect={handleSelect} games={GAMES} selectedIndex={selected} />
      </div>
    </ToastProvider>
  )
}

const Background = ({ src = '' }) => {
  return (
    <div className='root__background'>
      <Surface width={1920} height={1080}>
        <Darken brightness={0.5}>
          <Blur factor={2} passes={4}>
            {src}
          </Blur>
        </Darken>
      </Surface>
    </div>
  )
}

const Listeners = () => {
  useGamepad()
  return null
}

const CoverList = ({ games = [], selectedIndex = 0, handleSelect }) => {
  return (
    <div className='games__list'>
      {games.map((game, index) => (
        <Cover key={game.id} handleSelect={() => handleSelect(index)} title={game.title} src={game.cover} selected={index === selectedIndex} />
      ))}
    </div>
  )
}

const Cover = ({ handleSelect, src, title, selected = false }: { handleSelect: Function, src: string, title: string, selected?: boolean }) => {
  const props = useSpring({
    from: {
      scale: 1
    },
    to: {
      scale: selected ? 1.2 : 1
    },
    config: {
      mass: 1,
      tension: 450,
      friction: 32
    }
  })

  return (
    <animated.div className='games__cover' onMouseOver={handleSelect} style={{
      transform: props.scale
        .interpolate(scale => `scale(${scale})`),
    }}>
      <img src={src} alt={title} />
      <header>{title}</header>
    </animated.div>
  )
}

export default App
