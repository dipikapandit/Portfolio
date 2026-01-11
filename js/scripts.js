function hoverEffect(element) {
    element.style.transform = "scale(1.25)";
    element.style.transition = "transform 0.3s ease";
}

function removeHoverEffect(element) {
    element.style.transform = "scale(1)";
}   

document.addEventListener("DOMContentLoaded", function() {
    const logos = document.querySelectorAll('.logo-item');
    logos.forEach(function(logo) {
        logo.addEventListener('mouseover', function() {
            hoverEffect(logo);
        });
        logo.addEventListener('mouseout', function() {
            removeHoverEffect(logo);
        });
    });
});