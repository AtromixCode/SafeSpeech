import io from "socket.io-client";
const socket = io(process.env.VUE_APP_BACK_END_URL || "http://localhost:8000");
export default socket;
