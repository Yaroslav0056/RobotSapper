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

    const distance = data.distance || 0;
    const y = data.vector.y || 0;

    const frontEl = data.instance.ui[0].front;
    frontEl.style.transform = `translate(0px, ${-distance * y}px)`;

    socket.send(JSON.stringify({ side, power: y.toFixed(2) }));
  });

  joystick.on('end', () => {
    const frontEl = joystick[0]?.ui?.[0]?.front;
    if (frontEl) frontEl.style.transform = 'translate(0px, 0px)';

    socket.send(JSON.stringify({ side, power: 0 }));
  });
}

createJoystick('left-zone', 'left');
createJoystick('right-zone', 'right');
