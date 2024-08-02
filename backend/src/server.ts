import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

interface User {
  email: string;
  number: string;
}

const users: User[] = [
  { email: "jim@gmail.com", number: "221122" },
  { email: "jam@gmail.com", number: "830347" },
  { email: "john@gmail.com", number: "221122" },
  { email: "jams@gmail.com", number: "349425" },
  { email: "jams@gmail.com", number: "141424" },
  { email: "jill@gmail.com", number: "822287" },
  { email: "jill@gmail.com", number: "822286" },
];

let currentTimeout: NodeJS.Timeout | null = null;

app.post("/search", (req: Request, res: Response) => {
  const { email, number } = req.body;

  if (currentTimeout) {
    clearTimeout(currentTimeout);
  }

  currentTimeout = setTimeout(() => {
    const filteredUsers = users.filter(
      (user) =>
        user.email.includes(email) && (!number || user.number.includes(number))
    );
    res.json(filteredUsers);
  }, 5000); 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
