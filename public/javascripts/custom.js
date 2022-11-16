const navSlide = () => {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelector(".nav-links li");

    burger.addEventListener("click", () => {
        // Nav toggler.
        nav.classList.toggle("nav-active"); // toggle significa básicamente on-off.

        // Animación de enlaces.
        navLinks.forEach((link, index) => {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 1.5}s`;
        });

        // Burger animation.
        burger.classList.toggle("toggle");
    });
}

navSlide();