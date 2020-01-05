import { useEffect, useRef } from 'react'
import { Keyboard, Gamepad, or } from 'contro'
import { useToasts } from 'react-toast-notifications'
import useEventListener from '@use-it/event-listener'
import throttle from 'lodash.throttle'

export const DPAD_LEFT = 14
export const DPAD_RIGHT = 15
export const HOME = 16
export const CROSS = 0

const { requestAnimationFrame } = window

export function useConnectivity () {
  const { addToast } = useToasts()

  useEventListener('gamepadconnected', ({ gamepad }) => {
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
  right: or(gamepad.button(DPAD_RIGHT), keyboard.key('ArrowRight')),
  exit: or(gamepad.button(HOME), keyboard.key('Escape')),
  select: or(gamepad.button(CROSS), keyboard.key('Enter'))
}

export function useControls (callback: Function) {
  const throttleFn = useRef(throttle(callback, 120, { leading: true, trailing: false }))

  function pollButtons() {
    requestAnimationFrame(pollButtons)

    for (const key in controls) {
      const control = controls[key]
      if (control.query()) {
        return throttleFn.current(control)
      }
    }
  }

  useEffect(() => {
    requestAnimationFrame(pollButtons)
  }, [])
}
