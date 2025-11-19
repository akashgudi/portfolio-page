// Add a subtle fade-in effect to sections on scroll
const sections = document.querySelectorAll("section");

const options = {
  root: null, // it is the viewport
  threshold: 0.1, // 10% of the item is visible
  rootMargin: "-100px",
};

const observer = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    entry.target.style.opacity = 1;
    entry.target.style.transform = "translateY(0)";
    observer.unobserve(entry.target);
  });
}, options);

sections.forEach((section) => {
  section.style.opacity = 0;
  section.style.transform = "translateY(20px)";
  section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  observer.observe(section);
});

/* --- Accordion Logic for Experience Section --- */
const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion-header");

  header.addEventListener("click", () => {
    const content = item.querySelector(".accordion-content");
    const wasActive = header.classList.contains("active");

    // Close all other items
    accordionItems.forEach((otherItem) => {
      otherItem.querySelector(".accordion-header").classList.remove("active");
      otherItem.querySelector(".accordion-content").style.maxHeight = null;
    });

    // If the clicked item wasn't already open, open it
    if (!wasActive) {
      header.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

/* --- Custom Cursor Logic --- */
document.addEventListener("DOMContentLoaded", () => {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  const interactiveElements = document.querySelectorAll(
    "a, button, .accordion-header"
  );

  let mouseX = 0,
    mouseY = 0;
  let outlineX = 0,
    outlineY = 0;

  // 1. Follow mouse movement
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 2. Animate the cursor with a trailing effect
  const animateCursor = () => {
    // Update dot position directly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    // Update outline with a delay for the trailing effect
    const deltaX = mouseX - outlineX;
    const deltaY = mouseY - outlineY;
    outlineX += deltaX * 0.15; // Adjust 0.15 to change trail speed
    outlineY += deltaY * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  };

  requestAnimationFrame(animateCursor);

  // 3. Handle hover transformations
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseover", () => {
      cursorDot.classList.add("hover");
      cursorOutline.classList.add("hover");
    });
    el.addEventListener("mouseout", () => {
      cursorDot.classList.remove("hover");
      cursorOutline.classList.remove("hover");
    });
  });

  // 4. Handle mouse entering/leaving the window
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = 1;
    cursorOutline.style.opacity = 1;
  });

  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = 0;
    cursorOutline.style.opacity = 0;
  });
});
