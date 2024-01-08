function closeAddPlateForm() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
  }

document.addEventListener('DOMContentLoaded', () => {
    const init = () => {
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const viewAllBtn = document.getElementById('view-all-btn');
        const addNewBtn = document.getElementById('add-new-btn');
        const overlay = document.getElementById('overlay');
        const closesearchresultbtn = document.getElementById('close-search-result-btn');
        const addPlateForm = document.getElementById('add-plate-form');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-icon');
        const searchResult = document.getElementById('search-result');
        const platesMenuContainer = document.getElementById('plates-menu-container');

        let platesMenuVisible = false;

        closesearchresultbtn.addEventListener('click', () => {
            console.log('Close button clicked');
            overlay.style.display = 'none';
        });

        document.getElementById('close-search-result-btn').addEventListener('click', () => {
            const searchResult = document.getElementById('search-result');
            searchResult.style.display = 'none';
        });
        

        document.addEventListener('click', (event) => {
            if (event.target.id === 'search-icon') {
                searchPlates();
            }
        });

        fetch('/check-auth')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    userInfo.textContent = `Welcome, ${data.username}`;
                    logoutBtn.style.display = 'block';
                    viewAllBtn.style.display = 'block';
                    addNewBtn.style.display = 'block';
                } else {
                    document.getElementById('login-btn').style.display = 'block';
                }
            })
            .catch(error => console.error('Error checking authentication:', error));

        logoutBtn.addEventListener('click', async () => {
            const response = await fetch('/logout', { method: 'POST' });

            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                console.error('Error during logout:', response.statusText);
            }
        });

        viewAllBtn.addEventListener('click', async () => {
            try {
                if (platesMenuVisible) {
                    platesMenuContainer.style.display = 'none';
                } else {
                    const response = await fetch('/view-all-plates');
                    const { plates } = await response.json();
                    displayPlatesMenu(plates);
                }

                platesMenuVisible = !platesMenuVisible;
            } catch (error) {
                console.error('Error fetching plates:', error);
            }
        });

        addNewBtn.addEventListener('click', () => {
            overlay.style.display = 'block';
        });

// scriptfront.js

    addPlateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addPlateForm);
        const plateData = {};
        formData.forEach((value, key) => {
            plateData[key] = value;
        });

        const response = await fetch('/add-plate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plateData),
        });

        if (response.ok) {
            overlay.style.display = 'none';
        } else {
            console.error('Error adding plate:', response.statusText);
        }
    });


        async function searchPlates() {
            const searchTerm = searchInput.value.trim();

            if (searchTerm !== '') {
                try {
                    const response = await fetch(`/search-plate?search=${searchTerm}`);
                    const { plate } = await response.json();

                    if (!plate) {
                        console.log('No plate found for the given search term.');
                        // Handle the case where no plate is found

                        // Clear previous search results
                        searchResult.style.display = 'none';
                    } else {
                        console.log('Plate found:', plate);
                        // Display the plate details or handle as needed
                        displaySearchResult(plate);
                    }
                } catch (error) {
                    console.error('Error searching for plates:', error);
                }
            }
        }

        function displaySearchResult(plate) {
            const searchResultMessage = document.getElementById('search-result-message');
            const searchResultDetails = document.getElementById('search-result-details');

            searchResultMessage.textContent = 'Search Result';
            searchResultDetails.innerHTML = `
                <h2>${plate.LicensePlate}</h2>
                <p>Variant: ${plate.Variant}</p>
                <p>Issued Date: ${plate.IssuedDate}</p>
                <p>Recorded Date: ${plate.RecordedDate}</p>
                <p>Passengers: ${plate.Passengers}</p>
                <p>Grade: ${plate.Grade}</p>
            `;

            searchResult.style.display = 'flex';
        }

        function displayPlatesMenu(plates) {
            const platesMenu = document.getElementById('plates-menu');

            platesMenu.innerHTML = '';

            plates.forEach((plate) => {
                const plateItem = document.createElement('li');
                plateItem.textContent = plate.LicensePlate;

                plateItem.addEventListener('click', () => {
                    showPlateDetails(plate);
                });

                platesMenu.appendChild(plateItem);
            });

            platesMenuContainer.style.display = 'block';
        }

        function showPlateDetails(plate) {
            const plateDetailsOverlay = document.getElementById('plate-details-overlay');
            const plateDetailsContainer = document.getElementById('plate-details-container');

            document.getElementById('plate-details-title').textContent = `License Plate: ${plate.LicensePlate}`;
            document.getElementById('plate-details-variant').textContent = `Variant: ${plate.Variant}`;
            document.getElementById('plate-details-issued-date').textContent = `Issued Date: ${plate.IssuedDate}`;
            document.getElementById('plate-details-recorded-date').textContent = `Recorded Date: ${plate.RecordedDate}`;
            document.getElementById('plate-details-passengers').textContent = `Passengers: ${plate.Passengers}`;
            document.getElementById('plate-details-grade').textContent = `Grade: ${plate.Grade}`;

            plateDetailsOverlay.style.display = 'flex';

            document.getElementById('close-details-btn').addEventListener('click', () => {
                plateDetailsOverlay.style.display = 'none';
            });
        }
    };



    init();
});