# Math API Microservice

A lightweight Node.js & Express REST API built as a sandbox for DevOps automation testing, containerization, and security integration.

## 🚀 Features & Endpoints

All math operations are `POST` requests and require a JSON body. Input validation is enforced (e.g., preventing division by zero).

| Endpoint | Method | Payload Example | Success Response (200) |
| :--- | :--- | :--- | :--- |
| `/add` | `POST` | `{"a": 5, "b": 10}` | `{"result": 15}` |
| `/subtract` | `POST` | `{"a": 20, "b": 8}` | `{"result": 12}` |
| `/multiply` | `POST` | `{"a": 4, "b": 5}` | `{"result": 20}` |
| `/divide` | `POST` | `{"a": 20, "b": 4}` | `{"result": 5}` |
| `/power` | `POST` | `{"a": 2, "b": 3}` | `{"result": 8}` |
| `/sqrt` | `POST` | `{"a": 9}` | `{"result": 3}` |
| `/avg` | `POST` | `{"numbers": [10, 20, 30]}` | `{"result": 20}` |
| `/percentage` | `POST` | `{"percent": 20, "total": 150}` | `{"result": 30}` |
| `/health` | `GET` | *None* | `{"status": "UP", ...}` |

---

## 🛠️ Local Development

### Installation
```bash
npm install