
class ToggleMenu {
    constructor() {
      this.navbar = document.getElementById("navbar");
      this.burger = document.getElementById("burger");
      this.navlinks = document.querySelectorAll(`#navbar li a`);
      this.screenSize = 800;
    }
  
    init() {
        this.burger.addEventListener("click", () => {
                this.toggleMenu();
            });
        
        this.navlinks.forEach((item) => {
            item.addEventListener("click", () => {
                this.toggleMenu();
            });
        });
      window.addEventListener("resize", () => {
        if (window.innerWidth > this.screenSize) {
          this.removeMenu();
        }
      });
    }
  
    toggleMenu() {

      this.navbar.classList.toggle("open");
    }
    removeMenu() {
      this.navbar.classList.remove("open");
    }
  }
  
  /*utilisation simple*/
new ToggleMenu().init();
