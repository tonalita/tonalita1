// Parse the menu data from the hidden script tag
const menuDataScript = document.getElementById('menu-data').textContent;
const menuData = JSON.parse(menuDataScript);

const mainCategoriesContainer = document.getElementById('main-categories');
const menuOverlay = document.getElementById('menu-overlay');
const menuItemsDisplay = document.getElementById('menu-items-display');
const currentCategoryTitle = document.getElementById('current-category-title');
const menuList = document.getElementById('menu-list');
const backToMainButton = document.getElementById('back-to-main');
const homePage = document.getElementById('home-page');

// --- Main Functions ---

/**
 * Displays the main category selection menu.
 */
function showMenuOverlay() {
    // Hide home screen and menu items
    homePage.style.display = 'none';
    menuItemsDisplay.style.display = 'none';

    // Show the overlay
    menuOverlay.style.display = 'block';

    // Show the main categories and hide the back button
    showMainCategories(); 
}

/**
 * Hides the menu overlay.
 */
function closeOverlay() {
    menuOverlay.style.display = 'none';
    homePage.style.display = 'flex'; // Go back to home
    menuItemsDisplay.style.display = 'none';
}

/**
 * Hides the menu items and goes back to the category selection.
 */
function closeItemsDisplay() {
    menuItemsDisplay.style.display = 'none';
    menuOverlay.style.display = 'block';
    // When closing items, always show the current set of categories (main or sub)
}


// --- Category Logic ---

/**
 * Generates and displays the top-level category buttons (Brunch, Desserts, Drinks).
 */
function showMainCategories() {
    mainCategoriesContainer.innerHTML = '';
    backToMainButton.style.display = 'none';

    // Loop through the top-level keys in menuData
    Object.keys(menuData).forEach(categoryName => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.textContent = categoryName;

        // Attach the handler function
        button.onclick = () => handleCategoryClick(categoryName, menuData[categoryName]);
        
        mainCategoriesContainer.appendChild(button);
    });
}

/**
 * Handles a click on a category button.
 * If the category has sub-categories (like Drinks), it shows the sub-category buttons.
 * If it has menu items directly (like Brunch), it shows the menu items list.
 * @param {string} categoryName - The name of the category clicked.
 * @param {object} categoryContent - The content (sub-categories or items) for the category.
 */
function handleCategoryClick(categoryName, categoryContent) {
    // Check if the content is a list of sub-categories or an array of menu items
    const subCategories = Object.keys(categoryContent);
    const hasSubCategories = subCategories.every(key => Array.isArray(categoryContent[key]) || typeof categoryContent[key] === 'object');
    
    if (hasSubCategories) {
        // It has sub-categories (e.g., Drinks -> Hot Drinks, Cold Drinks)
        showSubCategories(categoryContent);
    } else {
        // It has menu items directly (e.g., Desserts -> Desserts (The Lou'a items))
        displayMenuItems(categoryName, categoryContent);
    }
}

/**
 * Displays buttons for sub-categories (e.g., Hot Drinks, Cold Drinks).
 * @param {object} subCategoryContent - The object containing sub-category groups.
 */
function showSubCategories(subCategoryContent) {
    mainCategoriesContainer.innerHTML = ''; // Clear main categories
    backToMainButton.style.display = 'block';

    Object.keys(subCategoryContent).forEach(groupName => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.textContent = groupName;

        // Check if the group has another level of sub-categories (like Drinks -> Hot Drinks -> Tea, Coffee)
        const content = subCategoryContent[groupName];
        if (typeof content === 'object' && !Array.isArray(content) && Object.keys(content).length > 0) {
            // It's another level of grouping (e.g., Tea/Coffee under Hot Drinks)
            button.onclick = () => showSubCategories(content);
        } else {
            // It's a list of menu items (e.g., Brunch)
            button.onclick = () => displayMenuItems(groupName, subCategoryContent);
        }

        mainCategoriesContainer.appendChild(button);
    });
}


// --- Item Display Logic ---

/**
 * Displays the list of menu items for the final selected category.
 * @param {string} categoryName - The name of the final category (e.g., 'Tea', 'Burgers').
 * @param {object} menuGroup - The object that contains the list of menu items under the categoryName key.
 */
function displayMenuItems(categoryName, menuGroup) {
    const items = menuGroup[categoryName];

    // Hide the category overlay and show the menu items section
    menuOverlay.style.display = 'none';
    menuItemsDisplay.style.display = 'block';
    currentCategoryTitle.textContent = categoryName.toUpperCase();
    menuList.innerHTML = '';

    if (!items || items.length === 0) {
        menuList.innerHTML = '<p>No items found in this category.</p>';
        return;
    }

    // Generate HTML for each item
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('item-header');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('item-name');
        nameSpan.textContent = item.name;

        const priceSpan = document.createElement('span');
        priceSpan.classList.add('item-price');
        priceSpan.textContent = item.price;

        headerDiv.appendChild(nameSpan);
        headerDiv.appendChild(priceSpan);
        itemDiv.appendChild(headerDiv);

        if (item.description) {
            const descriptionP = document.createElement('p');
            descriptionP.classList.add('item-description');
            descriptionP.textContent = item.description;
            itemDiv.appendChild(descriptionP);
        }

        menuList.appendChild(itemDiv);
    });

    // Scroll to top of the menu items display
    menuItemsDisplay.scrollIntoView({ behavior: 'smooth' });
}


// --- Initialization ---

document.getElementById('show-menu-button').onclick = showMenuOverlay;

// On load, initialize the main categories
document.addEventListener('DOMContentLoaded', showMainCategories);
