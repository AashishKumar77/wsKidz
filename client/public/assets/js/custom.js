$(document).ready(function () {

    $(".more-menu").on("click", function () {
        $(".section-tab .nav").toggleClass("open");
    });
    // upload audio file
    // $('.inputAudio').click(function () {
    //     $('.audioInput').show();
    //     $('.audioInput').change(function () {
    //         var filename = $('.audioInput').val();
    //         let removePath = filename.split("\\").pop()
    //         $('#fileLabel').html(removePath);
    //     });
    // });
});