import { useEffect, useRef } from 'react'
import { Keyboard, Gamepad, or } from 'contro'
import { useToasts } from 'react-toast-notifications'
import useEventListener from '@use-it/event-listener'
import throttle from 'lodash.throttle'

export const DPAD_LEFT = 14
export const DPAD_RIGHT = 15

const { requestAnimationFrame } = window

export function useConnectivity () {
  const { addToast } = useToasts()

  useEventListener('gamepadconnected', ({ gamepad }) => {
    console.log(gamepad)
    addToast('Controller connected', { appearance: 'success' })
  })

  useEventListener('gamepaddisconnected', () => {
    addToast('Controller disconnected', { appearance: 'error' })
  })
}

const keyboard = new Keyboard()
const gamepad = new Gamepad()

export const controls = {
  left: or(gamepad.button(DPAD_LEFT), keyboard.key('ArrowLeft')),
  right: or(gamepad.button(DPAD_RIGHT), keyboard.key('ArrowRight'))
}

export function useControls (callback: Function) {
  const throttleFn = useRef(throttle(callback, 150, { leading: true, trailing: false }))

  function pollButtons() {
    requestAnimationFrame(pollButtons)

    if (controls.left.query()) {
      return throttleFn.current(controls.left)
    }

    if (controls.right.query()) {
      return throttleFn.current(controls.right)
    }
  }

  useEffect(() => {
    console.log('starting polling...')
    requestAnimationFrame(pollButtons)
  }, [])
}
