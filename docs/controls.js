const handleCollapsible = function (button) {
    button.classList.toggle("active");
    var content = button.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
        initializeControls(getCurrentConfiguration())
    }
}

const handleBlipDisplayStyleChange = function () {
    
    const radiosDisplayStyle = Array.from(document.getElementsByName("blip-displaystyle-optradio"))
    // find out which radio is checked
    const displayStyle = radiosDisplayStyle.filter( (radio) => radio.checked)[0].value
    getCurrentConfiguration().blip_displayStyle = displayStyle
    refreshRadar()
}



const handleAllTagsToggle = function (e) {
    const allTagsId = "all_tags" // identifier of input element
    const allTagsToggle = document.getElementById(allTagsId);
    getCurrentConfiguration().all_tags = allTagsToggle.checked
    refreshRadar()
}

const handlePickViewpoint = function (viewpointIndex) {
    currentConfiguration = viewpointIndex
    refreshRadar();
}

const showModal = function (entry) {
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block"; // make modal visible

    // write dynamic content for entry (aka blip)
    writeBlipToModal(entry);
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function writeBlipToModal(entry) {
    const label = document.getElementById("modal_label");
    label.innerText = entry.label;
    const logo = document.getElementById("modal_logo");
    if (entry.logo) {
        logo.src = entry.logo;
        logo.style.display = "block";
    }
    else
        logo.style.display = "none";
}

/********************   Labels Filter */


const toggleActive = function () {
    // toggle active class on or off for clicked element
    if (this.className.indexOf(" active") > -1)
        this.className = this.className.replace(" active", "");
    else
        this.className += " active";
    refreshRadar()
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const getSelectedTags = function () {
    const tagBtnContainer = document.getElementById("myBtnContainer");
    const activeTagBtns = tagBtnContainer.getElementsByClassName("active");
    if (activeTagBtns)
        return Array.from(activeTagBtns).map((btn) => btn.innerText)
    else
        return ['all']
}

const createFiltersForTags = function (container, entries) {
    // remove all existing children
    removeAllChildNodes(container)
    // then create children for all different tags in all entries in the current configuration
    // get all unique tags from all entries - create elements for each of these
    // entries is an array, each entry has a tags array
    const uniqueTags = new Set(entries.reduce(
        (accumulator, currentValue) => {
            if (currentValue.tags)
                return accumulator.concat(currentValue.tags)
            else
                return accumulator
        }
        , []).sort()
    )
    uniqueTags.forEach((tag) => {
        const btn = document.createElement("button")
        btn.innerText = " " + tag
        btn.className = "btn"
        container.appendChild(btn);
    })
}

const initializeControls = function (config) {
    var btnContainer = document.getElementById("myBtnContainer");
    createFiltersForTags(btnContainer, config.getEntries())
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", toggleActive
        );
    }

    const getHandlePickViewpoint = function (index) {
        const viewPointIndex = index
        return () => { handlePickViewpoint(viewPointIndex) }
    }

    // viewPoint selection
    var viewpointSelectionContainer = document.getElementById("viewpoint-selection");
    //<a href="#" onclick="handlePickViewpoint(0)">Traditional</a>
    configurations.forEach((config, index) => {
        const link = document.createElement("a")
        link.innerText = config.label
        link.addEventListener("click", getHandlePickViewpoint(index))
        viewpointSelectionContainer.appendChild(link);
    }
    )
}