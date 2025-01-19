var openmenu = document.querySelector("#nav i");
var closemenu = document.querySelector("#menu i");
var main = document.querySelector("#main");
var cursor = document.querySelector("#cursor");

function breakthetext() {
  var h2 = document.querySelector("h2");
  if (!h2) return;

  var logo = h2.textContent;
  var splitlogo = logo.split("");
  var clutter = splitlogo
    .map((elem) => {
      let cls = elem.toLowerCase();
      return `<span class="${cls}">${elem}</span>`;
    })
    .join("");

  h2.innerHTML = clutter;
}
breakthetext();

var tl = gsap.timeline();
tl.from("h2 span", {
  y: -100,
  opacity: 0,
  duration: 1,
  delay: 0.1,
});

tl.from("#nav i", {
  x: 50,
  opacity: 0,
  duration: 1,
});



var tl2 = gsap.timeline();
tl2.to("#menu", {
  right: 0,
  duration: 0.7,
});
tl2.from("#menu h4", {
  x: 150,
  duration: 0.5,
  stagger: 0.3,
  opacity: 0,
});
tl2.from("#menu i", {
  opacity: 0,
});
tl2.pause();

if (openmenu && closemenu) {
  openmenu.addEventListener("click", function () {
    tl2.play();
  });

  closemenu.addEventListener("click", function () {
    tl2.reverse();
  });
}

if (main && cursor) {
  main.addEventListener("mousemove", function (dets) {
    gsap.to(cursor, {
      x: dets.x,
      y: dets.y,
      duration: 0.3, 
      ease: "power2.out",
    });
  });
}

let debounceTimer;
window.addEventListener("wheel", function (dets) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (dets.deltaY > 0) {
      gsap.to(".marque", {
        transform: "translateX(-400%)",
        duration: 4,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".marque img", {
        rotate: 180,
      });
    } else {
      gsap.to(".marque", {
        transform: "translateX(0%)",
        duration: 4,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".marque img", {
        rotate: 0,
      });
    }
  }, 100); 
});


gsap.to("#page4 h1",{
   
    transform:"translateX(-150%)",
    scrollTrigger:{
        trigger:"#page4",
        scroller:"body",
        start:"top 0%",
        end:"top -100%",
        scrub:2,
        pin:true


    }
})