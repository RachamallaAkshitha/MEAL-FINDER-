const toggleBtn = document.getElementById("toggleBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        sidebar.style.right = "0px";
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        sidebar.style.right = "-300px";
    });
}



// --------------------------------------
// 2. API LINKS
// --------------------------------------
const CATEGORIES_API = "https://www.themealdb.com/api/json/v1/1/categories.php";
const SEARCH_API = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const FILTER_API = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
const DETAILS_API = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// 3. LOAD CATEGORIES ON HOMEPAGE

const loadCategories = async () => {
    const box = document.getElementById("categoryList");
    const sideList = document.getElementById("sideList");

    if (!box) return;

    const res = await fetch(CATEGORIES_API);
    const data = await res.json();
    const categories = data.categories;

    categories.forEach(category => {
        box.innerHTML += `
            <div class="card" onclick="openCategory('${category.strCategory}')">
                <img src="${category.strCategoryThumb}">
                <p>${category.strCategory}</p>
            </div>
        `;

        if (sideList) {
            sideList.innerHTML += `
                <li onclick="openCategory('${category.strCategory}')">
                    ${category.strCategory}
                </li>
            `;
        }
    });
};

loadCategories();




// 4. OPEN CATEGORY PAGE
const openCategory = (name) => {
    window.location.href = `category.html?c=${name}`;
};
