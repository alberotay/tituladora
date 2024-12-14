const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server80 = http.createServer(app); // Servir en puerto 80
const server3000 = http.createServer(app); // Servir en puerto 3000
const io80 = socketIo(server80);
const io3000 = socketIo(server3000);

// Servir los archivos estáticos de la carpeta "public" en ambos puertos
app.use(express.static('public'));

// Cuando un cliente se conecta en el puerto 80 (control de animación)
io80.on('connection', (socket) => {
  console.log('Cliente conectado al puerto 80');

  // Recibir evento desde el cliente en el puerto 80
  socket.on('startAnimation', (data) => {
    console.log('Iniciando animación');
    io3000.emit('triggerAnimation', data); // Emitir a los clientes conectados al puerto 3000
  });
  socket.on('stopAnimation', () => {
    console.log('Desvanecer animación');
    io3000.emit('stopAnimation'); // Enviar evento para detener animación
  });
   // Emitir el evento para mostrar el reloj
   socket.on('showClock', () => {
    console.log('ver hora');
    io3000.emit('showClock');
  });

  // Emitir el evento para ocultar el reloj
  socket.on('hideClock', () => {
    io3000.emit('hideClock');
  });

  // Validar el rango de animationId
socket.on('startAnimationTitu', (data) => {
  const { animationId, nombre, apellido } = data;
  if (animationId < 1 || animationId > 5) {
    console.error('ID de animación no válido:', animationId);
    return;
  }
  console.log('Recibido:', { animationId, nombre, apellido });
  io3000.emit('triggerAnimationTitu', { animationId, firstName: nombre, lastName: apellido });
});


  socket.on('stopAnimationTitu', () => {
    console.log('Animación detenida');
    io3000.emit('stopAnimationTitu');
    // Aquí puedes detener la animación
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

// Cuando un cliente se conecta en el puerto 3000 (animación)
io3000.on('connection', (socket) => {
  console.log('Cliente conectado al puerto 3000');
});

// Servir la página en el puerto 80 (control)
server80.listen(80, () => {
  console.log('Servidor funcionando en el puerto 80');
});

// Servir la página en el puerto 3000 (animación)
server3000.listen(3000, () => {
  console.log('Servidor funcionando en el puerto 3000');
});
