// loadTables.js
function loadHTML(targetId, filePath) {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) return;

    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            targetDiv.innerHTML = html;
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

// 使用绝对路径（相对于 <base>）加载
loadHTML("education", "tables/education.html");
loadHTML("experience", "tables/experience.html");
loadHTML("projects", "tables/projects.html");
loadHTML("publications", "tables/publications.html");
loadHTML("timeline", "tables/timeline.html");
loadHTML("games", "tables/games.html");
