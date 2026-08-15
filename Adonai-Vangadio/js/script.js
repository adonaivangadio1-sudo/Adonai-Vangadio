/*==================================================
 ADONAI VANGADIO
 PREMIUM WEBSITE
 SCRIPT.JS
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=========================================
      LOADER
    =========================================*/

    window.addEventListener("load", () => {

        const params = new URLSearchParams(window.location.search);

        if (params.get("skipLoader") === "true") {

            document.body.classList.add("loaded");

            return;

        }

        setTimeout(() => {

            document.body.classList.add("loaded");

        }, 700);

    });


    /*=========================================
      HEADER AO ROLAR
    =========================================*/

    const header = document.getElementById("header");

    function updateHeader(){

        if(!header) return;

        if(window.scrollY > 60){

            header.classList.add("scrolled");

        }else{

            header.classList.remove("scrolled");

        }

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);


    /*=========================================
      MENU MOBILE PREMIUM V2
    =========================================*/

    const menuButton = document.querySelector(".menu-mobile");
    const navMenu = document.querySelector(".nav-menu");

    if (menuButton && navMenu) {

        menuButton.addEventListener("click", (e) => {

            e.stopPropagation();

            menuButton.classList.toggle("active");
            navMenu.classList.toggle("active");

        });


        document.querySelectorAll(".nav-menu a").forEach(link => {

            link.addEventListener("click", () => {

                menuButton.classList.remove("active");
                navMenu.classList.remove("active");

            });

        });


        document.addEventListener("click", (e) => {

            if (
                !navMenu.contains(e.target) &&
                !menuButton.contains(e.target)
            ) {

                menuButton.classList.remove("active");
                navMenu.classList.remove("active");

            }

        });

    }


    /*=========================================
      SCROLL SUAVE
    =========================================*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            e.preventDefault();

            const destino =
                document.querySelector(this.getAttribute("href"));

            if(destino){

                destino.scrollIntoView({

                    behavior:"smooth",
                    block:"start"

                });

            }

        });

    });


    /*=========================================
      BOTÃO VOLTAR AO TOPO
    =========================================*/

    const back = document.getElementById("backToTop");

    if(back){

        function toggleBack(){

            back.style.display =
                window.scrollY > 500 ? "flex" : "none";

        }

        toggleBack();

        window.addEventListener("scroll",toggleBack);


        back.addEventListener("click",()=>{

            window.scrollTo({

                top:0,
                behavior:"smooth"

            });

        });

    }


    /*=========================================
      ANIMAÇÕES AO FAZER SCROLL
    =========================================*/

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{
        threshold:0.15
    });


    document.querySelectorAll(

        ".fade-in, .service-card, .diferencial-card, .timeline-item, .portfolio-item, .stat-card"

    ).forEach(el=>{

        el.classList.add("fade-in");

        observer.observe(el);

    });


    /*=========================================
      PORTFÓLIO PREMIUM
      LIGHTBOX
    =========================================*/

    const portfolioItems =
        document.querySelectorAll(".portfolio-item img");

    const lightbox =
        document.getElementById("portfolioLightbox");

    const lightboxImg =
        document.getElementById("lightboxImg");

    const closeBtn =
        document.getElementById("lightboxClose");

    const prevBtn =
        document.getElementById("lightboxPrev");

    const nextBtn =
        document.getElementById("lightboxNext");

    const counter =
        document.getElementById("lightboxCounter");


    let currentIndex = 0;


    if (
        lightbox &&
        lightboxImg &&
        closeBtn &&
        prevBtn &&
        nextBtn &&
        counter &&
        portfolioItems.length > 0
    ) {


        function openImage(index){

            currentIndex = index;

            lightboxImg.src =
                portfolioItems[index].src;

            lightboxImg.alt =
                portfolioItems[index].alt;


            counter.textContent =
                (index + 1) +
                " / " +
                portfolioItems.length;


            lightbox.classList.add("active");

            document.body.classList.add("lightbox-open");

        }


        function closeImage(){

            lightbox.classList.remove("active");

            document.body.classList.remove("lightbox-open");

        }


        function nextImage(){

            currentIndex++;

            if(currentIndex >= portfolioItems.length){

                currentIndex = 0;

            }

            openImage(currentIndex);

        }


        function prevImage(){

            currentIndex--;

            if(currentIndex < 0){

                currentIndex =
                    portfolioItems.length - 1;

            }

            openImage(currentIndex);

        }


        portfolioItems.forEach((img,index)=>{

            img.addEventListener("click",()=>{

                openImage(index);

            });

        });


        closeBtn.addEventListener(
            "click",
            closeImage
        );


        lightbox.addEventListener("click",(e)=>{

            if(e.target === lightbox){

                closeImage();

            }

        });


        nextBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            nextImage();

        });


        prevBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            prevImage();

        });


        document.addEventListener("keydown",(e)=>{

            if(!lightbox.classList.contains("active")) return;

            if(e.key === "Escape"){

                closeImage();

            }

            if(e.key === "ArrowRight"){

                nextImage();

            }

            if(e.key === "ArrowLeft"){

                prevImage();

            }

        });

    }


    /*=========================================
      CARROSSÉIS DO PORTFÓLIO
      CURRÍCULOS + CARTAS
      FLYERS + LOGO

      MELHORIA:
      CADA SLIDE É CALCULADO PELA SUA
      POSIÇÃO REAL, EVITANDO QUE A FOTO
      FIQUE PELA METADE AO AVANÇAR.
    =========================================*/

    const portfolioCarousels =
        document.querySelectorAll(".portfolio-carousel");


    portfolioCarousels.forEach((carousel) => {

        const track =
            carousel.querySelector(
                ".portfolio-carousel-track"
            );

        const slides =
            carousel.querySelectorAll(
                ".portfolio-slide"
            );

        const previousButton =
            carousel.querySelector(
                ".portfolio-carousel-prev"
            );

        const nextButton =
            carousel.querySelector(
                ".portfolio-carousel-next"
            );

        const section =
            carousel.closest(
                ".portfolio-carousel-section"
            );

        const counter =
            section
                ? section.querySelector(
                    ".portfolio-carousel-counter"
                )
                : null;


        if (
            !track ||
            !slides.length ||
            !previousButton ||
            !nextButton
        ){

            return;

        }


        let currentSlide = 0;

        let carouselInterval = null;

        let touchStartX = 0;

        let touchEndX = 0;

        let isDragging = false;


        const totalSlides =
            slides.length;


        /*=========================================
          GARANTIR QUE CADA SLIDE OCUPA
          EXATAMENTE A LARGURA DO CARROSSEL
        =========================================*/

        function calculateSlideSizes(){

            const carouselWidth =
                carousel.clientWidth;

            if(!carouselWidth) return;


            slides.forEach(slide => {

                slide.style.width =
                    carouselWidth + "px";

                slide.style.minWidth =
                    carouselWidth + "px";

                slide.style.maxWidth =
                    carouselWidth + "px";

                slide.style.flex =
                    "0 0 " + carouselWidth + "px";

                slide.style.boxSizing =
                    "border-box";

            });

        }


        /*=========================================
          ATUALIZAR CARROSSEL
          USANDO A POSIÇÃO REAL DO SLIDE
        =========================================*/

        function updateCarousel(){

            calculateSlideSizes();


            const currentSlideElement =
                slides[currentSlide];


            if(!currentSlideElement) return;


            const slidePosition =
                currentSlideElement.offsetLeft;


            track.style.transform =
                `translate3d(-${slidePosition}px, 0, 0)`;


            if(counter){

                counter.textContent =
                    `${currentSlide + 1} / ${totalSlides}`;

            }

        }


        /*=========================================
          PRÓXIMO SLIDE
        =========================================*/

        function nextCarouselSlide(){

            currentSlide++;

            if(currentSlide >= totalSlides){

                currentSlide = 0;

            }

            updateCarousel();

        }


        /*=========================================
          SLIDE ANTERIOR
        =========================================*/

        function previousCarouselSlide(){

            currentSlide--;

            if(currentSlide < 0){

                currentSlide =
                    totalSlides - 1;

            }

            updateCarousel();

        }


        /*=========================================
          PARAR AUTOPLAY
        =========================================*/

        function stopCarousel(){

            if(carouselInterval){

                clearInterval(
                    carouselInterval
                );

                carouselInterval = null;

            }

        }


        /*=========================================
          INICIAR AUTOPLAY
        =========================================*/

        function startCarousel(){

            stopCarousel();


            carouselInterval =
                setInterval(() => {

                    nextCarouselSlide();

                }, 5000);

        }


        /*=========================================
          BOTÃO ANTERIOR
        =========================================*/

        previousButton.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                previousCarouselSlide();

                startCarousel();

            }
        );


        /*=========================================
          BOTÃO PRÓXIMO
        =========================================*/

        nextButton.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                nextCarouselSlide();

                startCarousel();

            }
        );


        /*=========================================
          DESLIZAR NO TELEMÓVEL
        =========================================*/

        carousel.addEventListener(
            "touchstart",
            (e) => {

                touchStartX =
                    e.changedTouches[0].screenX;

                touchEndX =
                    touchStartX;

                isDragging = true;

                stopCarousel();

            },
            {
                passive:true
            }
        );


        carousel.addEventListener(
            "touchmove",
            (e) => {

                if(!isDragging) return;

                touchEndX =
                    e.changedTouches[0].screenX;

            },
            {
                passive:true
            }
        );


        carousel.addEventListener(
            "touchend",
            () => {

                if(!isDragging) return;


                const difference =
                    touchStartX - touchEndX;


                const minimumSwipe = 50;


                if(
                    Math.abs(difference)
                    >= minimumSwipe
                ){

                    if(difference > 0){

                        nextCarouselSlide();

                    }else{

                        previousCarouselSlide();

                    }

                }


                isDragging = false;

                startCarousel();

            }
        );


        /*=========================================
          PAUSAR COM O MOUSE
        =========================================*/

        carousel.addEventListener(
            "mouseenter",
            () => {

                stopCarousel();

            }
        );


        carousel.addEventListener(
            "mouseleave",
            () => {

                startCarousel();

            }
        );


        /*=========================================
          RECALCULAR AO MUDAR O TAMANHO
          DA JANELA / ROTAÇÃO DO TELEMÓVEL
        =========================================*/

        let resizeTimer = null;


        window.addEventListener(
            "resize",
            () => {

                clearTimeout(resizeTimer);


                resizeTimer =
                    setTimeout(() => {

                        updateCarousel();

                    }, 100);

            }
        );


        /*=========================================
          RECALCULAR QUANDO AS IMAGENS TERMINAREM
          DE CARREGAR
        =========================================*/

        slides.forEach(slide => {

            const image =
                slide.querySelector("img");


            if(image){

                if(image.complete){

                    requestAnimationFrame(() => {

                        updateCarousel();

                    });

                }else{

                    image.addEventListener(
                        "load",
                        () => {

                            updateCarousel();

                        },
                        {
                            once:true
                        }
                    );

                }

            }

        });


        /*=========================================
          INICIALIZAR
        =========================================*/

        currentSlide = 0;

        calculateSlideSizes();

        updateCarousel();

        startCarousel();

    });


    /*=========================================
      PARALLAX DA FOTO PRINCIPAL
    =========================================*/

    const heroImage =
        document.querySelector(".image-box img");


    window.addEventListener("scroll",()=>{

        if(heroImage){

            heroImage.style.transform =
                `translateY(${window.scrollY * 0.12}px)`;

        }

    });


    /*=========================================
      CONTADORES DAS ESTATÍSTICAS
    =========================================*/

    const counters =
        document.querySelectorAll(".counter");


    const counterObserver =
        new IntersectionObserver(entries=>{

            entries.forEach(entry=>{

                if(!entry.isIntersecting) return;


                const counter =
                    entry.target;


                const target =
                    Number(
                        counter.dataset.target
                    );


                let value = 0;


                const speed =
                    target / 80;


                const update = ()=>{

                    value += speed;


                    if(value < target){

                        counter.innerText =
                            Math.floor(value);

                        requestAnimationFrame(
                            update
                        );

                    }else{

                        counter.innerText =
                            target;

                    }

                };


                update();


                counterObserver.unobserve(
                    counter
                );

            });

        },{
            threshold:.5
        });


    counters.forEach(counter=>{

        counterObserver.observe(counter);

    });


    /*=========================================
      EFEITO 3D NOS CARDS
    =========================================*/

    document.querySelectorAll(

        ".service-card, .diferencial-card, .timeline-item"

    ).forEach(card=>{

        card.addEventListener("mousemove",(e)=>{

            const rect =
                card.getBoundingClientRect();


            const x =
                e.clientX - rect.left;


            const y =
                e.clientY - rect.top;


            const rotateX =
                ((y / rect.height) - 0.5) * -10;


            const rotateY =
                ((x / rect.width) - 0.5) * 10;


            card.style.transform =

                `perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)`;

        });


        card.addEventListener(
            "mouseleave",
            ()=>{

                card.style.transform = "";

            }
        );

    });


    /*=========================================
      EFEITO PREMIUM DOS BOTÕES
    =========================================*/

    document.querySelectorAll(

        ".btn-primary,.btn-secondary,.btn-header"

    ).forEach(btn=>{

        btn.addEventListener(
            "mouseenter",
            ()=>{

                btn.style.transform =
                    "translateY(-5px) scale(1.03)";

            }
        );


        btn.addEventListener(
            "mouseleave",
            ()=>{

                btn.style.transform = "";

            }
        );

    });


    /*=========================================
      FORMULÁRIO DE CONTACTO - FORMSPREE
    =========================================*/

    const form =
        document.querySelector(".contact-form");


    if (form) {

        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                fetch(
                    form.action,
                    {

                        method: "POST",

                        body:
                            new FormData(form),

                        headers: {

                            "Accept":
                                "application/json"

                        }

                    }
                )

                .then(response => {

                    if (response.ok) {

                        const modal =
                            document.getElementById(
                                "successModal"
                            );


                        const fechar =
                            document.getElementById(
                                "closeSuccess"
                            );


                        if(modal){

                            modal.classList.add(
                                "active"
                            );


                            if(fechar){

                                fechar.onclick = () => {

                                    modal.classList.remove(
                                        "active"
                                    );

                                };

                            }

                        }


                        form.reset();


                        form
                            .querySelectorAll(
                                "input, textarea"
                            )
                            .forEach(input => {

                                input.style.border = "";

                            });

                    } else {

                        alert(
                            "Ocorreu um erro ao enviar a mensagem. Tente novamente."
                        );

                    }

                })

                .catch(() => {

                    alert(
                        "Não foi possível enviar a mensagem. Verifique a sua ligação à Internet e tente novamente."
                    );

                });

            }
        );

    }


    /*=========================================
      CURSOR PERSONALIZADO (DESKTOP)
    =========================================*/

    if(window.innerWidth > 992){

        const cursor =
            document.createElement("div");


        cursor.id =
            "customCursor";


        document.body.appendChild(
            cursor
        );


        Object.assign(
            cursor.style,
            {

                position:"fixed",

                width:"18px",

                height:"18px",

                borderRadius:"50%",

                background:"#C79A3B",

                pointerEvents:"none",

                transform:
                    "translate(-50%,-50%)",

                transition:
                    "transform .08s linear",

                opacity:".85",

                zIndex:"999999"

            }
        );


        document.addEventListener(
            "mousemove",
            (e)=>{

                cursor.style.left =
                    e.clientX + "px";

                cursor.style.top =
                    e.clientY + "px";

            }
        );

    }


    /*=========================================
      PRELOAD DAS IMAGENS
    =========================================*/

    document.querySelectorAll("img").forEach(img=>{

        const preload =
            new Image();

        preload.src =
            img.src;

    });


    /*=========================================
      CAROUSEL PREMIUM - BANNER PRINCIPAL
    =========================================*/

    const heroCarousel =
        document.getElementById(
            "heroCarousel"
        );


    if (heroCarousel) {

        const slides =
            heroCarousel.querySelectorAll(
                ".hero-slide"
            );


        const dots =
            heroCarousel.querySelectorAll(
                ".hero-dot"
            );


        let currentSlide = 0;

        let carouselInterval = null;

        let touchStartX = 0;

        let touchEndX = 0;

        let isDragging = false;


        const totalSlides =
            slides.length;


        if (totalSlides > 0) {


            function showSlide(index) {

                if (index >= totalSlides) {

                    index = 0;

                }


                if (index < 0) {

                    index =
                        totalSlides - 1;

                }


                currentSlide =
                    index;


                slides.forEach(
                    (slide, slideIndex) => {

                        slide.classList.toggle(
                            "active",
                            slideIndex === currentSlide
                        );

                    }
                );


                dots.forEach(
                    (dot, dotIndex) => {

                        dot.classList.toggle(
                            "active",
                            dotIndex === currentSlide
                        );

                    }
                );

            }


            function nextSlide() {

                showSlide(
                    currentSlide + 1
                );

            }


            function previousSlide() {

                showSlide(
                    currentSlide - 1
                );

            }


            function startCarousel() {

                stopCarousel();


                carouselInterval =
                    setInterval(() => {

                        nextSlide();

                    }, 5000);

            }


            function stopCarousel() {

                if (carouselInterval) {

                    clearInterval(
                        carouselInterval
                    );

                    carouselInterval = null;

                }

            }


            /*=========================================
              CLIQUE NAS BOLINHAS
            =========================================*/

            dots.forEach((dot,index)=>{

                dot.addEventListener(
                    "click",
                    () => {

                        showSlide(index);

                        startCarousel();

                    }
                );

            });


            /*=========================================
              DESLIZAR NO TELEMÓVEL
            =========================================*/

            heroCarousel.addEventListener(
                "touchstart",
                (e) => {

                    touchStartX =
                        e.changedTouches[0].screenX;

                    isDragging = true;

                    stopCarousel();

                },
                {
                    passive:true
                }
            );


            heroCarousel.addEventListener(
                "touchmove",
                (e) => {

                    if (!isDragging) return;

                    touchEndX =
                        e.changedTouches[0].screenX;

                },
                {
                    passive:true
                }
            );


            heroCarousel.addEventListener(
                "touchend",
                () => {

                    if (!isDragging) return;


                    const difference =
                        touchStartX - touchEndX;


                    const minimumSwipe = 50;


                    if(
                        Math.abs(difference)
                        >= minimumSwipe
                    ){

                        if(difference > 0){

                            nextSlide();

                        }else{

                            previousSlide();

                        }

                    }


                    isDragging = false;

                    startCarousel();

                }
            );


            /*=========================================
              PAUSAR AO PASSAR O MOUSE
            =========================================*/

            heroCarousel.addEventListener(
                "mouseenter",
                () => {

                    stopCarousel();

                }
            );


            heroCarousel.addEventListener(
                "mouseleave",
                () => {

                    startCarousel();

                }
            );


            /*=========================================
              INICIAR CARROSSEL
            =========================================*/

            showSlide(0);

            startCarousel();

        }

    }


    /*=========================================
      MENSAGEM NO CONSOLE
    =========================================*/

    console.clear();


    console.log(

        "%cADONAI VANGADIO",

        "color:#C79A3B;font-size:22px;font-weight:bold;"

    );


    console.log(

        "%cPremium Website © 2026",

        "color:#666;font-size:14px;"

    );

});
/* =========================================================
   CORREÇÃO DO HEADER FIXO
   NÃO DEIXAR O HEADER COBRIR O CONTEÚDO
========================================================= */

(function () {

    const header = document.getElementById("header");

    if (!header) return;


    function ajustarEspacoDoHeader() {

        const alturaHeader = header.offsetHeight;


        /* Cria espaço no início da página */

        document.documentElement.style.setProperty(
            "--header-height",
            alturaHeader + "px"
        );


        /* Evita que o primeiro conteúdo fique escondido */

        const primeiroConteudo =
            document.querySelector("main") ||
            document.querySelector(".hero") ||
            document.body.firstElementChild;


        if (
            primeiroConteudo &&
            primeiroConteudo !== header &&
            !primeiroConteudo.classList.contains("header-spacer")
        ) {

            primeiroConteudo.style.scrollMarginTop =
                alturaHeader + "px";

        }

    }


    /* Executa quando a página abre */

    ajustarEspacoDoHeader();


    /* Executa quando o tamanho da tela muda */

    window.addEventListener(
        "resize",
        ajustarEspacoDoHeader
    );


    /* Executa depois que tudo carregar */

    window.addEventListener(
        "load",
        ajustarEspacoDoHeader
    );

})();

/* =========================================================
   HEADER FIXO — SEPARAÇÃO REAL DO CONTEÚDO
   HEADER → LINHA → FOTOGRAFIA
========================================================= */

(function () {

    const header = document.getElementById("header");

    if (!header) return;


    /* Cria o espaço que ficará exatamente
       depois do cabeçalho */

    let headerSpacer = document.getElementById(
        "header-spacer"
    );


    if (!headerSpacer) {

        headerSpacer = document.createElement("div");

        headerSpacer.id = "header-spacer";

        /* Coloca imediatamente DEPOIS do header */

        header.parentNode.insertBefore(
            headerSpacer,
            header.nextSibling
        );

    }


    function organizarHeader() {

        /* Pega a altura REAL do cabeçalho */

        const altura = header.offsetHeight;


        /* O espaço terá exatamente
           a mesma altura do header */

        headerSpacer.style.height =
            altura + "px";


        /* Impede que regras antigas
           empurrem o conteúdo novamente */

        const main = document.querySelector("main");

        if (main) {

            main.style.paddingTop = "0px";

        }


        /* Remove possíveis margens
           artificiais do hero */

        const hero = document.querySelector(".hero");

        if (hero) {

            hero.style.marginTop = "0px";

        }

    }


    /* Executa quando abre */

    organizarHeader();


    /* Executa depois que imagens/fontes
       terminarem de carregar */

    window.addEventListener(
        "load",
        organizarHeader
    );


    /* Executa quando muda o tamanho
       da tela */

    window.addEventListener(
        "resize",
        organizarHeader
    );


})();

/* =========================================================
   ESPAÇO MÍNIMO ENTRE FOTOGRAFIA E SERVIÇOS
========================================================= */

(function () {

    function ajustarEspaco() {

        const fotografia = document.querySelector(".hero-banner");
        const hero = document.querySelector(".hero");
        const badge = document.querySelector(".hero-badge");

        if (!fotografia || !hero || !badge) return;

        fotografia.style.setProperty(
            "margin-bottom",
            "0px",
            "important"
        );

        hero.style.setProperty(
            "padding-top",
            "3px",
            "important"
        );

        badge.style.setProperty(
            "margin-top",
            "0px",
            "important"
        );
    }

    ajustarEspaco();

    window.addEventListener("load", ajustarEspaco);
    window.addEventListener("resize", ajustarEspaco);

})();

/* =========================================================
   SELETOR DE TEMA — ADONAI VANGADIO
   CLARO / ESCURO / AUTOMÁTICO
========================================================= */

(function () {

    const themeSwitcher =
        document.querySelector(".theme-switcher");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeMenu =
        document.getElementById("themeMenu");

    const themeOptions =
        document.querySelectorAll(".theme-option");


    if (
        !themeSwitcher ||
        !themeToggle ||
        !themeMenu
    ) {
        return;
    }


    /* =====================================================
       PREFERÊNCIA GUARDADA
    ===================================================== */

    const savedTheme =
        localStorage.getItem("adonaiTheme");


    /* =====================================================
       TEMA DO SISTEMA
    ===================================================== */

    const systemTheme =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    /* =====================================================
       DESCOBRIR O TEMA REAL
    ===================================================== */

    function getSystemTheme() {

        return systemTheme.matches
            ? "dark"
            : "light";

    }


    /* =====================================================
       APLICAR TEMA
    ===================================================== */

    function applyTheme(theme) {

        let finalTheme = theme;


        /* AUTOMÁTICO */

        if (theme === "system") {

            finalTheme =
                getSystemTheme();

        }


        document.documentElement
            .setAttribute(
                "data-theme",
                finalTheme
            );


        updateThemeIcon(finalTheme);

        updateActiveOption(theme);

    }


    /* =====================================================
       ALTERAR ÍCONE DO BOTÃO
    ===================================================== */

    function updateThemeIcon(theme) {

        const icon =
            themeToggle.querySelector("i");

        if (!icon) return;


        icon.className =
            "fa-solid fa-circle-half-stroke";


        /*
         * O botão permanece com o símbolo
         * dividido, porque ele representa
         * o seletor de tema.
         */

    }


    /* =====================================================
       MARCAR OPÇÃO ATIVA
    ===================================================== */

    function updateActiveOption(theme) {

        themeOptions.forEach(option => {

            option.classList.remove("active");

        });


        const selected =
            document.querySelector(
                `.theme-option[data-theme="${theme}"]`
            );


        if (selected) {

            selected.classList.add("active");

        }

    }


    /* =====================================================
       TEMA INICIAL
    ===================================================== */

    if (savedTheme) {

        applyTheme(savedTheme);

    } else {

        /*
         * Se nunca escolheu manualmente,
         * usa automaticamente o tema do telefone.
         */

        applyTheme("system");

    }


    /* =====================================================
       ABRIR / FECHAR MENU
    ===================================================== */

    themeToggle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const isOpen =
                themeSwitcher.classList.contains(
                    "active"
                );


            if (isOpen) {

                themeSwitcher.classList.remove(
                    "active"
                );

                themeToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                themeMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );

            } else {

                themeSwitcher.classList.add(
                    "active"
                );

                themeToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

                themeMenu.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       ESCOLHER TEMA
    ===================================================== */

    themeOptions.forEach(option => {

        option.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const selectedTheme =
                    this.dataset.theme;


                /*
                 * Guarda a escolha
                 */

                localStorage.setItem(
                    "adonaiTheme",
                    selectedTheme
                );


                /*
                 * Aplica imediatamente
                 */

                document.documentElement
                    .classList.add(
                        "theme-transition"
                    );


                applyTheme(selectedTheme);


                /*
                 * Fecha o menu
                 */

                themeSwitcher.classList.remove(
                    "active"
                );


                themeToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                themeMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );


                /*
                 * Remove a classe da transição
                 */

                setTimeout(() => {

                    document.documentElement
                        .classList.remove(
                            "theme-transition"
                        );

                }, 400);

            }
        );

    });


    /* =====================================================
       CLICAR FORA → FECHAR
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !themeSwitcher.contains(
                    event.target
                )
            ) {

                themeSwitcher.classList.remove(
                    "active"
                );

                themeToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                themeMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );


    /* =====================================================
       TECLA ESC → FECHAR
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                themeSwitcher.classList.remove(
                    "active"
                );

                themeToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                themeMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );


    /* =====================================================
       SE ESTIVER EM AUTOMÁTICO
       ACOMPANHAR ALTERAÇÃO DO TELEFONE
    ===================================================== */

    systemTheme.addEventListener(
        "change",
        function () {

            const currentPreference =
                localStorage.getItem(
                    "adonaiTheme"
                );


            if (
                currentPreference === "system" ||
                !currentPreference
            ) {

                applyTheme("system");

            }

        }
    );


})();
/* =========================================================
   ADONAI VANGADIO
   SISTEMA DE TEMA — SUBPÁGINAS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const themeToggle = document.getElementById("themeToggle");
    const themeMenu = document.getElementById("themeMenu");
    const themeOptions = document.querySelectorAll(".theme-option");

    if (!themeToggle || !themeMenu) {
        return;
    }


    /* =====================================================
       OBTER TEMA GUARDADO
    ===================================================== */

    const savedTheme = localStorage.getItem("adonai-theme");

    if (savedTheme) {

        applyTheme(savedTheme);

    } else {

        applyTheme("system");

    }


    /* =====================================================
       ABRIR / FECHAR MENU DE TEMA
    ===================================================== */

    themeToggle.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen =
            themeMenu.classList.toggle("active");

        themeToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        themeMenu.setAttribute(
            "aria-hidden",
            isOpen ? "false" : "true"
        );

    });


    /* =====================================================
       ESCOLHER TEMA
    ===================================================== */

    themeOptions.forEach(function (option) {

        option.addEventListener("click", function (event) {

            event.stopPropagation();

            const selectedTheme =
                option.getAttribute("data-theme");

            if (!selectedTheme) {
                return;
            }

            applyTheme(selectedTheme);

            localStorage.setItem(
                "adonai-theme",
                selectedTheme
            );

            closeThemeMenu();

        });

    });


    /* =====================================================
       FECHAR AO CLICAR FORA
    ===================================================== */

    document.addEventListener("click", function (event) {

        if (
            !themeMenu.contains(event.target) &&
            !themeToggle.contains(event.target)
        ) {

            closeThemeMenu();

        }

    });


    /* =====================================================
       FECHAR COM ESC
    ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeThemeMenu();

        }

    });


    /* =====================================================
       APLICAR TEMA
    ===================================================== */

    function applyTheme(theme) {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );


        /* -----------------------------------------------
           ATUALIZAR ÍCONE DO BOTÃO
        ------------------------------------------------ */

        const icon =
            themeToggle.querySelector("i");

        if (icon) {

            icon.className =
                "fa-solid fa-circle-half-stroke";

        }


        /* -----------------------------------------------
           MARCAR OPÇÃO ATIVA
        ------------------------------------------------ */

        themeOptions.forEach(function (option) {

            const optionTheme =
                option.getAttribute("data-theme");

            option.classList.toggle(
                "active",
                optionTheme === theme
            );

        });

    }


    /* =====================================================
       FECHAR MENU
    ===================================================== */

    function closeThemeMenu() {

        themeMenu.classList.remove("active");

        themeToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        themeMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       SISTEMA AUTOMÁTICO
       Atualiza quando o sistema muda entre claro/escuro
    ===================================================== */

    const systemTheme =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    systemTheme.addEventListener(
        "change",
        function () {

            const currentTheme =
                localStorage.getItem("adonai-theme");

            if (currentTheme === "system") {

                applyTheme("system");

            }

        }
    );

});