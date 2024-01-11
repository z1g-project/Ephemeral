let root = document.querySelector(":root");
let link;

if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}

function update() {
    if (!localStorage.length) {
        localStorage.setItem("primarycolour", "#888888");
        localStorage.setItem("secondarycolour", "#aaaaaa");
        localStorage.setItem("tertiarycolour", "#666666");
        localStorage.setItem("textcolour", "#222222");
        localStorage.setItem("font", "'Courier New', Courier, monospace");
        localStorage.setItem("title", "Ephermal");
        localStorage.setItem("favicon", "images/default.png");
    }
    root.style.setProperty("--primary-colour", localStorage.getItem("primarycolour"));
    root.style.setProperty("--secondary-colour", localStorage.getItem("secondarycolour"));
    root.style.setProperty("--tertiary-colour", localStorage.getItem("tertiarycolour"));
    root.style.setProperty("--text-colour", localStorage.getItem("textcolour"));
    root.style.setProperty("--font", localStorage.getItem("font"));
    document.title = localStorage.getItem("title");
    if (!(window.location.pathname == "/index.html") && !(localStorage.getItem("favicon").search("http://") || localStorage.getItem("favicon").search("https://"))) {
        link.href = "../" + localStorage.getItem("favicon");  // this part will have to be changed probably when in reactjs
    } else {
        link.href = localStorage.getItem("favicon");
    }
}

function updateSettings() {
    localStorage.setItem("primarycolour", document.getElementById("primarycolour").value);
    localStorage.setItem("secondarycolour", document.getElementById("secondarycolour").value);
    localStorage.setItem("tertiarycolour", document.getElementById("tertiarycolour").value);
    localStorage.setItem("textcolour", document.getElementById("textcolour").value);
    localStorage.setItem("font", document.getElementById("font").value);
    localStorage.setItem("title", document.getElementById("title").value);
    localStorage.setItem("favicon", document.getElementById("favicon").value);

    update();
}

update();

