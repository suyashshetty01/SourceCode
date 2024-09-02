var tabButton = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanel = document.querySelectorAll(".tabContainer .tabPanel");
function showPanel(panelIndex) {

    tabPanel.forEach(function (node) {
        node.style.display = "none";
    });
    tabButton.forEach(function (node) {
        node.classList.remove("active");
    });
    tabPanel[panelIndex].style.display = "block";
    tabButton[panelIndex].classList.add("active");
}

$(".section_pane").click(function (e) {
    $(this).parent().find(".insurer").slideToggle(function () {});
})
