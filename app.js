var APP = function(){
    var _this = this;

    //Contiene todas las horas.
    this.hours = {};

    /**
     * Función que solo se ejecuta cuando se instancia la APP.
     */
    function init(){
        createHours();
        hide("cancelBtn");
    }

    /**
     * Oculta un botón
     * @param btn
     */
    function hide(btn){
        $("#"+btn).hide();
    }

    /**
     * Muestra un botón
     * @param btn
     */
    function show(btn){
        $("#"+btn).show();
    }

    /**
     * Recibe una hora para crear cada item en el html.
     *
     * Cada item de la lista tiene asociado una hora un titulo y un dueño.
     *
     * El html posee data attributes para usar en cada acción como reservar o cancelar reserva.
     * @param hour
     */
    function createItemList(hour){
        var itemHTML =
            '<a href="#" onclick="APP.loadHours(this)" data-toggle="modal" data-target="#edit" class="list-group-item"> ' +
                '<ul>' +
                    '<li class="hour"></li> ' +
                    '<li class="title"></li>' +
                    '<li class="owner"></li>' +
                '</ul>' +
            '</a>';

        var item = $(itemHTML);
        item.attr("data-hour-number",hour.split(":")[0]);
        item.attr("data-min-number",hour.split(":")[1]);
        item.attr("data-fullhour",hour);


        //Se busca la clase hour dentro del tag a.
        $(item).find(".hour").text(hour);

        //Se agrega el item a la lista de horas.
        $(".hours").append(item);

    }

    /**
     * Crea una lista de 23 horas con 00 y 30 minutos.
     *
     * A la vez que se crea la hora en el objeto hours tambien se crea en la vista (html).
     */
    function createHours(){
        for(var i = 9; i < 23;i++){
            _this.hours[i+":00"] = {reservado:false};
            _this.hours[i+":30"] = {reservado:false};
            createItemList(i+":00");
            createItemList(i+":30");
        }
    }

    /**
     * Maximo 3 horas, minimo 1. Chequear disponibilidad.
     * La sala abre a las 9 y cierra a las 23
     * @param from
     */

    //Primer Función en ejecutarse.
    init();

    //Closure
    return {

        /**
         * Lista de horas disponibles. Recorre todas las horas, si está disponible
         * se agrega a un array de horas.
         * @returns {Array}
         */
        listAvailablesHours: function(){
            var result = [];

            for(var hour in _this.hours){
                if(! _this.hours[hour].reservado){
                    result.push(hour);
                }
            }
            return result;
        },
        /**
         * loadHours calcular se ejecuta en el onclick de cada item de la lista.
         * Si el item está activo es porque quiero cancelar la reserva sino
         * es para crear una nueva reserva.
         *
         *
         *
         * @param currentSelect select del html que posee la hora seleccionada.
         */
        loadHours:function(currentSelect){
            //Me guardo la hora seleccionada utilizado los atributos data
            var selectedHour = $(currentSelect).data().fullhour;

            if($(currentSelect).hasClass("active")){

                $(".desc").val(_this.hours[selectedHour].desc);
                $(".name").val(_this.hours[selectedHour].name);

                hide("saveBtn");
                show("cancelBtn");

            }else{

                $(".from").text("");
                $(".to").text("");

                $(".desc").val("");
                $(".name").val("");

                show("saveBtn");
                hide("cancelBtn");
            }

            //Cargo las horas disponibles
            var hours = this.listAvailablesHours();

            //Creo un option del select para cada hora disponible.
            for(var i = 0; i < hours.length; i++){
                $(".from").append($("<option>",{ value: hours[i],text:hours[i]}));
                //$(".to").append($("<option>",{ value: hours[i],text:hours[i]}));
            }


            //Si la hora seleccionada está dentro de las horas disponibles
            //la seteo en el .from para que se calcule a partir de esa hora.
            if(hours.indexOf(selectedHour) > -1){
                $(".from").val(selectedHour);
            }

            //Ejecuta buildTo para calcular el select Hasta.
            this.buildTo();
        },

        /**
         * Crea un item(option) por cada media hora disponible.
         *
         */
        buildTo:function(){
            //9:00 o 9:30
            $(".to").text("");//reset select
            var from = $(".from").val();//Se toma el valor del from
            var max = 3;//Maximo de horas.

            var hourParts = from.split(":");//Divido la hora con el :

            var hour = Number(hourParts[0]);
            var minutes = hourParts[1];

            var currentHour = hour;

            //6 iteraciones
            /**
             * El for ejecuta 6 iteraciones.
             * Hay 3 horas con 2 media hora cada hora.
             *
             * El for corta si una de las media hora siguientes está reservada.
             */
            for(var i = 0; i < (max * 2) -1 && !_this.hours[currentHour+":00"].reservado && !_this.hours[currentHour+":30"].reservado  ; i++){

                //Si da 0 es par.
                //Se aumenta una hora cada 2 media hora por eso
                if(i % 2 == 0){
                    currentHour++;//Aumento una hora cada 2 media hora.
                }

                //If ternario. si los minutos es igual a 0 entonces minText = "00" sino "30"
                var minText = minutes == 0 ? "00" : "30";
                $(".to").append($("<option>",{ value:currentHour+":"+minText ,text:currentHour+":"+minText}));


                //Este if sirve para ir alternando entre el 0 y el 30
                if(minutes > 0){
                    minutes = 0;
                }else{
                    minutes = 30;
                }
            }
        },
        /**
         * Cancela una Reserva
         */
        cancel:function(){
            this.save("cancel");
        },
        /**
         * Save guarda/actualiza los valores de una key en el objeto horas
         * y también refleja esa acción en el HTML.
         *
         * Si cancelo una reserva, se saca el active, se borra el titulo y nombre.
         * Si creo una reserva, se agrega el titulo, el nombre y la hora como reservada.
         *
         * También se oculta el modal al final.
         *
         * @param action puede ser cancel o undefined.
         */
        save:function(action){

            //Guardo from y to
            var from = $(".from").val();
            var to = $(".to").val();

            //Guardo name y desc
            var name = $(".name").val();
            var desc = $(".desc").val();


            //Guardo la hora y también la parto.
            var hourFrom = from.split(":")[0];
            hourFrom = Number(hourFrom);
            var minutesFrom = from.split(":")[1];

            var hourTo = to.split(":")[0];
            hourTo = Number(hourTo);
            var minutesTo = Number(to.split(":")[1]);

            //Coloco el i afuera del for para que quede explicito
            //de que se va a utilizar fuera del for.
            var i;
            //El intervalo del for es de la hora inicial hasta la hora final
            for(i = hourFrom; i < hourTo; i++){

                //Si la acción es cancel
                if(action == "cancel"){

                    //se remueve la clase active
                    $('a[ data-hour-number="'+i+'" ]').removeClass("active");
                    //Se limpia el texto del owner y title
                    $('a[ data-hour-number="'+i+'" ] .title').text("");
                    $('a[ data-hour-number="'+i+'" ] .owner').text("");

                    //Se vuelve a poner reservar: false
                    _this.hours[i+":00"] = {reservado:false };
                    _this.hours[i+":30"] = {reservado:false };

                }else{
                    //reservar

                    //Se agrega la clase active
                    $('a[ data-hour-number="'+i+'" ]').addClass("active");

                    //Se setean title y owner.
                    $('a[ data-hour-number="'+i+'" ] .title').text(desc);
                    $('a[ data-hour-number="'+i+'" ] .owner').text(name);

                    //Se reservan las horas y se guardan los datos cargados
                    _this.hours[i+":00"] = {reservado:true, name:name, desc:desc, to:to};
                    _this.hours[i+":30"] = {reservado:true, name:name, desc:desc, to:to};
                }

            }

            //si los minutos del hasta son mayores a 0 es porque es 30
            //a esa media hora de la siguiente hora hay que agregarle el active y colocarla como reservada.
            if(minutesTo > 0){

                if(action == "cancel"){
                    //save
                    $('a[ data-fullhour="'+i+':00" ]').removeClass("active");
                    $('a[ data-fullhour="'+i+':00" ] .title').text("");
                    $('a[ data-fullhour="'+i+':00" ] .owner').text("");
                    _this.hours[i+":00"] = {reservado:false};
                }else{
                    //Uso el último i (ultimo indice del for)
                    $('a[ data-fullhour="'+i+':00" ]').addClass("active");
                    $('a[ data-fullhour="'+i+':00" ] .title').text(desc);
                    $('a[ data-fullhour="'+i+':00" ] .owner').text(name);
                    _this.hours[i+":00"] = {reservado:true, name:name, desc:desc, to:to};
                }
            }

            //Oculto el modal
            $('#edit').modal('hide');

        }
    };
};

//Instancio la APP y la asigno al window para que pertenezca al contexto global.
window.APP = new APP();

