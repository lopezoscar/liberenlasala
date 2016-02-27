var APP = function(){
    var _this = this;

    this.hours = {};

    function init(){
        createHours();
    }

    function createItemList(hour){
        var itemHTML =
            '<a href="#" onclick="APP.loadHours()" data-toggle="modal" data-target="#edit" class="list-group-item"> ' +
                '<ul>' +
                    '<li class="hour"></li> ' +
                    '<li class="title"></li>' +
                    '<li class="owner"></li>' +
                '</ul>' +
            '</a>';

        var item = $(itemHTML);

        $(item).find(".hour").text(hour);
        //$(item).find(".title").text("Practica Cancion");
        //$(item).find(".owner").text("Zeta Bosio");

        $(".hours").append(item);

        //TODO crear html para una media hora.
    }

    function createHours(){
        for(var i = 9; i < 23;i++){
            _this.hours[i+":00"] = {reservado:false};
            _this.hours[i+":30"] = {reservado:false};
            createItemList(i+":00");
            createItemList(i+":30");
        }
        //console.log(_this.hours);
    }

    /**
     * Maximo 3 horas, minimo 1. Chequear disponibilidad.
     * La sala abre a las 9 y cierra a las 23
     * @param from
     */


    init();

    return {

        listAvailablesHours: function(){
            var result = [];

            for(var hour in _this.hours){
                if(! _this.hours[hour].reservado){
                    result.push(hour);
                }
            }
            return result;
        },
        loadHours:function(){
            var hours = this.listAvailablesHours();
            $(".from").text("");
            $(".to").text("");
            for(var i = 0; i < hours.length; i++){
                $(".from").append($("<option>",{ value: hours[i],text:hours[i]}));
                //$(".to").append($("<option>",{ value: hours[i],text:hours[i]}));
            }
        },
        buildTo:function (){
            var from = $(".from").val();
            //9:00 o 9:30
            var max = 3;

            var hourParts = from.split(":");
            var hour = Number(hourParts[0]);
            var minutes = Number(hourParts[1]);

            var to = hour + max;

            for(var i = from; i < (from+max); i++){
                var currentHour = hour+1;

                

                if(i == from && minutes > 0){
                    $(".to").append($("<option>",{ value:(currentHour)+":00" ,text:(currentHour)+":00"}));
                }
                else if(i == from && minutes == 0){
                    $(".to").append($("<option>",{ value:(currentHour)+":30" ,text:(currentHour)+":30"}));
                }else {
                    $(".to").append($("<option>",{ value:(currentHour)+":00" ,text:(currentHour)+":00"}));
                    $(".to").append($("<option>",{ value:(currentHour)+":30" ,text:(currentHour)+":30"}));
                }
            }
        }


    };
};

window.APP = new APP();

