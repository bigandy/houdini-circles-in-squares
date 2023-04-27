/**
 * Mulberry32 is pseudorandom number generators (PRNG)
 * @link https://12daysofweb.dev/2021/houdini/#add-randomness-responsibly-with-a-prng
 * @param a number
 * @returns number;
 */
function mulberry32(base) {
  return function () {
    base |= 0;
    base = (base + 0x6d2b79f5) | 0;
    var t = Math.imul(base ^ (base >>> 15), 1 | base);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A Houdini Paint class to create "circles in squares"
 * @property --square-row-count
 * @property --square-column-count
 */
class CirclesInSquares {
  static get inputProperties() {
    return [
      "--circle-square-row-count",
      "--circle-square-column-count",
      "--circle-square-seed",
    ];
  }

  paint(ctx, size, properties) {
    const { height, width } = size;

    const columnCount =
      parseInt(properties.get("--circle-square-column-count")) || 10;
    const rowCount =
      parseInt(properties.get("--circle-square-row-count")) || 10;
    const now = new Date();

    // get a random seed value every minute.
    const seedValue =
      parseInt(properties.get("--circle-square-seed")) || now.getMilliseconds();

    const stripeWidth = width / columnCount;
    const stripeHeight = height / rowCount;

    // a function for getting a random number between 0 and 1 from the seedValue
    const random = mulberry32(seedValue);

    for (var i = 0; i < columnCount; i++) {
      for (var j = 0; j < rowCount; j++) {
        const hue = Math.round(random() * 360);
        const opacity = random() * 0.5;
        ctx.fillStyle = `hsl(${hue} 100% 50% / ${opacity})`;
        ctx.fillRect(i * stripeWidth, j * stripeHeight, stripeWidth, height);

        ctx.beginPath();
        ctx.fillStyle = `hsl(${hue} 100% 50% / 1)`;

        const radius = Math.max(stripeHeight, stripeHeight) / 2;
        const x = i * stripeWidth + stripeWidth / 2;
        const y = j * stripeHeight + 0.5 * stripeHeight;
        const startAngle = 0;
        const endAngle = Math.PI * 2;

        ctx.arc(x, y, radius, startAngle, endAngle, false);

        ctx.fill();
      }
    }
  }
}
registerPaint("circlesInSquares", CirclesInSquares);
