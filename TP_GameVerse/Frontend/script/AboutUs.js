//JS CON JQUERY

$(document).ready(function () {
    const tarjeta = $(".info");

    tarjeta.hover(
        function () {
            // Dentro de esta función, 'this' se refiere al elemento .info-img actual
            $(this).find("h4").css("font-size", "2.1rem");
            $(this).find("h4").css("transition", "all 1s");
        },
        function () {
            // Esta función se llama cuando el mouse sale del elemento .info-img
            $(this).find("h4").css("font-size", "1.9rem");
        }
    );
});