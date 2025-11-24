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



// 5. LOAD MEALS BY CATEGORY (category.html)

// REPLACE existing loadMealsByCategory with this version
const loadMealsByCategory = async () => {
    const title = document.getElementById("catTitle");
    const descBox = document.getElementById("catDesc");   // your category.html uses id="catDesc"
    const list = document.getElementById("mealList");

    // if any of these are missing, we are not on category page — bail out
    if (!title || !descBox || !list) return;

    const params = new URLSearchParams(window.location.search);
    const categoryName = params.get("c");

    if (!categoryName) {
        title.innerText = "Category";
        descBox.style.display = "block";
        descBox.innerHTML = "<p>No category selected.</p>";
        list.innerHTML = "";
        return;
    }

    // set title and show loading states
    title.innerText = categoryName;
    descBox.style.display = "block";
    descBox.innerHTML = "<p>Loading description…</p>";
    list.innerHTML = "<p>Loading meals…</p>";

    try {
        // 1) Fetch category descriptions (one API returns all categories with descriptions)
        const catRes = await fetch(CATEGORIES_API);
        const catJson = await catRes.json();
        const categoryObj = (catJson.categories || []).find(c => c.strCategory === categoryName);

        if (categoryObj) {
            const shortDesc = (categoryObj.strCategoryDescription || '').slice(0, 900);
            descBox.innerHTML = `
                <h3 style="color:#e86528; margin:0 0 8px;">${escapeHtml(categoryName)}</h3>
                <p style="margin:0;color:#333;line-height:1.6;">${escapeHtml(shortDesc)}</p>
            `;
        } else {
            descBox.innerHTML = `<p>No description found for ${escapeHtml(categoryName)}.</p>`;
        }

        // 2) Fetch meals for this category
        const res = await fetch(FILTER_API + encodeURIComponent(categoryName));
        const data = await res.json();
        const meals = data.meals || [];

        // clear list and add heading + grid container
        list.innerHTML = ''; // clear previous

        if (!meals.length) {
            // show a small message if no meals
            list.innerHTML = '<p>No meals found for this category.</p>';
            return;
        }

        // Optional: insert a "MEALS" heading above the grid (if your HTML doesn't already include one)
        // If you added the heading in HTML (see step 2) you can remove the next line.
        // list.insertAdjacentHTML('beforebegin', '<h3 class="meals-heading">MEALS</h3>');

        // render meal cards (clear then populate)
        meals.forEach(meal => {
            list.innerHTML += `
                <div class="card" onclick="openMeal('${encodeURIComponent(meal.idMeal)}')">
                    <img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}">
                    <p>${escapeHtml(meal.strMeal)}</p>
                </div>
            `;
        });

        // scroll the description into view (so user sees title + description)
        descBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        console.error(err);
        descBox.innerHTML = '<p>Error loading category data.</p>';
        list.innerHTML = '';
    }
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

!!document.querySelector('.cat-badge')