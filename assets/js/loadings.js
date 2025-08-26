// loadTables.js
function loadHTML(targetId, filePath) {
    const targetDiv = document.getElementById(targetId);
    if (!targetDiv) return; // 如果页面没有这个 div，就跳过

    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            targetDiv.innerHTML = html;
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}


// 加载 education 表格
loadHTML("education", "../tables/education.html");
loadHTML("experience", "../tables/experience.html");
loadHTML("projects", "../tables/projects.html");
loadHTML("publications", "../tables/publications.html");
loadHTML("games", "../tables/games.html");