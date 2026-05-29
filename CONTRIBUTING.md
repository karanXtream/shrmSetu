# 🤝 Contributing to ShrmSetu

First off, thank you for taking the time to contribute! 🎉

ShrmSetu is a community-driven project aimed at connecting workers and employers across India. Contributions of all types — bug fixes, feature additions, documentation improvements, UI enhancements, and discussions — are welcome!

To ensure a smooth and collaborative workflow, please take a moment to review this comprehensive guide before making any changes.

---

## 🗺️ Table of Contents

1. [📜 Code of Conduct](#-code-of-conduct)
2. [💡 How Can I Contribute?](#-how-can-i-contribute)
3. [⚙️ Development Setup Guide](#-development-setup-guide)
4. [🌿 Branch Naming & Commit Conventions](#-branch-naming--commit-conventions)
5. [🚀 Pull Request Checklist](#-pull-request-checklist)

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a **respectful, inclusive, and harassment-free environment** for everyone. Please be polite, supportive, and open to constructive feedback.

---

## 💡 How Can I Contribute?

### 🐛 1. Reporting Bugs & Suggesting Features

- 🔍 Check the **Issues** tab to make sure your bug or feature hasn't already been reported.
- ➕ If it's a new issue, click **New Issue** and describe the problem or feature request clearly with steps to reproduce *(if applicable)*.

### 🙋 2. Working on Existing Issues

- 📋 Browse through the active open issues.
- 💬 Comment on the issue expressing your interest, and wait for a **Project Maintainer or Admin** to officially assign it to you before writing code.

---

## ⚙️ Development Setup Guide

ShrmSetu is a monorepo consisting of a **Node.js/Express API server** and a **React Native mobile application** built with Expo.

### 📋 1. Prerequisites

Ensure you have the following installed on your machine:

| Tool | Requirement |
|------|-------------|
| ⚙️ **Node.js** | v18.x or above |
| 🗄️ **MongoDB** | Local instance or Atlas connection string |
| 🐙 **Git** | Latest stable version |
| 📱 **Expo Go** | Installed on your phone to test mobile UI |

---

### 🔧 2. Setup Workflow (Fork & Clone)

**🍴 Fork the Repository:** Click the **Fork** button at the top right of this repository to create your own copy.

**💻 Clone Locally:**
```bash
git clone https://github.com/YOUR-USERNAME/shrmSetu.git
cd shrmSetu
```

**🔑 Configure Environment Variables:**
Navigate to the `backend/` directory, create a `.env` file, and fill in the required variables *(refer to the `README.md` for the template)*.

---

### ▶️ 3. Running Modules

**🏗️ To run Backend:**
```bash
cd backend
npm install
npm run dev
```

**📱 To run Frontend (Mobile):**
```bash
cd ../frontend
npm install
npx expo start
```

> 📲 Scan the QR code in your terminal via **Expo Go** on iOS/Android to launch the app.

---

## 🌿 Branch Naming & Commit Conventions

To maintain a clean and trackable git history, we strictly follow standardized prefixes:

### 🌱 Branch Naming

Create a feature-specific branch from the `main` branch before coding:

| Branch Pattern | Purpose |
|----------------|---------|
| `feat/your-feature-name` | ✨ For new features |
| `fix/bug-description` | 🐛 For fixing existing bugs |
| `docs/documentation-update` | 📚 For README, wiki, or markdown changes |
| `refactor/code-optimization` | ♻️ For code cleanups without changing functionality |

```bash
# Example
git checkout -b feat/worker-profile-upload
```

---

### 💬 Commit Messages

We follow the **semantic commit message format:** `type: brief description`

| Prefix | Purpose | Example |
|--------|---------|---------|
| ✨ `feat:` | Add new feature | `feat: integrate chat persistent storage via socket.io` |
| 🐛 `fix:` | Fix a bug | `fix: resolve crash on dynamic job list rendering` |
| 📚 `docs:` | Documentation changes | `docs: add universal contributing guide` |
| 🎨 `style:` | Formatting, missing semi-colons, etc. | *(no production code change)* |

---

## 🚀 Pull Request Checklist

When you are ready to submit your changes, follow these steps to ensure a quick merge:

- [ ] 🔄 **Sync with Upstream:** Ensure your fork is up-to-date with the official project's `main` branch.
- [ ] 🧹 **Format your Code:** Check for console logs, trailing whitespaces, and properly formatted code blocks.
- [ ] 📤 **Open a PR:** Go to the original repository, click **Compare & pull request**, and select your branch.
- [ ] 📝 **Fill the PR Template:**
  - Provide a **clear title** detailing what changed
  - Explain the **problem being solved** or the feature added
  - Reference the issue number it fixes *(e.g., `Closes #12`)*
- [ ] 💬 **Be Responsive:** Address any review comments or requests for modifications from the maintainers promptly.

---

<div align="center">

✨ *Thank you for making ShrmSetu better for everyone! Happy coding!* 🚀

</div>
