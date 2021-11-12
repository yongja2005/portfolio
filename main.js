'use strict';

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbar__wrap = document.querySelector('#navbar__wrap');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
	/*console.log(window.scrollY);
	console.log(`navbarHeight: ${navbarHeight}`);*/
	if(window.scrollY > 50) {
		navbar.classList.add('navbar--dark');
		navbar__wrap.classList.add('navbar--dark');
	} else {
		navbar.classList.remove('navbar--dark');
		navbar__wrap.classList.remove('navbar--dark');
	}
});

const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
	const target = event.target;
	const link = target.dataset.link;
	if(link == null) {
		return;
	}
	navbarMenu.classList.remove('open');
	scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', ()=> {
	navbarMenu.classList.toggle('open');
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', ()=> {
	home.style.opacity = 1 - window.scrollY / homeHeight;
	/*console.log(1 - window.scrollY / homeHeight);*/
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
	const filter = e.target.dataset.filter || e.target.parenNode.dataset.filter;
	if(filter == null) {
		return;
	}

	// Remove selection from the previous item and select the new one
	const active = document.querySelector('.category__btn.selected');
	active.classList.remove('selected');
	const target =
	  e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
	e.target.classList.add('selected');

	projectContainer.classList.add('anim-out');

	setTimeout(()=> {
		projects.forEach((project) => {
			console.log(project.dataset.type);
			if(filter ==='*' || filter === project.dataset.type) {
				project.classList.remove('invisible');
			} else {
				project.classList.add('invisible');
			}
		});
		projectContainer.classList.remove('anim-out');
	}, 300);
});



// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다.
// 2. intersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.
const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
//   '#testimonials',
  '#contact',
];
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id =>
  document.querySelector(`[data-link="${id}"]`)
);
/*console.log(sections);
console.log(navItems);*/

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];

function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
	selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => { /*'scroll' 사용시 부자연스러움 */
	if(window.scrollY === 0) {
		selectedNavIndex = 0;
	} else if (
		window.scrollY + window.innerHeight ===
		document.body.clientHeight
	) {
		selectedNavIndex = navItems.length - 1 ;
	}
  selectNavItem(navItems[selectedNavIndex]);
});
