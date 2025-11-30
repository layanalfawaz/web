/* =======================================================
   GLOBAL PAGE LOAD (Home Page + Services Filters Only)
   ======================================================= */
window.onload = function () {

    /* -------------------------
       1) BACK TO TOP (Home)
       ------------------------- */
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.onscroll = function () {
            if (document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        };

        backToTopBtn.onclick = function () {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };
    }

    /* -------------------------
       2) REAL-TIME CLOCK
       ------------------------- */
    const clock = document.getElementById("clock");

    if (clock) {
        function updateClock() {
            clock.textContent = new Date().toLocaleTimeString();
        }
        setInterval(updateClock, 1000);
        updateClock();
    }

    /* -------------------------
       3) Services Page Filters
       ------------------------- */
    const grid = document.getElementById("servicesGrid");

    if (grid) {
        let nodeList = grid.getElementsByClassName("service-card");
        let cards = Array.from(nodeList);

        shuffle(cards);
        render(cards, grid);

        /* SORT */
        const sortSelect = document.getElementById("sort-services");

        if (sortSelect) {
            sortSelect.onchange = function () {
                const v = sortSelect.value;

                if (v === "price-low-high") {
                    cards.sort((a, b) => a.dataset.price - b.dataset.price);
                } else if (v === "price-high-low") {
                    cards.sort((a, b) => b.dataset.price - a.dataset.price);
                } else if (v === "name-az") {
                    cards.sort((a, b) =>
                        a.dataset.name.localeCompare(b.dataset.name)
                    );
                } else if (v === "name-za") {
                    cards.sort((a, b) =>
                        b.dataset.name.localeCompare(a.dataset.name)
                    );
                }

                render(cards, grid);
            };
        }

        /* SEARCH */
        const searchInput = document.getElementById("service-search");

        if (searchInput) {
            searchInput.onkeyup = function () {
                const text = searchInput.value.toLowerCase();

                cards.forEach(card => {
                    const name = card.dataset.name.toLowerCase();
                    const desc = card.querySelector(".desc").textContent.toLowerCase();

                    if (name.includes(text) || desc.includes(text)) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            };
        }
    }
}; // END window.onload



/* =======================================================
   SHARED FUNCTIONS
   ======================================================= */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function render(cards, grid) {
    grid.innerHTML = "";
    cards.forEach(c => grid.appendChild(c));
}



/* =======================================================
   DOMContentLoaded (Favorites, Dark Theme, Forms)
   ======================================================= */
document.addEventListener("DOMContentLoaded", function () {

    /* -------------------------
       1) DARK MODE
       ------------------------- */
    const toggle = document.getElementById("themeToggle");
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("theme-dark");
        if (toggle) toggle.checked = true;
    }

    if (toggle) {
        toggle.addEventListener("change", () => {
            if (toggle.checked) {
                document.body.classList.add("theme-dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("theme-dark");
                localStorage.setItem("theme", "light");
            }
        });
    }



    /* -------------------------
       2) FAVORITES SYSTEM
       ------------------------- */
    const favButtons = document.querySelectorAll(".fav");

    if (favButtons.length > 0) {

        let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        let favNames = favorites.map(f => f.name);

        favButtons.forEach(btn => {
            let card = btn.closest(".service-card");
            let name = card.dataset.name;

            if (favNames.includes(name)) {
                btn.classList.add("fav-active");
                btn.textContent = "❤️";
            }

            btn.addEventListener("click", function () {

                let price = card.dataset.price;
                let desc = card.querySelector(".desc").textContent;
                let imgSrc = card.querySelector("img").src.split("images/")[1];

                if (favNames.includes(name)) {

                    favorites = favorites.filter(f => f.name !== name);
                    favNames = favNames.filter(n => n !== name);

                    btn.classList.remove("fav-active");
                    btn.textContent = "♡";
                    alert("Removed from favorites");

                } else {

                    favorites.push({ name, price, desc, img: imgSrc });
                    favNames.push(name);

                    btn.classList.add("fav-active");
                    btn.textContent = "❤️";
                    alert("Added to favorites");
                }

                localStorage.setItem("favorites", JSON.stringify(favorites));
            });
        });
    }

    /* LOAD ON CUSTOMER PAGE */
    const favContainer = document.getElementById("favGrid");

    if (favContainer) {
        let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

        favContainer.innerHTML = "";

        favs.forEach(item => {
            let card = document.createElement("div");
            card.className = "favorite-card";

            card.innerHTML = `
                <img src="images/${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p><strong>${item.price}</strong> $</p>
                <p>${item.desc}</p>
            `;

            favContainer.appendChild(card);
        });
    }



    /* -------------------------
       3) REQUEST SERVICE
       ------------------------- */

    const requestForm = document.querySelector(".request-form");

    if (requestForm) {

        const service = document.getElementById("service");
        const name = document.getElementById("name");
        const date = document.getElementById("date");
        const desc = document.getElementById("desc");

        let addedRequests = [];

        requestForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (service.value === "Select Service:") {
                alert("Please select a service.");
                return;
            }

            if (!/^[A-Za-z]+\s[A-Za-z]+$/.test(name.value.trim())) {
                alert("Full name must be first + last.");
                return;
            }

            const today = new Date();
            const selected = new Date(date.value);

            if (isNaN(selected.getTime()) || selected - today < 3 * 86400000) {
                alert("Due date must be at least 3 days from today.");
                return;
            }

            if (desc.value.trim().length < 100) {
                alert("Description must be at least 100 characters.");
                return;
            }

            const goDashboard = !confirm("Request sent!\nOK = Stay\nCancel = Dashboard");

            if (goDashboard) {
                window.location.href = "customer.html";
                return;
            }

            addedRequests.push({
                service: service.value,
                name: name.value,
                date: date.value,
                desc: desc.value.trim(),
            });

            showRequests();
            requestForm.reset();
        });

        function showRequests() {
            let box = document.getElementById("added-requests");

            if (!box) {
                box = document.createElement("div");
                box.id = "added-requests";
                box.innerHTML = "<h3>Added Requests:</h3>";
                document.querySelector(".form-box").appendChild(box);
            }

            box.innerHTML = "<h3>Added Requests:</h3>";

            addedRequests.forEach(req => {
                let c = document.createElement("div");
                c.className = "req-card";

                c.innerHTML = `
                    <p><strong>Service:</strong> ${req.service}</p>
                    <p><strong>Name:</strong> ${req.name}</p>
                    <p><strong>Due Date:</strong> ${req.date}</p>
                    <p><strong>Description:</strong> ${req.desc}</p>
                `;
                box.appendChild(c);
            });
        }
    }



    /* -------------------------
       4) EVALUATE SERVICE
       ------------------------- */
    const evaluateForm = document.querySelector(".evaluate-form");

    if (evaluateForm) {

        const serviceEval = document.getElementById("select-service");
        const feedback = document.getElementById("feedback");

        evaluateForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (serviceEval.value === "Select Service:") {
                alert("Please select a service.");
                return;
            }

            let rating = document.querySelector("input[name='rating']:checked");
            if (!rating) {
                alert("Please choose a rating.");
                return;
            }

            if (feedback.value.trim().length < 5) {
                alert("Please write feedback.");
                return;
            }

            if (Number(rating.value) >= 4) {
                alert("Thank you for your positive review!");
            } else {
                alert("We apologize for the inconvenience.");
            }

            window.location.href = "customer.html";
        });
    }

}); // END DOMContentLoaded

// ========= Join Our Team Form Validation (About Us page) =========
function validateJoinForm() {

    // DOM access
    var first  = document.getElementById("first-name").value;
    var last   = document.getElementById("last-name").value;
    var dob    = document.getElementById("dob").value;
    var email  = document.getElementById("email").value;
    var edu    = document.getElementById("education").value;
    var skills = document.getElementById("skills").value;
    var exp    = document.getElementById("experties").value;
    var photo  = document.getElementById("upload-photo").value;

    //  No empty fields one by one
if (first == "") {
    alert("Please fill the First Name field.");
    return false;
}

if (last == "") {
    alert("Please fill the Last Name field.");
    return false;
}

if (dob == "") {
    alert("Please fill the Date of Birth field.");
    return false;
}

if (email == "") {
    alert("Please fill the Email field.");
    return false;
}

if (edu == "") {
    alert("Please fill the Education field.");
    return false;
}

if (skills == "") {
    alert("Please fill the Skills field.");
    return false;
}

if (exp == "") {
    alert("Please fill the Expertise field.");
    return false;
}

if (photo == "") {
    alert("Please upload a Photo.");
    return false;
}

    // name cannot start with number
    if (/^[0-9]/.test(first) || /^[0-9]/.test(last)) {
        alert("Name fields cannot start with a number.");
        return false;
    }

    //  DOB must be before 2008 
    var year = parseInt(dob.substring(0, 4));
    if (year > 2008) {
        alert("Date of Birth must be before 2008.");
        return false;
    }

    // Photo validation using extension 
    var dot = photo.lastIndexOf(".");
    if (dot == -1) {
        alert("Please upload a valid image.");
        return false;
    }

    var ext = photo.substring(dot + 1).toLowerCase();

    if (!/(jpg|jpeg|png|gif)$/i.test(ext)) {
        alert("Photo must be an image (jpg, jpeg, png, gif).");
        return false;
    }

    // SUCCESS
    alert("Thank you " + first + " " + last + "! Your application has been submitted.");
    return true;
}


/*PROVIDER DASHBOARD - Part 6 */
  
document.addEventListener("DOMContentLoaded", function() {
    const providerDashboard = document.querySelector(".AllServices-container");
    
    if (providerDashboard) {
        loadProviderServices();
    }

    function loadProviderServices() {
        const serviceList = document.querySelector(".service-list");
        if (!serviceList) return;

        const storedServices = JSON.parse(localStorage.getItem("providerServices") || "[]");
        serviceList.innerHTML = "";

        if (storedServices.length === 0) {
            serviceList.innerHTML = '<p style="text-align:center; color:#666; padding:40px;">No services added yet. <a href="addService.html">Add your first service</a></p>';
            return;
        }

        storedServices.forEach(service => {
            const serviceCard = document.createElement("div");
            serviceCard.className = "service-card-Provider";
            
            serviceCard.innerHTML = `
                <img src="${service.imageData}" alt="${service.name}" style="width:100%; height:180px; object-fit:cover; border-radius:10px;">
                <p><strong>Service:</strong> ${service.name}</p>
                <p><strong>Price:</strong> ${service.price}</p>
                <p>${service.description}</p>
            `;
            serviceList.appendChild(serviceCard);
        });
    }
});

/* ADD NEW SERVICE Part 7 */
document.addEventListener("DOMContentLoaded", function() {
    const addServiceForm = document.querySelector(".AddService-container form");
    
    if (addServiceForm) {
        addServiceForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            if (validateAddServiceForm()) {
                // Convert the chosen image to base64
                const photoInput = document.getElementById("upload-photo");
                const file = photoInput.files[0];
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    addServiceToStorage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function validateAddServiceForm() {
        const serviceName = document.getElementById("service-name").value.trim();
        const price = document.getElementById("price").value.trim();
        const description = document.getElementById("description").value.trim();
        const photoInput = document.getElementById("upload-photo");

        if (!serviceName) {
            alert("Service name field is empty.");
            return false;
        }
        if (!price) {
            alert("Price field is empty.");
            return false;
        }
        if (!description || description === "Write here...") {
            alert("Please write a proper description.");
            return false;
        }
        if (!photoInput.files || photoInput.files.length === 0) {
            alert("Please upload a service photo.");
            return false;
        }
        if (/^\d/.test(serviceName)) {
            alert("Service name cannot start with numbers.");
            return false;
        }
        if (!/^\d+(\.\d{1,2})?$/.test(price)) {
            alert("Price must be a valid number.");
            return false;
        }

        return true;
    }

    function addServiceToStorage(imageData) {
        const serviceName = document.getElementById("service-name").value.trim();
        const price = document.getElementById("price").value.trim();
        const description = document.getElementById("description").value.trim();

        const existingServices = JSON.parse(localStorage.getItem("providerServices") || "[]");
        
        const newService = {
            id: Date.now(),
            name: serviceName,
            price: price + " $",
            description: description,
            imageData: imageData // Store the ACTUAL image you chose
        };

        existingServices.push(newService);
        localStorage.setItem("providerServices", JSON.stringify(existingServices));
        
        alert(`Service "${serviceName}" has been added successfully!`);
        addServiceForm.reset();
        
        if (confirm("Go back to Dashboard?")) {
            window.location.href = "Provider.html";
        }
    }

});
	function cancelAddService() {
    if (confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
        window.location.href = "Provider.html";
    }
}


/* MANAGE TEAM MEMBERS Part 8 */
document.addEventListener("DOMContentLoaded", function() {
    console.log(" Page loaded");
    
    const manageTeamPage = document.querySelector(".ManageStaff-container");
    
    if (manageTeamPage) {
        initializeTeamManagement();
    }

    function initializeTeamManagement() {
        console.log("Initializing buttons...");
        
        // Delete 
        const deleteBtn = document.querySelector('input.danger-btn[value="Delete"]');
        console.log("Delete button:", deleteBtn);
        
        if (deleteBtn) {
            deleteBtn.addEventListener("click", function(e) {
                console.log("Delete clicked");
                handleDeleteMembers();
            });
        }

        // Add new member 
        const addButton = document.querySelector('.ManageStaff-seq input[value="Add"]');
        console.log("Add button:", addButton);
        
        if (addButton) {
            addButton.addEventListener("click", function(e) {
                console.log(" Add clicked");
                e.preventDefault();
                handleAddNewMember();
            });
        }

        // Cancel button
        const cancelBtn = document.querySelector('.ManageStaff-seq input[value="cancel"]');
        console.log("Cancel button:", cancelBtn);
        
        if (cancelBtn) {
            cancelBtn.addEventListener("click", function(e) {
                console.log("Cancel clicked");
                e.preventDefault();
                if (confirm("Are you sure you want to cancel?")) {
                    document.querySelector(".ManageStaff-seq form").reset();
                }
            });
        }
    }

    function handleDeleteMembers() {
        console.log("Deleting members...");
        const selectedCheckboxes = document.querySelectorAll('.staff-check:checked');
        console.log("Selected:", selectedCheckboxes.length);
        
        if (selectedCheckboxes.length === 0) {
            alert("Please select at least one offer");
            return;
        }

        if (confirm(`Delete ${selectedCheckboxes.length} member(s)?`)) {
            selectedCheckboxes.forEach(checkbox => {
                const staffCard = checkbox.closest('.staff-card');
                if (staffCard) {
                    staffCard.remove();
                }
            });
            alert("Members deleted successfully.");
        }
    }

    function handleAddNewMember() {
        console.log("Adding new member...");
        
        // Get form values
        const fullName = document.getElementById("full-name");
        const dob = document.getElementById("dob");
        const email = document.getElementById("email");
        const education = document.getElementById("education");
        const expertise = document.getElementById("expertise");
        const skills = document.getElementById("skills");
        const photoInput = document.getElementById("upload-photo");

        // Check if elements exist
        if (!fullName || !dob || !email || !education || !expertise || !skills || !photoInput) {
            alert("Error: Form elements not found");
            return;
        }

        const fullNameValue = fullName.value.trim();
        const dobValue = dob.value;
        const emailValue = email.value.trim();
        const educationValue = education.value.trim();
        const expertiseValue = expertise.value.trim();
        const skillsValue = skills.value.trim();

        console.log("Values:", {fullNameValue, emailValue});

        // VALIDATION 1: Check for empty fields
        if (!fullNameValue) {
            alert("Please fill in Full Name field.");
            return;
        }
        if (!dobValue) {
            alert("Please select Date of Birth.");
            return;
        }
        if (!emailValue) {
            alert("Please fill in Email field.");
            return;
        }
        if (!educationValue) {
            alert("Please fill in Education field.");
            return;
        }
        if (!expertiseValue) {
            alert("Please fill in Area of expertise field.");
            return;
        }
        if (!skillsValue) {
            alert("Please fill in Skills field.");
            return;
        }

       

        // VALIDATION 2: Check photo
        if (!photoInput.files || photoInput.files.length === 0) {
            alert("Please upload a staff photo.");
            return;
        }

        // VALIDATION 3 : Name is letters only 
        if (!/^[A-Za-z\s]+$/.test(fullNameValue)) {
            alert("Full name should contain only letters and spaces.");
            return;
        }


// VALIDATION 4 email some browser 
if (!email.checkValidity()) {
    email.reportValidity();
    return;
}

        console.log(" All validations passed");

        // Handle photo
        let photoUrl = "images/staff1.PNG";
        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            photoUrl = URL.createObjectURL(file);
        }

        // Add to staff list
        const staffList = document.querySelector(".staff-list");
        const newStaffId = Date.now();

        const newStaffCard = document.createElement("label");
        newStaffCard.className = "staff-card";
        newStaffCard.innerHTML = `
            <div class="staff-left">
                <div class="photo-thumb">
                    <img src="${photoUrl}" class="photo-img" alt="${fullNameValue}">
                </div>
                <div class="staff-name">${fullNameValue}</div>
            </div>
            <input type="checkbox" name="staff${newStaffId}" value="${newStaffId}" class="staff-check">
        `;

        staffList.insertBefore(newStaffCard, staffList.firstChild);
        alert(`Team member "${fullNameValue}" added successfully!`);
        document.querySelector(".ManageStaff-seq form").reset();
        
        return true;
    }
});


