# AI Development Workflow Guide

**Project:** 0.1  
**Repository:** https://github.com/getwildnow/0.1  
**Team:** 3 developers using Cursor with personal accounts  
**Deployment:** Render (watches main branch)

---

## 🤖 AI ASSISTANT RULES - READ THIS EVERY TIME

### **RULE #1: When User Asks to Work on a New Feature**

**ALWAYS follow these steps automatically:**

1. **Pull latest changes first:**
   ```bash
   git pull origin main
   ```

2. **Create a new branch for the feature:**
   ```bash
   git checkout -b feature-[descriptive-name]
   ```
   Examples:
   - `feature-login-page`
   - `feature-payment-integration`
   - `feature-user-dashboard`

3. **Work on the feature** (write code, create files, etc.)

4. **When feature is complete, commit the work:**
   ```bash
   git add .
   git commit -m "Descriptive message about what was done"
   git push origin feature-[branch-name]
   ```

5. **Remind the user to create a Pull Request** on GitHub to merge into main

---

## 🚫 WHAT NOT TO DO

- ❌ **NEVER** work directly on the main branch
- ❌ **NEVER** push directly to main (except for initial setup)
- ❌ **NEVER** force push (`git push --force`)
- ❌ **NEVER** merge without user confirmation

---

## 📋 Standard Workflow

### **Starting a New Coding Session:**

1. Check current branch: `git branch`
2. Pull latest from main: `git pull origin main`
3. Create feature branch: `git checkout -b feature-name`
4. Start coding

### **During Development:**

- Commit frequently with clear messages
- Each logical change = one commit
- Good commit message examples:
  - "Added user authentication form"
  - "Fixed login validation bug"
  - "Styled homepage header"

### **Finishing a Feature:**

1. Review all changes
2. Commit and push to feature branch
3. Tell user to create Pull Request on GitHub
4. After PR is merged, switch back to main:
   ```bash
   git checkout main
   git pull origin main
   ```

---

## 👥 Team Collaboration Context

- **3 developers** working simultaneously
- Each person works on **separate features**
- Features are developed in **isolated branches**
- All branches merge into **main** when ready
- Main branch is the **source of truth**

### **Avoiding Conflicts:**

- Always pull before starting new work
- Coordinate with team on who works on which files
- Keep features small and focused
- Merge frequently to avoid long-lived branches

---

## 🚀 Deployment to Render

- Render is connected to the **main branch**
- When main is updated → Render automatically deploys
- Only merge to main when feature is **tested and ready**
- Main branch should always be in a **working state**

---

## 🔄 Common Scenarios

### **Scenario 1: User Says "Build a login page"**
```bash
# AI should automatically do:
git pull origin main
git checkout -b feature-login-page
# Then create the login page files
# Then commit and push
```

### **Scenario 2: User Says "Fix the bug in payment.js"**
```bash
# AI should automatically do:
git pull origin main
git checkout -b fix-payment-bug
# Then fix the bug
# Then commit and push
```

### **Scenario 3: User Says "Add a new API endpoint"**
```bash
# AI should automatically do:
git pull origin main
git checkout -b feature-api-endpoint
# Then add the endpoint
# Then commit and push
```

---

## 📝 Git Commands Quick Reference

| Action | Command |
|--------|---------|
| Pull latest changes | `git pull origin main` |
| Create new branch | `git checkout -b branch-name` |
| See current branch | `git branch` |
| Switch branches | `git checkout branch-name` |
| Save changes | `git add . && git commit -m "message"` |
| Push to GitHub | `git push origin branch-name` |
| Check status | `git status` |

---

## ✅ Before Every Coding Task - AI Checklist

- [ ] Read this guide
- [ ] Pull latest from main
- [ ] Create feature branch (unless continuing existing feature)
- [ ] Write code
- [ ] Commit with clear message
- [ ] Push to feature branch
- [ ] Inform user about Pull Request

---

## 🎯 Project Goal

Build features → Merge to main → Deploy to Render → Publish complete application

**Remember:** Each feature is developed independently, then integrated into main when complete.

