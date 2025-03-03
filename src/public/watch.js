(function watch() {

  socket = new WebSocket('ws://localhost:8433');

  socket.onmessage = (event) => {
    const { version } = JSON.parse(event.data);
    if (localStorage.getItem('version') !== String(version)) {
      localStorage.setItem('version', version);
      location.reload();
    }
  };

  socket.onclose = () => {
    setTimeout(watch, 1000);
  };

})();