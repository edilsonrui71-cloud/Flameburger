/* =========================================
   FLAME BURGER®
   JavaScript + GSAP
   ========================================= */


/* 01. CONFIGURAÇÃO INICIAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* Ano automático no rodapé */

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =========================================
       02. MENU PARA TELEMÓVEIS
    ========================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            document.body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";

        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 760) {
                closeMenu();
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =========================================
       03. CARRINHO DE COMPRAS
    ========================================= */

    const cart = [];

    const cartCount = document.getElementById("cartCount");
    const cartButton = document.getElementById("cartButton");
    const toast = document.getElementById("toast");

    let toastTimer;

    function showToast(message) {

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 2400);

    }


    /* Adicionar produtos */

    document.querySelectorAll(".add-button").forEach(button => {

        button.addEventListener("click", () => {

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            if (!name || !Number.isFinite(price) || price <= 0) {
                showToast("Não foi possível adicionar este produto.");
                return;
            }

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });

            }

            updateCartCount();

            showToast(name + " adicionado ao pedido.");

            animateCart();

        });

    });


    /* Atualizar quantidade de produtos */

    function updateCartCount() {

        if (!cartCount) return;

        const totalItems = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        cartCount.textContent = totalItems;

    }


    /* Pequena animação ao adicionar produto */

    function animateCart() {

        if (
            typeof gsap !== "undefined" &&
            cartButton &&
            !prefersReducedMotion
        ) {

            gsap.fromTo(
                cartButton,
                {
                    scale: 1
                },
                {
                    scale: 1.08,
                    duration: 0.15,
                    repeat: 1,
                    yoyo: true,
                    ease: "power1.inOut"
                }
            );

        }

    }


    /* Mostrar resumo do pedido */

    if (cartButton) {

        cartButton.addEventListener("click", () => {

            if (cart.length === 0) {

                showToast("O teu pedido ainda está vazio.");

                return;

            }

            const total = cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const orderLines = cart.map(item => {

                return (
                    `${item.quantity}x ${item.name}`
                );

            });

            showToast(
                orderLines.join(" · ") +
                " | Total: " +
                total.toLocaleString("pt-PT") +
                " MZN"
            );

        });

    }


    /* =========================================
       04. GSAP — ANIMAÇÕES CINEMATOGRÁFICAS
    ========================================= */

    if (typeof gsap === "undefined") {

        console.warn(
            "GSAP não foi carregado. Confirma a ligação à Internet e os scripts no HTML."
        );

        return;

    }


    /* Respeitar a preferência de movimento reduzido */

    if (prefersReducedMotion) {
        return;
    }


    /* Ativar o ScrollTrigger, se disponível */

    const hasScrollTrigger =
        typeof ScrollTrigger !== "undefined";

    if (hasScrollTrigger) {

        gsap.registerPlugin(ScrollTrigger);

    }


    /* =========================================
       05. INTRODUÇÃO DO HERO
    ========================================= */

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });


    /* Cabeçalho */

    heroTimeline.from(".header", {
        y: -25,
        opacity: 0,
        duration: 0.8
    });


    /* Pequeno texto acima do título */

    heroTimeline.from(".hero-kicker", {
        y: 25,
        opacity: 0,
        duration: 0.65
    }, "-=0.3");


    /* Título principal */

    heroTimeline.from(".title-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        stagger: 0.15
    }, "-=0.2");


    /* Descrição */

    heroTimeline.from(".hero-description", {
        y: 20,
        opacity: 0,
        duration: 0.7
    }, "-=0.45");


    /* Botões */

    heroTimeline.from(".hero-actions", {
        y: 18,
        opacity: 0,
        duration: 0.7
    }, "-=0.4");


    /* Informação inferior */

    heroTimeline.from(".hero-bottom", {
        opacity: 0,
        duration: 0.7
    }, "-=0.25");


    /* =========================================
       06. ZOOM DA FOTOGRAFIA
    ========================================= */

    const heroImage = document.getElementById("heroImage");

    if (heroImage) {

        gsap.to(heroImage, {
            scale: 1,
            duration: 2.2,
            ease: "power2.out"
        });

    }


    /* =========================================
       07. ANIMAÇÕES AO FAZER SCROLL
    ========================================= */

    if (hasScrollTrigger) {

        /* Revelar elementos */

        gsap.utils.toArray(".reveal").forEach(element => {

            gsap.from(element, {
                y: 35,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true
                }
            });

        });


        /* Entrada progressiva dos cartões */

        const menuGrid = document.querySelector(".menu-grid");

        if (menuGrid) {

            gsap.from(".menu-card", {
                y: 35,
                opacity: 0,
                duration: 0.75,
                stagger: 0.12,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: menuGrid,
                    start: "top 85%",
                    once: true
                }
            });

        }


        /* Parallax da fotografia principal */

        if (heroImage) {

            gsap.to(heroImage, {
                yPercent: 8,
                ease: "none",

                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });

        }

    }


    /* =========================================
       08. EFEITO SUBTIL NOS BOTÕES
    ========================================= */

    if (window.matchMedia("(hover: hover)").matches) {

        document.querySelectorAll(".button-primary").forEach(button => {

            button.addEventListener("mouseenter", () => {

                gsap.to(button, {
                    duration: 0.25,
                    ease: "power2.out",
                    y: -3
                });

            });

            button.addEventListener("mouseleave", () => {

                gsap.to(button, {
                    duration: 0.25,
                    ease: "power2.out",
                    y: 0
                });

            });

        });

    }


    /* =========================================
       09. CONFIRMAÇÃO NO CONSOLE
    ========================================= */

    console.log(
        "FLAME BURGER: JavaScript e GSAP inicializados com sucesso."
    );

});