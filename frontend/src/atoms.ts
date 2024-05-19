import { atom } from 'jotai'

export const isMiniSidebarOpenedAtom = atom(false)

export const geolocationAtom = atom({
  lat: 0,
  lng: 0
})