# server
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


# client 
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import InputMask from "react-input-mask";

function App() {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNumberValid, setIsNumberValid] = useState(false);

  // Валидация электронной почты
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Валидация номера
  const validateNumber = (number) => {
    const numberPattern = /^\d{2}-\d{2}-\d{2}$/; // Ожидается формат 99-99-99
    return numberPattern.test(number);
  };

  // Функция для обновления состояния валидации
  const updateValidation = () => {
    setIsEmailValid(validateEmail(email));
    setIsNumberValid(validateNumber(number));
  };

  useEffect(() => {
    updateValidation();
  }, [email, number]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/search", {
        email,
        number: number.replace(/-/g, ""), // Убираем дефисы перед отправкой на сервер
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Форма</h2>
      <form onSubmit={handleSubmit}>
        <label>Электронная почта:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
          placeholder="Введите вашу почту"
          required
        />

        <label>Номер:</label>
        <InputMask
          mask="99-99-99"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          id="phone"
          name="phone"
          placeholder="Введите ваш номер телефона"
        >
          {(inputProps) => <input {...inputProps} type="text" />}
        </InputMask>

        <button
          type="submit"
          disabled={loading || !isEmailValid || (!isNumberValid)}
        >
          {loading ? "Поиск..." : "Отправить"}
        </button>
      </form>

      {users.length > 0 && (
        <div className="results">
          <h3>Результаты поиска:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                Email: {user.email}, Number: {user.number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
