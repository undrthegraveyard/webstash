let myLeads = []
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))
const tabBtn = document.getElementById("tab-btn")
const tagsEl = document.getElementById("tags-el")
const titleEl = document.getElementById("title-el")
const descriptionEl = document.getElementById("description-el")
const charCount = document.getElementById("charCount")
const exportBtn = document.getElementById("export-btn")

// Set the maximum character limit for description
const maxchatCount = 100

// Initialize the character count to 100
charCount.innerText = maxchatCount

// Checking if leads are present in local storage
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

// Adding event listener to the export button
exportBtn.addEventListener("click", function() {
    // Add relevant headings as the first row
    const csvHeaders = ["Title", "URL", "Tags", "Description"];
    
    // Prepare the data to be exported in CSV format
    const csvData = [
        csvHeaders, // Adding the headings at the top
        ...myLeads.map(lead => [
            lead.title,
            lead.url,
            lead.tags,
            lead.description
        ])
    ].map(row => row.join(",")).join("\n");

    // Create a Blob for the CSV file
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'webstash.csv'; // Setting the download filename to webstash.csv
    link.click();
});

tabBtn.addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // Checking for the title input
        if (titleEl.value.trim() === "") {
            alert("Please enter the title!")
            return
        } 

        // Tag input validation
        const tagArray = tagsEl.value.split(" ").filter(tag => tag !== "")
        if (tagArray.length > 3) {
            alert("You can only add 3 tags!")
            return
        }

        // Checking for the description input
        if (descriptionEl.value.trim() === "") {
            alert("Please enter the description!")
            return
        } else if (descriptionEl.value.length > 100) {
            alert("Description can only be 100 characters long!")
            return
        }

        // Lead object creation
        const leads = {
            title: titleEl.value,
            url: tabs[0].url,
            tags: tagsEl.value,
            description: descriptionEl.value
        }

        // Pushing lead object to myLeads array
        myLeads.push(leads)

        // Storing the leads in local storage
        localStorage.setItem("myLeads", JSON.stringify(myLeads))

        // Rendering the leads
        render(myLeads)

        // Clearing the input fields
        tagsEl.value = ""
        titleEl.value = ""
        descriptionEl.value = ""
    })
})

// Add event listener to the description input field
descriptionEl.addEventListener("input", function() {
    // Get the remaining characters
    const remainingChar = maxchatCount - descriptionEl.value.length
    // Update the character count
    charCount.innerText = remainingChar

    // Adding colors if the limit is about to exceed
    if (remainingChar < 30 && remainingChar > 10) {
        charCount.style.color = "orange"
    } else if (remainingChar <= 10) {
        charCount.style.color = "red"
    } else if (remainingChar > 30) {
        charCount.style.color = "#5f9341"
    }

    // Prevent typing if the remaining characters are 0
    if (remainingChar <= 0) {
        descriptionEl.value = descriptionEl.value.slice(0, -1)
    }
})

// Handle paste events for description input field
descriptionEl.addEventListener("paste", function(event) {
    const paste = (event.clipboardData || window.clipboardData).getData('text')
    const remainingChar = maxchatCount - descriptionEl.value.length
    if (paste.length > remainingChar) {
        event.preventDefault()
        descriptionEl.value += paste.slice(0, remainingChar)
        charCount.innerText = 0
        charCount.style.color = "red"
    }
})

// Render function to display the leads
function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i].url}'>
                    ${leads[i].title}</a>
                <span> ${leads[i].tags}</span>
                <p> ${leads[i].description}</p>
            </li>
            <div class="line"></div>
        `
    }
    ulEl.innerHTML = listItems
}

// Delete button to delete the leads
deleteBtn.addEventListener("dblclick", function() {
    localStorage.removeItem("myLeads")
    myLeads = []
    render(myLeads)
})