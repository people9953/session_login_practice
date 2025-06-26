const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const users = [
  {
    user_id: "oz_user1",
    user_password: "1234",
    user_name: "김오즈",
    user_info: "서울에 거주하는 김오즈입니다.",
  },
  {
    user_id: "oz_user2",
    user_password: "4567",
    user_name: "박코딩",
    user_info: "부산에 거주하는 박코딩입니다.",
  },
  {
    user_id: "oz_user3",
    user_password: "7890",
    user_name: "이쿠키",
    user_info: "경기에 거주하는 이쿠키입니다.",
  },
  {
    user_id: "oz_user4",
    user_password: "1357",
    user_name: "최노드",
    user_info: "제주에 거주하는 최노드입니다.",
  },
];

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    name: "session_id",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 30,
    },
  })
);

app.post("/", (req, res) => {
  const { user_id, user_password } = req.body;

  const userInfo = users.find(
    (user) => user.user_id === user_id && user.user_password === user_password
  );

  if (!userInfo) {
    res.status(401).send("로그인 실패");
  } else {
    req.session.userId = userInfo.user_id;
    res.send("⭐️세션 생성 완료!");
  }
});

app.get("/", (req, res) => {
  const userInfo = users.find((el) => el.user_id === req.session.userId);
  return res.json(userInfo || null);
});

app.delete("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("세션 삭제 실패");

    res.clearCookie("session_id");
    res.send("🧹세션 삭제 완료");
  });
});

app.listen(3000, () => {
  console.log("✅ 서버 실행 중: http://localhost:3000");
});
