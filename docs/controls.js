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
    const displayStyle = radiosDisplayStyle.filter((radio) => radio.checked)[0].value
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
let currentEntry

const showModal = function (entry) {
    currentEntry = entry
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block"; // make modal visible

    // write dynamic content for entry (aka blip)
    writeBlipPropertiesToModal(entry);
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

function writeTextInElement(elementId, text) {
    const el = document.getElementById(elementId);
    el.innerText = text ? text : "";
}

function writeValueInElement(elementId, value) {
    const el = document.getElementById(elementId);
    el.value = value ? value : "";
}

function getValueInElement(elementId) {
    const el = document.getElementById(elementId);
    return el.value
}
const ambitionMap = { 0: "Nothing yet (Hold)", 1: "Asses/Explore", 2: "(go do) Trial/PoC/Prototype", 3: "Apply (push enthusiastically)", 4: "Deprecate (now new usage)", 5: "RIP/Stop using" }
const currentStatusMap = { 0: "Nothing done yet/Interested", 1: "Exploring/Explored", 2: "Trying/PoC-ed/Prototyped", 3: "(ready for) applying", 4: "Retiring/Stepping away from", 5: "Not interested (now/anmymore)" }
const magnitudeMap = { 0: "0: niche (< 5%)", 1: "1: occasionally, some people", 2: "2: many people, quite often", 3: "3: almost everyone, almost all the time" }
const relevanceMap = { 0: "hard relevant", 1: "limited relevance/maybe some potential, nice to have", 2: "quite relevant, should have", 3: "crucial, must have" }
const marketAdoptionStatusMap = { 0: "innovators, cutting edge", 1: "early adopters", 2: "early majority, arrived in main stream", 3: "late majority", 4: "even laggards, full market adoption" }
const communityRatingMap = { 0: "0: embryonic/dying", 1: "1: starting/limited/dwindling", 2: "2: medium/moderate", 3: "3: high" }
const granularityMap = { 0: "high over, abstract", 1: "large yet concrete", 2: "detail, very specific" }

function writeBlipPropertiesToModal(entry) {
    writeTextInElement("entryTitle", entry.label)
    writeTextInElement("entryVendor", entry.vendor)
    writeTextInElement("entryTags", entry.tags)
    writeTextInElement("entryCategory", entry.category)
    writeTextInElement("entryHomepage", entry.homepage)
    writeTextInElement("entryLastMajorUpdateDate", entry.lastMajorUpdateDate)
    writeTextInElement("entryLastMajorUpdateLabel", entry.lastMajorUpdateLabel)
    writeTextInElement("entryDescription", entry.description)
    writeTextInElement("entryLicenseModel", entry.licenseModel)

    writeTextInElement("entryScope", entry.scope)
    writeTextInElement("entryIntroductionDate", entry.introductionDate)
    writeTextInElement("entryInitialReleaseDate", entry.initialReleaseDate)
    writeTextInElement("entryAmbition", `${entry.ambition}: ${ambitionMap[entry.ambition]}` )
    writeTextInElement("entryCurrentStatus", `${entry.currentStatus}: ${currentStatusMap[entry.currentStatus]}`)
    writeTextInElement("entryRationale", entry.rationale)
    writeTextInElement("entryGrowthShareStatus", entry.growthShareStatus)
    writeTextInElement("entryMagnitude", magnitudeMap[entry.magnitude])
    writeTextInElement("entryRelevance", relevanceMap[entry.relevance])
    writeTextInElement("entryMarketAdoptionStatus", marketAdoptionStatusMap[entry.marketAdoptionStatus])
    writeTextInElement("entryCommunityRating", communityRatingMap[entry.communityRating])
    writeTextInElement("entryGranularity", granularityMap[entry.granularity])


    const homepage = document.getElementById("entryHomepage");
    if (homepage && entry.homepage) {
        homepage.href = entry.homepage;
    }

    const logo = document.getElementById("modal_logo");
    if (entry.logo) {
        logo.src = entry.logo;
        logo.style.display = "block";
    }
    else
        logo.style.display = "none";
}

function writeBlipPropertiesToModalEditor(entry) {
    writeValueInElement("editEntryLogo", entry.logo)
    writeValueInElement("editEntryLabel", entry.label)
    writeValueInElement("editEntryCategory", entry.category)
    writeValueInElement("editEntryCurrentStatus", entry.currentStatus)
    writeValueInElement("editEntryAmbition", entry.ambition)
    writeValueInElement("editEntryMagnitude", entry.magnitude)
    // writeValueInElement("editEntryCategory", entry.category)
    
}

const handleEdit = function () {
    // hide myModal
    const myModal = document.getElementById("myModal");
    myModal.style.display = "none";

    // bring out myModalEditor
    const myModalEditor = document.getElementById("myModalEditor");
    myModalEditor.style.display = "block";

    var span = document.getElementsByClassName("close")[1];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        myModalEditor.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == myModalEditor) {
            myModalEditor.style.display = "none";
        }
    }

    const title = document.getElementById("modalEditorTitle");
    title.innerText= `Edit details for ${currentEntry.label}`
    
    // now populate the controls in the editor with the appropriate values
    writeBlipPropertiesToModalEditor(currentEntry)
    const logo = document.getElementById("edit_modal_logo");
    if (currentEntry.logo) {
        logo.src = currentEntry.logo;
        logo.style.display = "block";
    }
    else
        logo.style.display = "none";

}

const handleSave = function () {
    // show myModal
    const myModal = document.getElementById("myModal");
    myModal.style.display = "block";

    // hide myModalEditor
    const myModalEditor = document.getElementById("myModalEditor");
    myModalEditor.style.display = "none";
    // read details from input fields in myModalEditor and transfer to current entry
    currentEntry.label =  getValueInElement("editEntryLabel")
    currentEntry.logo =  getValueInElement("editEntryLogo")
    currentEntry.category =  getValueInElement("editEntryCategory")
    currentEntry.currentStatus =  getValueInElement("editEntryCurrentStatus")
    currentEntry.ambition =  getValueInElement("editEntryAmbition")
    currentEntry.magnitude =  getValueInElement("editEntryMagnitude")
    
    writeBlipPropertiesToModal(currentEntry)
    refreshRadar()
}

const handleCancelEdit = function () {
    // hide myModalEditor
    const myModalEditor = document.getElementById("myModalEditor");
    myModalEditor.style.display = "none";
    // show myModal
    const myModal = document.getElementById("myModal");
    myModal.style.display = "block";
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

// inspiration at https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
const initializeFileUpload = function () {
    const fileSelect = document.getElementById("fileSelect"),
        fileElem = document.getElementById("fileElem");

    fileSelect.addEventListener("click", function (e) {
        if (fileElem) {
            fileElem.click();
        }
    }, false);

    fileElem.addEventListener("change", handleFiles, false);
}

async function handleFiles() {
    if (!this.files.length) {
        fileList.innerHTML = "<p>No files selected!</p>";
    } else {
        // check if uploaded entries are to be merged or should overwrite/replace
        const fileMergeCheck = document.getElementById("fileMerge")
        console.log(`file merge check ${fileMergeCheck.checked}`)
        if (!fileMergeCheck.checked && this.files.length > 0) {
            // overwrite
            radarEntries = []
        }

        fileList.innerHTML = "";
        const list = document.createElement("ul");
        fileList.appendChild(list);
        for (let i = 0; i < this.files.length; i++) {
            const li = document.createElement("li");
            list.appendChild(li);

            const info = document.createElement("span");
            info.innerHTML = this.files[i].name + ": " + this.files[i].size + " bytes";
            li.appendChild(info);
            const contents = await this.files[i].text()
            // the contents of the file should be a JSON array that can be evaluated into a collection of radar entries
            const newEntries = JSON.parse(contents)
            // naively concat the existing entries with these new ones
            // TODO: duplicate elements in resulting array should be resolved; the newest entry "wins"
            radarEntries = radarEntries.concat(newEntries)

        }
        refreshRadar()
    }
}


// source: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const downloadEntriesCurrentViewpointFilter = function () {
    download(`techradar-${getCurrentConfiguration().label}-entries.json`, JSON.stringify(getCurrentConfiguration().getEntries()))
}


const initializeControls = function (config) {

    initializeFileUpload()

    initializeTagsFilter(config);

    initializeViewpointSelection();
}

function initializeViewpointSelection() {
    const getHandlePickViewpoint = function (index) {
        const viewPointIndex = index;
        return () => { handlePickViewpoint(viewPointIndex); };
    };

    // viewPoint selection
    var viewpointSelectionContainer = document.getElementById("viewpoint-selection");
    removeAllChildNodes(viewpointSelectionContainer);

    //<a href="#" onclick="handlePickViewpoint(0)">Traditional</a>
    configurations.forEach((config, index) => {
        const link = document.createElement("a");
        link.innerText = config.label;
        link.addEventListener("click", getHandlePickViewpoint(index));
        viewpointSelectionContainer.appendChild(link);
    }
    );
}

function initializeTagsFilter(config) {
    var btnContainer = document.getElementById("myBtnContainer");
    createFiltersForTags(btnContainer, config.getEntries());
    var btns = btnContainer.getElementsByClassName("btn");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", toggleActive
        );
    }
}
