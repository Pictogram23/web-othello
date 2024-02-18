'use client';

import { Layer, Stage } from "react-konva";
import Board from "./board";
import { FC } from "react";
import { KonvaEventObject } from "konva/lib/Node";

const StageComponent: FC = () => {
    const boardClicked = (e:KonvaEventObject<MouseEvent>) => {
        let x, y;
        x = Math.floor(e.evt.offsetX / 50);
        y = Math.floor(e.evt.offsetY / 50);
        console.log([x, y]);
    } 
    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Board onClick={boardClicked} />
            </Layer>
        </Stage>
    )
}

export default StageComponent;