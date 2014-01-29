module.exports = function(fps){
  // Length of a tick in milliseconds. The denominator is your desired framerate.
  // e.g. 1000 / 20 = 20 fps,  1000 / 60 = 60 fps
  var tickLengthMs = 1000 / fps
  // timestamp of each loop
  var previousTick = Date.now()
  // number of times loop gets called
  var actualTicks = 0
  // stack of functions to call
  var stack = []

  // actual loop
  var loop = function(){
    var now = Date.now()
    actualTicks += 1

    if (previousTick + tickLengthMs <= now) {
      previousTick = now

      if (stack.length) {
        var entry = stack.shift()
        entry.fn.apply(entry.self ? entry.self : entry.fn, entry.args)
      }

      actualTicks = 0
    }

    if (Date.now() - previousTick < tickLengthMs - 16) setTimeout(loop, tickLengthMs)
    else setImmediate(loop)
  }

  loop()

  return function(fn, self){
    return function(){
      stack.push({
        fn: fn,
        args: arguments,
        self: self
      })
    }
  }
}