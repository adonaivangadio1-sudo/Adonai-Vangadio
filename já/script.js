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

        setTimeout(() => {

            document.body.classList.add("loaded");

        }, 700);

    });

    /*=========================================
      HEADER AO ROLAR
    =========================================*/

    const header = document.getElementById("header");

    function updateHeader(){

        if(window.scrollY > 60){

            header.classList.add("scrolled");

        }else{

            header.classList.remove("scrolled");

        }

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);

    /*=========================================
      MENU MOBILE
    =========================================*/

    const menuButton = document.querySelector(".menu-mobile");
    const navMenu = document.querySelector(".nav-menu");

    if(menuButton && navMenu){

        menuButton.addEventListener("click",()=>{

            menuButton.classList.toggle("active");
            navMenu.classList.toggle("active");

        });

        document.querySelectorAll(".nav-menu a").forEach(link=>{

            link.addEventListener("click",()=>{

                menuButton.classList.remove("active");
                navMenu.classList.remove("active");

            });

        });

    }

    /*=========================================
      SCROLL SUAVE
    =========================================*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            e.preventDefault();

            const destino=document.querySelector(this.getAttribute("href"));

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

    const back=document.getElementById("backToTop");

    if(back){

        function toggleBack(){

            back.style.display=
            window.scrollY>500 ? "flex":"none";

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
 LIGHTBOX DO PORTFÓLIO
=========================================*/

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

document.querySelectorAll(".portfolio-item img").forEach(img=>{

    img.addEventListener("click",()=>{

        lightbox.classList.add("active");

        lightboxImage.src = img.src;

        lightboxImage.alt = img.alt;

        document.body.style.overflow="hidden";

    });

});

if(closeLightbox){

    closeLightbox.addEventListener("click",()=>{

        lightbox.classList.remove("active");

        document.body.style.overflow="";

    });

}

if(lightbox){

    lightbox.addEventListener("click",(e)=>{

        if(e.target===lightbox){

            lightbox.classList.remove("active");

            document.body.style.overflow="";

        }

    });

}


/*=========================================
 PARALLAX DA FOTO PRINCIPAL
=========================================*/

const heroImage = document.querySelector(".image-box img");

window.addEventListener("scroll",()=>{

    if(heroImage){

        heroImage.style.transform =
        `translateY(${window.scrollY*0.12}px)`;

    }

});


/*=========================================
 CONTADORES DAS ESTATÍSTICAS
=========================================*/

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(!entry.isIntersecting) return;

const counter = entry.target;

const target = Number(counter.dataset.target);

let value = 0;

const speed = target/80;

const update = ()=>{

value += speed;

if(value<target){

counter.innerText = Math.floor(value);

requestAnimationFrame(update);

}else{

counter.innerText = target;

}

};

update();

counterObserver.unobserve(counter);

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

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateX=((y/rect.height)-0.5)*-10;

const rotateY=((x/rect.width)-0.5)*10;

card.style.transform=

`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-8px)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});


/*=========================================
 ANIMAÇÃO DO LOGÓTIPO
=========================================*/

const logo=document.querySelector(".logo img");

if(logo){

setInterval(()=>{

logo.animate([

{

transform:"scale(1)"

},

{

transform:"scale(1.08)"

},

{

transform:"scale(1)"

}

],{

duration:1800

});

},4500);

}


/*=========================================
 EFEITO PREMIUM DOS BOTÕES
=========================================*/

document.querySelectorAll(

".btn-primary,.btn-secondary,.btn-header"

).forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-5px) scale(1.03)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="";

});

});


/*=========================================
 VALIDAÇÃO DO FORMULÁRIO
=========================================*/

const form=document.querySelector(".contact-form");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

let valid=true;

form.querySelectorAll(

"input[required], textarea[required]"

).forEach(input=>{

if(input.value.trim()===""){

valid=false;

input.style.border="2px solid #d62828";

}else{

input.style.border="2px solid #28a745";

}

});

if(valid){

alert(

"Obrigado pelo contacto! A sua mensagem foi preparada com sucesso."

);

form.reset();

form.querySelectorAll("input, textarea").forEach(input=>{

input.style.border="";

});

}

});

}


/*=========================================
 CURSOR PERSONALIZADO (DESKTOP)
=========================================*/

if(window.innerWidth>992){

const cursor=document.createElement("div");

cursor.id="customCursor";

document.body.appendChild(cursor);

Object.assign(cursor.style,{

position:"fixed",

width:"18px",

height:"18px",

borderRadius:"50%",

background:"#C79A3B",

pointerEvents:"none",

transform:"translate(-50%,-50%)",

transition:"transform .08s linear",

opacity:".85",

zIndex:"999999"

});

document.addEventListener("mousemove",(e)=>{

cursor.style.left=e.clientX+"px";

cursor.style.top=e.clientY+"px";

});

}


/*=========================================
 PRELOAD DAS IMAGENS
=========================================*/

document.querySelectorAll("img").forEach(img=>{

const preload=new Image();

preload.src=img.src;

});


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
