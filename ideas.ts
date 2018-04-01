/*

on collision detection: 
if the player collides with the zombie, and the player's health needs to decrease, and the zombie needs to start attacking,
the zombie and player should both test for collision, so they can modify their own state, and not eachothers.
this is wasteful because now we need to do collision detecting twice
lift collision detection to higher state, and modify state of colliding entities there.
e.g.: 
  for (z of state.zombies) {
    if overlaps(z, state.player) {
      z.touchingplayer = false
      p.touchingzombie = true
      // EDIT: instead of modifying state, just pass as a flag
    }
  }

define initial state
gameLoop(timestamp):
  delta = calcDelta(timestamp)
  detectCollisions()
  newState = newState(delta, input, state)
  draweverything(newState)
  state = newState
  window.requestAnimationFrame(gameLoop)
*/

// the sale is the disease...
// the zombies don't die.. they just become disillusioned of the full price and walk out

/*
the world's population has been infected by a formidable disease.  97% of the world's poopMountains of debt have   The remaining 3% have been turned into mindless zombies with an insatiable lust for consumer goods.
*/

/*

zombies pick up item and try to leave the store

*/
