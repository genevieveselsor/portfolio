console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );

//   if (currentLink) {
//     currentLink.classList.add('current');
//   }

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: "https://github.com/genevieveselsor", title: "GitHub" },
  ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "/website/";         // GitHub Pages repo name

for (let p of pages) {
    let url = !p.url.startsWith("http") ? BASE_PATH + p.url : p.url;
    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );

    if (a.host !== location.host) {
        a.target = "_blank";
      }
    
      nav.append(a);
  }

document.body.insertAdjacentHTML(
'afterbegin',
`
    <label class="color-scheme">
        Theme:
        <select id="color-scheme-select">
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
    </label>`,
);

let select = document.querySelector('.color-scheme select');


if (localStorage.colorScheme) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
  }

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
  });

const form = document.getElementById('contact-form');

form?.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = new FormData(form);

    const urlParams = [];
        
    for (let [name, value] of data) {
        urlParams.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
    }

    const mailtoURL = `mailto:gselsor@ucsd.edu?${urlParams.join('&')}`;

    location.href = mailtoURL;
});
