import dispatch from "./dispatch";
import { Actions, GameStateType } from "./types";
import loadLevel from "./level";

export default function presentLevel(levelNum: number) {
  dispatch({ type: Actions.LOAD_LEVEL, level: loadLevel(levelNum) });
  // dispatch({ type: Actions.TRANSITION_GAME_STATE, gameState: GameStateType.LEVELINTRO });
  // setTimeout(() => {
  //   dispatch({ type: Actions.TRANSITION_GAME_STATE, gameState: GameStateType.GAME });
  // }, 2000);
}
