type WaterPoint =  {
  id: number,
  name: string,
  description: string,
  position: Position,
  photos: Photo[],
  activeTime: ActiveTime,
  created_by: User,
}

type Position = [number, number]

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

export { ActiveTime, Photo, Position, User, WaterPoint }