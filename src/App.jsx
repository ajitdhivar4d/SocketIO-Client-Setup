import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");

  const [roomName, setRoomName] = useState("");

  const socket = useMemo(() => io("http://localhost:3000"), []);

  console.log(messages);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Frontend Connected ", socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}{" "}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />

        <Button variant="contained" color="primary" type="submit">
          Set Room
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="room"
          variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <div key={i}>
            <Typography>{m}</Typography>
          </div>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
