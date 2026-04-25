# 🪙 Crypto Dashboard

Intuicyjna aplikacja webowa do śledzenia cen Bitcoina w czasie rzeczywistym, analizy trendów rynkowych oraz konsultacji AI dotyczących kryptowalut.

---

## ✨ Funkcje

- **Śledzenie cen na żywo:** Monitoruj kurs Bitcoina w czasie rzeczywistym.
- **Analiza rynku:** Interaktywne wykresy prezentujące historyczne zmiany cen.
- **Najnowsze wiadomości:** Bądź na bieżąco z najważniejszymi newsami ze świata kryptowalut.
- **AI Chatbot:** Inteligentny asystent odpowiadający na pytania dotyczące rynku krypto (OpenAI).

---

## 🛠️ Stos technologiczny

| Warstwa      | Technologia                        |
|:------------ |:-----------------------------------|
| Frontend     | React, Vite, CSS Modules           |
| Backend      | Python, FastAPI (Uvicorn)          |
| AI           | OpenAI API                         |
| Dane         | Real-time Crypto APIs              |

---

## 🚀 Szybki start

### 1. Klonowanie repozytorium
```bash
git clone https://github.com/michalkaluzny/crypto-dashboard.git
cd crypto-dashboard
```

### 2. Backend

W nowym terminalu:

```bash
cd backend
```

Instalacja zależności:
```bash
pip install -r requirements.txt
```

Konfiguracja klucza API:

Utwórz plik `.env` w folderze `backend` i dodaj swój klucz OpenAI:
```env
OPENAI_API_KEY=your_actual_api_key_here
```

Uruchom serwer:
```bash
uvicorn main:app --reload
```

### 3. Frontend

W osobnym terminalu:

```bash
cd frontend
```

Instalacja zależności:
```bash
npm install
```

Start aplikacji:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem (domyślnie): [http://localhost:5173](http://localhost:5173)

---

## 📸 Zrzuty ekranu

- **Dashboard**
  ![Dashboard](images/AppScreenMain.png)
- **Wiadomości rynkowe**
  ![News](images/AppScreenNews.png)
- **Interfejs Chatbota**
  ![Chatbot](images/AppScreenChatBot.png)

---

## 📝 Licencja

Brak jawnie określonej licencji. Jeśli chcesz użyć tego projektu, skontaktuj się z autorem.

---

## 👤 Kontakt

Michał Kałużny – [GitHub Profile](https://github.com/michalkaluzny)
