/**
 * Activate a modal dialog to choose a type.
 */

function typeChanged(event) {
    var asked = TYPES_STORE.asked();
    if (!asked) {
        $('#modal-box').modal('hide');
        return false;
    }

    function onclick(type) {
        return function() {
            console.log('Selected type %s for node at (%d, %d)', type, asked.x, asked.y);
            Actions.selectType(asked.x, asked.y, type);
        };
    }

    var names = TYPES_STORE.names();

    var table = $('<table class="table table-bordered" >');
    var tr = $("<tr>");
    for (var i = 0; i < names.length; i++){
        var td = $('<td>');
        var type = TYPES_STORE.type(names[i]);
        var text = '<div class="type"><img src="'+window.staticUrl+'img/'+type.slug+'.jpg"></div>';
        var cost = "<span class='gold'>"+type.cost+"&nbsp;<i class='fa fa-money'></i></span>";
        td.html(text + "<p>"+cost+"</p>");

        // add popover
        td.attr("title",type.name +"&nbsp;<strong>"+cost+"</strong>");
        td.popover({
            toggle:"popover",
            trigger:"hover",
            container:"body",
            content:formatType(type), // function from MapBox
            placement:"bottom",
            html:true
        });
        td.click(onclick(names[i]));

        tr.append(td);
    }
    table.append(tr);

    $("#modal-body").empty().append(table);
    $("#modal-title").text('Which type do you want to use?');

    // can let user choose
    $('#modal-box').modal('show');
}

TYPES_STORE.addListener(typeChanged);