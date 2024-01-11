function updateInputValues() {
    if (localStorage.length) {
        document.getElementById("primarycolour").value = localStorage.getItem("primarycolour");
        document.getElementById("secondarycolour").value = localStorage.getItem("secondarycolour");
        document.getElementById("tertiarycolour").value = localStorage.getItem("tertiarycolour");
        document.getElementById("textcolour").value = localStorage.getItem("textcolour");
        document.getElementById("font").value = localStorage.getItem("font");
        document.getElementById("title").value = localStorage.getItem("title");
        document.getElementById("favicon").value = localStorage.getItem("favicon");
    } else {
        document.getElementById("primarycolour").value = "#888888";
        document.getElementById("secondarycolour").value = "#aaaaaa";
        document.getElementById("tertiarycolour").value = "#666666";
        document.getElementById("textcolour").value = "#222222";
        document.getElementById("font").value = "'Courier New', Courier, monospace";
        document.getElementById("title").value = "Ephermal";
        document.getElementById("favicon").value = "images/default.png";
    }
}

updateInputValues();