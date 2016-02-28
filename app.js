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
            this.buildTo();
        },
        buildTo:function(){
            //9:00 o 9:30
            $(".to").text("");//reset select
            var from = $(".from").val();
            var max = 3;

            var hourParts = from.split(":");

            var hour = Number(hourParts[0]);
            var minutes = hourParts[1];

            var currentHour = hour;

            //6 iteraciones
            for(var i = 0; i < (max * 2) -1; i++){

                //Si da 0 es par.
                if(i % 2 == 0){
                    currentHour++;//Aumento una hora cada 2 media hora.
                }

                var minText = minutes == 0 ? "00" : "30";
                $(".to").append($("<option>",{ value:currentHour+":"+minText ,text:currentHour+":"+minText}));

                if(minutes > 0){
                    minutes = 0;
                }else{
                    minutes = 30;
                }
            }
        },
        save:function(){
            var from = $(".from").val();
            var to = $(".to").val();

            var name = $(".name").val();
            var desc = $(".desc").val();

            var hourFrom = from.split(":")[0];
            hourFrom = Number(hourFrom);
            var minutesFrom = from.split(":")[1];

            var hourTo = to.split(":")[0];
            hourTo = Number(hourTo);
            var minutesTo = to.split(":")[1];

            for(var i = hourFrom; i < hourTo; i++){
                console.log("i",i);
            }

        }
    };
};

window.APP = new APP();

