$('[data-toggle=offcanvas]').click(function () {
    $('#sidebar').toggle();
    // $('.row-offcanvas').toggleClass('active');
    // $('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
});

$(document).ready(function () {
    // show the events layer group
    showEvents();

    // populate parks and rec
    $('#itemlist').html();
    for(var individualParkIndex in park.features){
        // console.warn(park.features[individualParkIndex].properties)
        $('#itemlist').append('<tr><td onClick="selectPK(this)" id="' + park.features[individualParkIndex].properties.Name + '">' + park.features[individualParkIndex].properties.Name + '</td></tr>')
    }

    $('#disclaimerModal').modal('show');
});










