# Mini Employee List – Internship Homework

## Story

You’ve just started an internship at **TinyTech**, a fast‑growing startup with twelve staff and zero admin tools. The HR manager keeps juggling spreadsheets and Post‑it notes to remember who does what. Your mission: deliver a **single‑page prototype** that anyone in the office can open in a browser to look up colleagues quickly. Nail this and you’ll earn serious bragging rights (and maybe an extended contract!).

---

## 1. What to Build

A single‑page site that:

1. Shows a **list of employees** (name + job title).
2. Lets the user click an employee to see more info (email and start date) – an `alert()`, modal, or expanding row is fine.
3. Has a **search box** to quickly find employees by name.

That’s it – no backend, no fancy build tools required.

### Sample data

You can hard‑code an array in your JavaScript **or** load it from `employees.json` – whichever feels easier. Aim for **10** sample employees, e.g.:

```js
{
  id: 1,
  name: "Lin Chang",
  title: "Marketing Assistant",
  email: "lin.chang@example.com",
  startDate: "2024-02-01"
}
```

---

## 2. Rules & Hints

* Use **plain HTML, CSS, and JavaScript** (no frameworks needed).
* Keep your files small and well‑named (`index.html`, `style.css`, `app.js`).
* Make sure the page still works on mobile (flexbox or grid is enough).
* Write clean, readable code – comments welcome.

---

## 3. Creative Feature (Required)

Add **one additional feature of your own design** that improves the Employee List or delights the user. This could be a functional enhancement, a UX touch, a visual flourish, an insight dashboard—anything you believe adds real value.

*Briefly describe your idea* at the top of `app.js` or in a short paragraph in the README so we understand your thinking.

We leave this open‑ended on purpose to see how you think.

---

## 4. How to Submit

1. **Fork** this repo (or create a new public one).
2. Put your code inside – try to commit in logical steps.
3. Enable GitHub Pages (or use Netlify/Vercel) so we can see a live demo.
4. Send us the repo link **and** live URL before your deadline (7 days after you receive this task).

---

## 5. What We Look For

| Area             | Focus                                                       |
| ---------------- | ----------------------------------------------------------- |
| Working solution | Does the list show? Does search work?                       |
| Code clarity     | Simple, tidy, commented where helpful                       |
| Basic styling    | Layout not broken on phone/desktop                          |
| Creative feature | Your self‑chosen feature adds value and is well implemented |
