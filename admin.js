const container = document.getElementById("messages");
const API = "https://video-portfolio-backend-y8hf.onrender.com";

const token = localStorage.getItem("token");

// 🔒 Check login
if (!token) {
  window.location.href = "login.html";
}

// 📥 Load messages
async function loadMessages() {
  const res = await fetch(`${API}/messages`, {
    headers: {
      Authorization: token
    }
  });

  const data = await res.json();

  container.innerHTML = "";

  data.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <div class="name">${msg.name}</div>
      <div class="email">${msg.email}</div>
      <div class="message">${msg.message}</div>
      <button onclick="deleteMsg('${msg._id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

// ❌ Delete
async function deleteMsg(id) {
  await fetch(`${API}/messages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token
    }
  });

  loadMessages();
}

loadMessages();
