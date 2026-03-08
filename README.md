<h1 align="center">
  🎮 Dareo
</h1>

<p align="center">
  <strong>A gamified social dare platform — challenge your friends, earn XP, climb the leaderboard.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%26%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Framer_Motion-animations-EF4D9F?style=for-the-badge&logo=framer&logoColor=white" />
</p>

---

## 📌 What is Dareo?

**Dareo** is a gamified social web app where friends create private groups and challenge each other with dares.

Each dare can be **directly assigned** to a specific player or **opened to group voting** to decide who must complete it. Players earn **XP** for completing dares, **level up** over time, and compete on a **group leaderboard**.

> Friendly competition meets game-style progression in a dynamic, animated interface.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 👥 **Private Groups** | Create or join invite-only groups with your friends |
| 🎯 **Create Dares** | Challenge specific members or the whole group |
| 🗳️ **Group Voting** | Let the group vote on who has to complete a dare |
| ⏳ **Vote Timer** | Voting phase with automatic assignment when time's up |
| ✅ **Dare Completion** | Mark dares done — validated by the group |
| ⭐ **XP System** | Earn XP for every dare you successfully complete |
| 📊 **Level Progression** | Level up and unlock new ranks as you gain XP |
| 🏆 **Leaderboard** | Dynamic in-group ranking updated in real time |
| 🎮 **Game-style UI** | Smooth animations and a game-inspired interface |

---

## 🎮 How the Game Works

```
Complete a dare  →  Earn XP  →  Level Up  →  Unlock new Rank  →  Climb the Leaderboard
```

- Voted dares may award **bonus XP**
- Leaderboard updates **dynamically** after each completion
- Levels determine your **rank title** within the group

---

## 🗂️ Data Model

```mermaid
classDiagram
    class User {
        String id
        String email
        String username
        String password
        String avatarUrl
        Int xp
        Int level
        Rank rank
        DateTime createdAt
        DateTime updatedAt
    }

    class Group {
        String id
        String name
        String code
        String avatarUrl
        DateTime createdAt
        DateTime updatedAt
    }

    class GroupMember {
        String id
        Role role
        DateTime joinedAt
    }

    class Dare {
        String id
        String title
        String description
        Int xpReward
        Difficulty difficulty
        DateTime createdAt
        DateTime expiresAt
    }

    class DareResponse {
        String id
        ResponseStatus status
        String proofUrl
        DateTime completedAt
        DateTime createdAt
    }

    class Rank {
        <<enumeration>>
        ROOKIE
        BRONZE
        SILVER
        GOLD
        PLATINUM
        DIAMOND
        LEGEND
    }

    class Role {
        <<enumeration>>
        OWNER
        ADMIN
        MEMBER
    }

    class Difficulty {
        <<enumeration>>
        EASY
        MEDIUM
        HARD
        EXTREME
    }

    class ResponseStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        DECLINED
    }

    User "1" --> "*" GroupMember : memberships
    Group "1" --> "*" GroupMember : members
    GroupMember --> User : user
    GroupMember --> Group : group

    User "1" --> "*" Dare : daresCreated
    Group "1" --> "*" Dare : dares
    Dare --> User : author
    Dare --> Group : group

    User "1" --> "*" DareResponse : dareResponses
    Dare "1" --> "*" DareResponse : responses
    DareResponse --> User : user
    DareResponse --> Dare : dare

    User --> Rank : rank
    GroupMember --> Role : role
    Dare --> Difficulty : difficulty
    DareResponse --> ResponseStatus : status
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Backend / DB** | Firebase (Auth + Firestore) |
| **Linting** | ESLint + Prettier |

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dareo.git
cd dareo

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

> Make sure to configure your Firebase credentials in a `.env` file before running.

---

## 🌟 Upcoming Features

- 🔥 Daily streak rewards
- 🎁 Random dare generator
- 🎭 Anonymous dare mode
- 🖼️ Photo proof uploads
- 🏅 Achievements & badges
- 💬 In-group chat
- 🎵 Level-up sound effects
- 📱 Fully responsive mobile-first design
- 🌙 Dark mode themes
- ⚡ Double XP events
- 🧠 AI-generated dare suggestions
- 📈 Global leaderboard across all groups
- 👑 Customizable avatars
- 🎟️ Seasonal events & limited-time challenges

---

## 📄 License

This project is for educational purposes. Feel free to fork and build upon it!

---

<p align="center">
  Made with ❤️ and a lot of dares 🎲
</p>
