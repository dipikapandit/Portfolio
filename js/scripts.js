// Logo hover effect

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



// Slant items click effect

function handleClick(event) {
    event.style.transform = 'scale(0.9)';
    event.style.transition = 'transform 1s ease';
}
function resetClick(event) {
    event.style.transform = 'scale(1)';
}

const slantItems = document.getElementsByClassName('slant-item');
for (let i = 0; i < slantItems.length; i++) {
    slantItems[i].onclick = function() {
        handleClick(this);
    }
    slantItems[i].ontransitionend = function() {
        resetClick(this);
    }
}