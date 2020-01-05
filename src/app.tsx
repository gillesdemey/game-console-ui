import React, { useState } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import { useSpring, animated } from 'react-spring'

import { useControls, controls, useConnectivity } from './useControls'
import Background from './Background'

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
  const [playing, setPlaying] = useState(false)

  useControls(control => {
    if (control === controls.left) {
      goLeft()
    }

    if (control === controls.right) {
      goRight()
    }

    if (control === controls.exit) {
      setPlaying(false)
    }

    if (control === controls.select) {
      setPlaying(true)
    }
  })

  function goLeft () {
    setSelected(selected => Math.max(0, selected - 1))
  }

  function goRight () {
    setSelected(selected => Math.min(GAMES.length - 1, selected + 1))
  }

  function handleSelect (index) {
    setSelected(index)
  }

  function handleStartResume (game) {
    setPlaying(true)
  }

  return (
    <ToastProvider autoDismiss autoDismissTimeout={2000}>
      <Listeners />
      <Background blur={!playing} src={GAMES[selected].bg} />
      <div className='root__content'>
        <CoverList hidden={playing} handleStartResume={handleStartResume} handleSelect={handleSelect} games={GAMES} selectedIndex={selected} />
      </div>
    </ToastProvider>
  )
}

const Listeners = () => {
  useConnectivity()
  return null
}

const CoverList = ({ handleStartResume, hidden, games = [], selectedIndex = 0, handleSelect }) => {
  const props = useSpring({
    from: {
      transform: 'translate3d(0,200%,0)'
    },
    to: {
      transform: hidden
        ? 'translate3d(0,200%,0)'
        : 'translate3d(0,0,0)'
    }
  })

  const style = {
    transform: props.transform
      .interpolate(value => value),
  }

  return (
    <animated.div className='games__list' style={style}>
      {games.map((game, index) => (
        <Cover key={game.id} onClick={() => handleStartResume(game)} onMouseOver={() => handleSelect(index)} title={game.title} src={game.cover} selected={index === selectedIndex} />
      ))}
    </animated.div>
  )
}

const Cover = ({ onMouseOver, onClick, src, title, selected = false }: { onClick: Function, onMouseOver: Function, src: string, title: string, selected?: boolean }) => {
  const props = useSpring({
    from: {
      scale: 0.8
    },
    to: {
      scale: selected ? 1 : 0.8
    },
    config: {
      mass: 1,
      tension: 450,
      friction: 32
    }
  })

  const style = {
    transform: props.scale
      .interpolate(scale => `scale(${scale})`),
  }

  return (
    <animated.div
      onClick={onClick}
      className='games__cover'
      onMouseOver={onMouseOver}
      style={style}
    >
      <img src={src} alt={title} />
      <header>{title}</header>
    </animated.div>
  )
}

export default App
