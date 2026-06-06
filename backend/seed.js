require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Room = require("./models/Room");

const seed = async () => {
  await connectDB();
  const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  await User.findOneAndUpdate(
    { username },
    { name: process.env.ADMIN_NAME || "System Admin", username, password, role: "admin", isActive: true },
    { upsert: true, new: true }
  );

  const rooms = [
    { roomNumber: "R001", roomType: "Single", monthlyRent: 15000, maxBoarders: 2, currentBoarders: 0, status: "Available", description: "Ground floor room" },
    { roomNumber: "R002", roomType: "Double", monthlyRent: 22000, maxBoarders: 4, currentBoarders: 0, status: "Available", description: "Spacious shared room" },
    { roomNumber: "R003", roomType: "Family", monthlyRent: 28000, maxBoarders: 5, currentBoarders: 0, status: "Available", description: "Attached bathroom" }
  ];

  for (const room of rooms) {
    await Room.findOneAndUpdate({ roomNumber: room.roomNumber }, room, { upsert: true, new: true });
  }

  console.log("Seed complete. Admin login:", username, "/", process.env.ADMIN_PASSWORD || "admin123");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

