document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector("input[name='name']").value;
    const email = form.querySelector("input[name='email']").value;
    const message = form.querySelector("textarea[name='message']").value;

    try {
      await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message })
      });

      alert("✅ Message sent!");
      form.reset();

    } catch (err) {
      alert("❌ Error");
      console.error(err);
    }
  });

});

// scroll
function scrollToContact() {
  document.getElementById("contact").scrollIntoView({
    behavior: "smooth"
  });
}