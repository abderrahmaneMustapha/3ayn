interface WatterPoint {
  id: number,
  img?: string,
  /* TODO: add the possibility to have multi active Times */
  open: {from: {ar: string, js: number}, to: {ar: string, js: number}},
  address: string,
  stars: number,
  title: string,
  description: string,
  position: Position,
  photos?: Photo[],
  created_by?: User,
}

interface Position {_lat: number, _long: number}

interface Photo {
  title?: string,
  src: string,
  description?: string,
}

interface User {
  id: number,
  name: string,
}

export { Photo, Position, User, WatterPoint }