const handleCollapsible = function (button) {
    button.classList.toggle("active");
    var content = button.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }

}

function handleShowLogosToggle(e) {
    const showLogosId = "show_logos"
    const showLogosToggle = document.getElementById(showLogosId);
    config1.show_logos = showLogosToggle.checked
    radar_visualization(config1);
}

const handlePickViewpoint = function (viewpointIndex) {
    currentConfiguration = viewpointIndex
    configurations[currentConfiguration]
    refreshRadar();
}