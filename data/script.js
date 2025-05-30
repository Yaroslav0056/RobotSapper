const socket = new WebSocket(`ws://${location.hostname}/ws`);

function createJoystick(zoneId, side) {
  const zoneElement = document.getElementById(zoneId);

  const joystick = nipplejs.create({
    zone: zoneElement,
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: side === "left" ? 'green' : 'red',
    size: 100,
    restOpacity: 0.8
  });

  joystick.on('move', (evt, data) => {
    if (!data) return;

    const y = data.vector.y || 0;

    // Надсилаємо тільки вертикальне значення
    socket.send(JSON.stringify({ side, power: y.toFixed(2) }));
  });

  joystick.on('end', () => {
    socket.send(JSON.stringify({ side, power: 0 }));
  });
}

createJoystick('left-zone', 'left');
createJoystick('right-zone', 'right');
