
$.fn.extend({
  disableSelection : function() {
    this.each(function() {
      this.onselectstart = function() {
        return false;
      };
      this.unselectable = "on";
      $(this).css('-moz-user-select', 'none');
      $(this).css('-webkit-user-select', 'none');
    });
  }
});

$(function() {

    $(this).disableSelection();

    var Mdata;
    var TMdata;


    $.get('menu.json',function(data){
        var html = '';
        html+="<a data-class=\"all\">全部</a>"
        html+="<a data-class=\"love\">我的最愛</a>"
        for(var i=0;i<data.length;i++){
            html+="<a data-class="+data[i].Id+">"+data[i].menuName+"</a>";
        }
        $('.menu_bar').append(html);

    }).done(function(data){

        Mdata = data;

        $.get('two_menu.json',function(data){

            var html = "";
            html += "<a  class=\"active\" data-pid="+data[0].Pid+"  data-id=\"all\">全部</a>"
            for(var i=0;i<data.length;i++){
                html+="<a  data-pid="+data[i].Pid+" data-id="+data[i].Id+">"+data[i].name+"</a>";
            }

            $('.commodity').html(html);

        }).done(function(data){

            TMdata = data;

            tony(Mdata,TMdata);
        });

    });

});


function tony(data,Tdata){

    var mData = data;
    var tMdata = Tdata;
    var itemData ="";
    var allData = [];
    var loveData = [];
    var newData = {};

    for(var i=0;i<mData.length;i++){
        newData[mData[i].Id]={"menuName":mData[i].menuName,"content":[],"subContent":[]};
        newData[mData[i].Id]["subContent"]["all"] = {"name": "全部","content":[]}
    }

    for(var i=0;i<tMdata.length;i++){
        newData[tMdata[i].Pid]["subContent"][tMdata[i].Id] = {"name": tMdata[i].name,"content":[]};
    }




    $.get('item.json',function(data){
        data.map(function(item){
           newData[item.Class]["content"].push(item);

           if(item.towse !== ""){
                newData[item.Class]["subContent"][item.towse]['content'].push(item);
                newData[item.Class]["subContent"]["all"]['content'].push(item);
           }
        });

        console.log(newData);

        allData = data;

       loveData = data.filter(function(item){
            return item.myLove.indexOf('true') > -1
        });

       console.log(loveData);

      menukey();
    });




    function setMenuBar() {
        var ml = $('.menu_bar a').length;
        $('.menu_bar').css('width', $('.menu_bar a').outerWidth(true) * ml);
    }

    setMenuBar();

    function menukey(){
        $('.menu_bar a').click(function() {
            switchkey($(this).data('class'));
            $(this).addClass('active').siblings().removeClass('active');
        }).eq(0).click();
    }

    var DataArrow = "";
    var num = 0;
    var end = 20;


    function switchkey(classkey){

        num = 0;
        end = 20;
        $('.two_menu').slideUp();
        nowMENUbtn = $(this).data('class');
        clearInterval(time);
        $('.commodity,.my_love_wt').css('display', 'none');
        var state = sc.option("disabled");
        sc.option("disabled", true);
        $('#container').removeClass();
        $('body').removeClass();
        $('.my_love_wt span').eq(0).html('長按 開啟排序功能');


        if(classkey === "all"){
            DataArrow = allData;
            $('#container').addClass('b_list');
        }else if(classkey === "love"){
            DataArrow = loveData;
            var state = sc.option("disabled");
            sc.option("disabled", false);
            var state = sc.option("delay");
            sc.option("delay", 400);
            $('body').addClass('two_m');
            $('.two_menu').slideDown();
            setTimeout(function() {
                $('.my_love_wt').css('display', 'block');
            }, 400);   
        }else{
            if(newData[classkey]['subContent'].length > 0){
                $('.two_menu').slideDown();
                $('body').addClass('two_m');
                setTimeout(function() {
                    $('.commodity').css('display', 'block');
                }, 400);

            }
            DataArrow = newData[classkey]['content'];
        }

        $('#container').html('');
        $('.num_box').show();

        if(end > DataArrow.length) end = DataArrow.length
         $(window).scrollTop(0);

        getItem(num,end);
    }



    function getItem(num,end){


        console.log(DataArrow)


        var html = '';

        for(var i=num;i<end;i++){

                html += "<a class=\"item\" data-id="+DataArrow[i].Id+"  data-link=" + DataArrow[i].Link + " data-type=" + DataArrow[i].Type + ">";
                html += "<div class=\"pic_box\" data-link=" + DataArrow[i].Link + " data-type=" + DataArrow[i].Type + " style=\"background:url(" + DataArrow[i].Photo + ") no-repeat 50% 50%;background-size: cover;\"></div>";
                if (DataArrow[i].Title.length > 16) {

                    var Title_s = DataArrow[i].Title.substr(0, 14) + '...';
                    html += "<div class=\"content\"><div class=\"txt\" data-link=" + DataArrow[i].Link + " data-type=" + DataArrow[i].Type + ">" + Title_s + "</div>";

                } else {
                    html += "<div class=\"content\"><div class=\"txt\" data-link=" + DataArrow[i].Link + " data-type=" + DataArrow[i].Type + ">" + DataArrow[i].Title + "</div>";
                }

                if (DataArrow[i].myLove == "true") {
                    // myLoveClass.push(DataArrow[i].Id);
                    // console.log(myLoveClass);
                    html += "<div href=\"javascript:;\" class=\"add_btn active\" ></div><div  href=\"javascript:;\" data-link=" + DataArrow[i].Link + " class=\"type " + DataArrow[i].Type + "\" data-type=" + DataArrow[i].Type + "></div>";
                } else {
                    html += "<div href=\"javascript:;\" class=\"add_btn\" ></div><div href=\"javascript:;\" data-link=" + DataArrow[i].Link + " class=\"type " + DataArrow[i].Type + "\" data-type=" + DataArrow[i].Type + "></div>";
                }

                html += "</div>";
                html += "</a>";

        }
        
        $('#container').append(html);

        setPageNum();

        nowsearch = false;

        setBtn();

    }


    var sc = Sortable.create(container, {
        delay: 400,
        forceFallback: true,
        group: '#container',
        animation: 500,
        handle: '.item',
        onStart: function(evt) {
            OffLink = true;
        },
        onChoose: function(evt) {
            $('#container').addClass('active');
            $('.my_love_wt span').eq(0).html('');
            $('.close_sort').show();
            var state = sc.option("delay");
            sc.option("delay", 0);
            OffLink = true;
            $('.num_shadow_box').addClass('active');
            $('.two_menu').addClass('active');
        },
        onEnd: function(evt) {

            $('body').removeClass('move');

            OffLink = true;
            $('.num_shadow_box').removeClass('active');
        }
    });




    function setBtn(){

            $('.add_btn').unbind('click');

            $('.add_btn').click(function(e) {

                e.stopPropagation();
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }



            });

            $('.item').unbind('mousedown mouseup mousemove touchstart touchend touchmove');

            $('.commodity a').unbind('click');

            $('.commodity a').click(function(e) {
                $(this).addClass('active').siblings().removeClass('active');

                if($(this).data('id')==="all"){
                    DataArrow = newData[$(this).data('pid')]['content'];
                }else{
                    DataArrow =newData[$(this).data('pid')]['subContent'][$(this).data('id')]['content'];
                }

                $('#container').html('');
                $('.num_box').show();
                num = 0;
                end = 20;
                if(end > DataArrow.length) end = DataArrow.length;
                getItem(num,end);

            });



            $('a.close_se').click(function() {
                setTimeout(function() {
                    $("#search_ip").blur();
                    $('.search_page').css('display', 'none');
                    $('html,body').removeClass('close_view');
                }, 0);
            });

            $('.item').bind('touchstart touchend touchmove', function(e) {

                var etc = e.target.className;

                if (e.type === 'touchstart') {
                    if (!$('#container').hasClass('mylove')) return;

                    holdDown();
                } else if (e.type === 'touchend') {
                    if ($(this).data('type') === 'type-d') {
                        if (etc.indexOf('add_btn') > -1) return;
                        holdUp($(this), true);
                    } else {
                        if (etc.indexOf('add_btn') > -1) return;
                        holdUp($(this));
                    }

                } else if (e.type === 'touchmove') {
                    OffLink = true;
                }

            });

            // $('.item').bind('mousedown mouseup', function(e) {

            //     var etc = e.target.className;

            //     if (e.type === 'mousedown') {
            //         if (!$('#container').hasClass('mylove')) return;

            //         holdDown();
            //     } else if (e.type === 'mouseup') {
            //         if ($(this).data('type') === 'type-d') {
            //             if (etc.indexOf('add_btn') > -1) return;
            //             holdUp($(this), true);
            //         } else {
            //             if (etc.indexOf('add_btn') > -1) return;
            //             holdUp($(this));
            //         }

            //     }

            // });



        $('.close_sort').click(function() {
            $('body').removeClass('move');
            $('#container').removeClass('active');
            clearInterval(time);
            var state = sc.option("delay");
            sc.option("delay", 400);
            $('.close_sort').hide();
            $('.two_menu').removeClass('active');
            OffLink = false;
            $('.my_love_wt span').eq(0).html('長按 開啟排序功能');
        });
    }


    var sw = document.getElementById('search_w');

    sw.addEventListener("click", function(e) {
        $('.search_page').css('display', 'block');
        $("#search_ip").focus();
        $('html,body').addClass('close_view');
        $("#search_ip").val("");
    });






    var state = sc.option("disabled");
    sc.option("disabled", true);



    var nowsearch = false;
    var ct;

    $(window).scroll(function() {

        clearTimeout(ct);

        OffLink = true;

        if (nowsearch === true) return;

        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 250) {

            

            nowsearch = true;
            end += 5;

            if (end > DataArrow.length) {

                var bobo = end - 5;
                end = DataArrow.length;
                bobo = end - bobo;
                num = end - bobo;

            } else {

                num = end - 5;

            }
            getItem(num, end);

        }


        ct = setTimeout(function() {
            OffLink = false;
        }, 100);



    });



    var timeStart, timeEnd, time;


    function setPageNum() {

        var tony = DataArrow.length - end;
        if (tony === 0) $('.num_box').hide();
        $('.num_box').html('還有 ' + tony + ' 筆資料');

    }

    function getTimeNow() {
        var now = new Date();
        return now.getTime();
    }





    function holdDown() {

        timeStart = getTimeNow();

        time = setInterval(function() {
            timeEnd = getTimeNow();

            if (timeEnd - timeStart > 700) {
                clearInterval(time);
                OffLink = true;

            }

        }, 100);
    }


    function holdUp(yoyo, ifon) {
        clearInterval(time);

        if (!OffLink && ifon) {

            localStorage.setItem('ifsrc', yoyo.data('link'));
            location.href = "iframe.html";

        } else if (!OffLink) {
            location.href = yoyo.data('link');
        }

    }


    var lastClickTime = 0;
    var clickTimer;

    document.getElementById('container').addEventListener('click', function(event) {
        var nowTime = new Date().getTime();
        if (nowTime - lastClickTime < 400) {

            lastClickTime = 0;
            clearTimeout(clickTimer);
            $('.close_sort').click();
            $('.my_love_wt span').eq(0).html('長按 開啟排序功能');

        } else {
            /*单击*/
            lastClickTime = nowTime;
            clickTimer = setTimeout(function() {}, 400);
        }
    });





}

