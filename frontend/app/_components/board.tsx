import { KonvaEventObject } from 'konva/lib/Node'
import { Rect } from 'react-konva'

type Props = {
  onClick: (e: KonvaEventObject<MouseEvent>) => void
}

const Board = ({ onClick }: Props) => {
  return (
    <>
      <Rect onClick={onClick} width={400} height={400} fill='green' />
      {(() => {
        const res = []
        for (let x = 0; x <= 400; x += 50) {
          res.push(<Rect x={x} y={0} width={1} height={400} fill='white' />)
        }
        for (let y = 0; y <= 400; y += 50) {
          res.push(<Rect x={0} y={y} width={400} height={1} fill='white' />)
        }
        return res
      })()}
    </>
  )
}

export default Board
