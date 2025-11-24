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
                <span class="cat-badge">${category.strCategory}</span>
            </div>
        `;
        if (sideList) {
           
            sideList.innerHTML += `
        <li onclick="showCategoryInPage('${category.strCategory}')">
            ${category.strCategory}
        </li>
    `;
        }
    });
};

loadCategories();

// CATEGORY DESCRIPTION

async function showCategoryInPage(categoryName) {

    const descBox = document.getElementById('categoryDesc');
    const mealsGrid = document.getElementById('mealsGrid');
    if (!descBox || !mealsGrid) return;

    descBox.style.display = 'block';
    descBox.innerHTML = '<p>Loading category info…</p>';
    mealsGrid.innerHTML = '<p>Loading meals…</p>';

    try {

        const catRes = await fetch(CATEGORIES_API);
        const catJson = await catRes.json();
        const categoryObj = (catJson.categories || []).find(c => c.strCategory === categoryName);


        if (categoryObj) {
            const desc = categoryObj.strCategoryDescription || '';
            const short = desc.length > 900 ? desc.slice(0, 900) + '…' : desc;
            descBox.innerHTML = `
                <h3 style="color:var(--accent); margin:0 0 8px;">${escapeHtml(categoryName)}</h3>
                <p style="margin:0; color:#444; line-height:1.55;">${escapeHtml(short)}</p>
            `;
        } else {
            descBox.innerHTML = `<p>No description found for ${escapeHtml(categoryName)}.</p>`;
        }


        const mRes = await fetch(FILTER_API + encodeURIComponent(categoryName));
        const mJson = await mRes.json();
        const meals = mJson.meals || [];

        if (!meals.length) {
            mealsGrid.innerHTML = '<p>No meals found for this category.</p>';
            return;
        }


        mealsGrid.innerHTML = '';
        meals.forEach(m => {
            mealsGrid.innerHTML += `
                <div class="card" onclick="openMeal('${m.idMeal}')">
                    <img src="${m.strMealThumb}" alt="${escapeHtml(m.strMeal)}">
                    <p style="margin-top:8px; font-weight:600; font-size:13px;">${escapeHtml(m.strMeal)}</p>
                </div>
            `;
        });


        descBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        descBox.innerHTML = '<p>Error loading category data.</p>';
        mealsGrid.innerHTML = '';
        console.error(err);
    }
}




// 4. OPEN CATEGORY PAGE
const openCategory = (name) => {
    window.location.href = `category.html?c=${name}`;
};


// 5. LOAD MEALS BY CATEGORY (category.html)

const loadMealsByCategory = async () => {
    const title = document.getElementById("catTitle");
    const list = document.getElementById("mealList");

    if (!title || !list) return;

    const params = new URLSearchParams(window.location.search);
    const categoryName = params.get("c");

    title.innerText = categoryName;

    const res = await fetch(FILTER_API + categoryName);
    const data = await res.json();
    const meals = data.meals;

    meals.forEach(meal => {
        list.innerHTML += `
            <div class="card" onclick="openMeal('${meal.idMeal}')">
                <img src="${meal.strMealThumb}">
                <p>${meal.strMeal}</p>
            </div>
        `;
    });
};

loadMealsByCategory();

// 6. OPEN MEAL DETAILS PAGE

const openMeal = (id) => {
    window.location.href = `meal.html?id=${id}`;
};



// 7. LOAD MEAL DETAILS (meal.html)

const loadMealDetails = async () => {
    const box = document.getElementById("mealDetails");
    if (!box) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(DETAILS_API + id);
    const data = await res.json();
    const meal = data.meals[0];

    box.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" style="width:300px;border-radius:10px">
        <p><b>Category:</b> ${meal.strCategory}</p>
        <p style="margin-top:15px;"><b>Instructions:</b><br>${meal.strInstructions}</p>
    `;
};

loadMealDetails();

// 8. SEARCH FUNCTION (Homepage)

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
        const text = document.getElementById("searchInput").value.trim();
        const box = document.getElementById("categoryList");

        const res = await fetch(SEARCH_API + text);
        const data = await res.json();

        box.innerHTML = "";

        if (!data.meals) {
            box.innerHTML = "<p>No meals found.</p>";
            return;
        }

        data.meals.forEach(meal => {
            box.innerHTML += `
                <div class="card" onclick="openMeal('${meal.idMeal}')">
                    <img src="${meal.strMealThumb}">
                    <p>${meal.strMeal}</p>
                </div>
            `;
        });
    });
}