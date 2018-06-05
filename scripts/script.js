// This is a Javascript document, using the jQuery library to make it easier to select elements in HTML (in the "DOM").

// The example here gets the current width of the browser window, and puts into an element we've made in the HTML, and styled with the CSS. This is a useful trick to help you design responsive websites - you can see the width value where your layour breaks, and use that as the breakpoint for a media query.

$(document).ready(function() {
    // The above line checks whether or not the webpage has finished loading. When it has, it will do whatever is inside the curly braces.

    var windowsize = 0;
    // Here we set a variable as nothing, so that we can refer to it, and change the value, at a later point. It is global - outside of a function - so we can use it anywhere else in this script.
    
    function checkWidth() {
        // This is a function, a discrete block of code that we can write once and then reuse as many times as we like.

        windowsize = $(window).width();
        // This gets the "windowsize" variable, and changes to be the value of the Window's width, found with a jQuery command.

        $(".mobile-notifier").text(windowsize);
        // This uses a jQuery/CSS selector to find the "mobile-notifier" class (note the "." before it - the same as selected a class in CSS), and replaces the text of that element with the value of the "windowsize" variable.
    }

    checkWidth();
    // With the complete function, we can now "call it", which runs that above block of code - this will happen once the page is loaded (because of the ready() check at the top), and makes sure we get the intial width of the window at that time.

    $(window).resize(checkWidth);
    // To get the value to change we check if the window is resized - if it is, the "checkWidth()" function is run again. This means the windowsize variable is always up to date with the current real size of the window.

});
