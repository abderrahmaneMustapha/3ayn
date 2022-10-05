type WatterPoint =  {
  id: number,
  img: string,
  open: {from: {ar: string, js: number}, to: {ar: string, js: number}},
  address: string,
  stars: number,
  title: string,
  description: string,
  position: Position,
  photos?: Photo[],
  activeTime?: ActiveTime,
  created_by?: User,
}

type Position = {_lat: number, _long: number}

type Photo = {
  title?: string,
  src: string,
  description?: string,
}

/* TODO: add the possibility to have multi active Times */
type ActiveTime =  {
  openAt: Date,
  closeAt: Date,
}

type User =  {
  id: number,
  name: string,
}

export { ActiveTime, Photo, Position, User, WatterPoint }