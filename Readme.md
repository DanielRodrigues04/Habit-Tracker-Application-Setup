# Habit Tracker Application

## Description
The Habit Tracker Application is a mobile-first solution designed to help users establish and maintain daily, weekly, or monthly habits. With interactive features like progress tracking, notifications, and gamification, the app motivates users to build consistency and achieve their goals. This project uses **React Native** for the frontend and **Supabase** for backend services, including authentication, database management, and real-time updates.

---

## Features

### Core Functionality
- **Custom Habit Management:**
  - Add habits with names, descriptions, categories (e.g., Health, Productivity), and frequencies (daily, weekly, monthly).
  - Configure reminders and set specific start and end dates for each habit.

- **Progress Tracking:**
  - Mark habits as completed, skipped, or pending daily.
  - View interactive graphs (bar/line) for daily, weekly, and monthly performance.

- **Gamification:**
  - Streaks: Track consecutive days of habit completion.
  - Achievements: Unlock badges and rewards for consistent progress.

- **Notifications:**
  - Receive reminders for incomplete habits.
  - Push notifications configured using Supabase Edge Functions.

- **Reports and Analytics:**
  - Detailed insights into historical performance.
  - Highlight strengths and areas for improvement.

### Technical Features
- Offline Support: Temporary storage with **AsyncStorage** for seamless offline usage.
- User Authentication: Login and signup using **Supabase Auth**, with optional social logins.
- Real-Time Updates: Supabase Realtime for live updates on data changes.
- Cross-Platform Compatibility: Runs on iOS and Android using React Native.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://expo.dev/)
- [Git](https://git-scm.com/)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/DanielRodrigues04/habit-tracker-app.git
   cd habit-tracker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Supabase:
   - Create a project in [Supabase](https://supabase.com/).
   - Set up tables for `users`, `habits`, and `progress` as described in the project documentation.
   - Add your Supabase keys and URL to a `.env` file:
     ```env
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
   ```bash
   expo start
   ```

---

## Project Structure

```plaintext
src/
├── components/        # Reusable UI components
├── screens/           # Main screens (Dashboard, Progress, Settings)
├── services/          # Supabase API client and utility functions
├── hooks/             # Custom hooks (e.g., useHabits, useNotifications)
├── styles/            # Centralized styling
├── utils/             # Helper functions (date formatting, etc.)
└── App.tsx            # Entry point of the application
```

---

## Usage
- Open the app and create an account or log in.
- Add your habits by specifying the name, frequency, and reminders.
- Mark habits as completed daily to track progress.
- View performance charts and unlock achievements for consistency.
- Enable notifications to get reminders for pending habits.

---

## Technologies Used
- **Frontend:** React Native (TypeScript), Victory.js (graphs)
- **Backend:** Supabase (PostgreSQL, Authentication, Realtime)
- **Notifications:** Supabase Edge Functions, Expo Notifications
- **Storage:** AsyncStorage for offline support

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For any inquiries or feedback, please reach out to:
- **Daniel Rodrigues**
- GitHub: [DanielRodrigues04](https://github.com/DanielRodrigues04)

---

Enjoy building better habits with the Habit Tracker Application!

