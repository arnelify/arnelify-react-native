const socket = io(location.origin, {transports: ['websocket']});
socket.on("refresh", () => location.reload());