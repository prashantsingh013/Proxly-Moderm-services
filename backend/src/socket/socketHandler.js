export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    // User joins personal notification room
    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Provider joins provider room and locality room
    socket.on('join_provider_room', ({ providerId, locality }) => {
      if (providerId) socket.join(`provider_${providerId}`);
      if (locality) socket.join(`locality_${locality.toLowerCase()}`);
    });

    // Join specific booking live tracking room
    socket.on('join_booking_room', (bookingId) => {
      if (bookingId) socket.join(`booking_${bookingId}`);
    });

    // Live GPS coordinate broadcast from provider during 'PROVIDER_ON_THE_WAY'
    socket.on('provider_location_update', ({ bookingId, coordinates }) => {
      if (bookingId && coordinates) {
        io.to(`booking_${bookingId}`).emit('live_provider_location', {
          bookingId,
          coordinates,
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', () => {
      // Disconnected
    });
  });
};
