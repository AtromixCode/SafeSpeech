export default function createWebSocketPlugin(socket) {
  return (store) => {
    store.$socket = socket;
  };
}
