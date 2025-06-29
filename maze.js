(async function() {
  const res = await fetch('data/levels.json');
  const levels = await res.json();
  const level = levels[0];
  const mazeContainer = document.getElementById('maze');
  let playerPos = { x: 0, y: 0 };

  // Render grid
  level.maze.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (ch === '#') cell.classList.add('wall');
      else if (ch === ' ') cell.classList.add('path');
      else if (ch === 'P') { cell.classList.add('player'); playerPos = { x, y }; }
      else if (ch === 'E') cell.classList.add('exit');
      mazeContainer.appendChild(cell);
    });
  });

  // Movement logic
  function move(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    const cols = level.maze[0].length;
    const idxOld = playerPos.y * cols + playerPos.x;
    const idxNew = newY * cols + newX;
    const target = mazeContainer.children[idxNew];
    if (!target || target.classList.contains('wall')) return;
    mazeContainer.children[idxOld].classList.remove('player');
    target.classList.add('player');
    playerPos = { x: newX, y: newY };
    if (target.classList.contains('exit')) console.log('Level Complete!');
  }

  // Keyboard input
  document.addEventListener('keydown', e => {
    const map = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };
    if (map[e.key]) move(...map[e.key]);
  });

  // Touch button input
  document.querySelectorAll('#controls button').forEach(btn => {
    const dir = btn.dataset.dir;
    const map = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] };
    btn.addEventListener('touchstart', () => move(...map[dir]));
  });
})();
