import { useToasts } from 'react-toast-notifications'
import useEventListener from '@use-it/event-listener'

export default function useGamepad () {
  const { addToast } = useToasts()

  useEventListener('gamepadconnected', () => {
    addToast('Controller connected', { appearance: 'success' })
  })

  useEventListener('gamepaddisconnected', () => {
    addToast('Controller disconnected', { appearance: 'error' })
  })
}