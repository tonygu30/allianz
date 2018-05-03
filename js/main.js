
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


var channelCode = "A633";
var token = "ee8c8461-e6f9-4b4c-98d7-3be6f5a89903";
var systemCode = "54";
var apiUrl = 'https://t2.allianz.com.tw/wsUtility/MediaCenter';

$(function() {

    $(this).disableSelection();

    var Mdata = [];
    var TMdata = [];


    doAjaxRequest(
        'POST',
        '/getData',
        {
            SystemCode: systemCode,
            token: token,
            MC_Key: "channel",
            MC_Key1: channelCode,
            MC_Key2: "class"
        },
        function(response) {
            var classHtml = '';
            var subClassHtml = '';
            var Mdata = [];
            var TMdata = [];
            var subAllClass = [];

            sortFliterData(response, ["id" , "sort"] );

            for(var i=0;i<response.length;i++){
                if(response[i].classId == 0){

                    classHtml+="<a data-class="+response[i].id+">"+response[i].name+"</a>";
                    Mdata.push(response[i]);

                }else{

                    if( jQuery.inArray( response[i].classId, subAllClass ) == -1){
                        subClassHtml += "<a  class=\"active\" data-pid="+response[i].classId+"  data-id=\"all\">全部</a>"
                        subAllClass.push(response[i].classId);

                    }

                    subClassHtml+="<a  data-pid="+response[i].classId+" data-id="+response[i].id+">"+response[i].name+"</a>";
                    TMdata.push(response[i]);
                }
                
            }

            $('.menu_bar').append(classHtml);
            $('.commodity').html(subClassHtml);

            documentProcess(Mdata,TMdata);
        }
    );


});


function sortFliterData(response, sortType ){

    for (var key in response) {
        if (response[key].status == false) {
            response.splice(key, 1);
        }
    }

    response.sort( function(item1, item2) {

        if( sortType.indexOf("isTop") > -1){
            if (item1.isTop > item2.isTop) return -1;
            if (item1.isTop < item2.isTop) return 1
        }

        if( sortType.indexOf("sort") > -1){
            return (item2.sort != 0) - (item1.sort != 0) || item1.sort - item2.sort;
        }

        if( sortType.indexOf("id") > -1){
            if (item1.id > item2.id) return 1;
            if (item1.id < item2.id) return -1;
        }
    });
    console.log(response);
}

function documentProcess(data,Tdata){

    var mData = data;
    var tMdata = Tdata;
    var itemData ="";
    var allData = [];
    var loveData = [];
    var newData = {};

    for(var i=0;i<mData.length;i++){
        newData[mData[i].id]={"menuName":mData[i].name,"content":[],"subContent":[]};
        newData[mData[i].id]["subContent"]["all"] = {"name": "全部","content":[]}
    }

    for(var i=0;i<tMdata.length;i++){
        newData[tMdata[i].classId]["subContent"][tMdata[i].id] = {"name": tMdata[i].name,"content":[]};
    }


    doAjaxRequest(
        'POST',
        '/getData',
        {
            SystemCode: systemCode,
            token: token,
            MC_Key: "channel",
            MC_Key1: channelCode,
            MC_Key2: "document"
        },
        function(response) {

            sortFliterData(response, ["id" , "sort", "isTop"] );



            response.map(function(item){

                if(typeof(newData[item.classId]["content"]) !== "undefined"){
                   newData[item.classId]["content"].push(item);

                   if(typeof(newData[item.classId]["subContent"][item.subClassId]) !== "undefined" && item.subClassId > 0 ){

                        newData[item.classId]["subContent"][item.subClassId]['content'].push(item);
                        newData[item.classId]["subContent"]["all"]['content'].push(item);
                   }
                }
                   
            });

            allData = response;
            menukey();

        }
    );


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

        var html = '';
        var exampleLink1 = "http://docs.google.com/gview?url=https://www.allianz.com.tw/v_1447304484000/downloads/product/Protection/accident-and-travel/%E5%82%B3%E7%B5%B1%E8%A1%8C%E4%A2%9D%E4%AC%BE%E4%A8%A3%E5%BC%B5/TA1-E01v2.pdf&embedded=true";
        var exampleLink2 = "https://www.youtube.com/embed/4axeWdOx9lQ?autoplay=1";
        var exampleLink3 = "https://www.allianz.com.tw/zh-tw/";
        var imageTest = "https://picsum.photos/400/434";

        for(var i=num;i<end;i++){



                switch(DataArrow[i].typeId){
                    case 1:
                        var link = exampleLink1;
                        var typeStyle = 'type-a'
                        break;
                    case 2:
                        var link = exampleLink2;
                        var typeStyle = 'type-d'
                        break;
                    default:
                        var link = exampleLink3;
                        var typeStyle = 'type-b'
                }

                html += "<a class=\"item\" data-id="+DataArrow[i].id+"  data-link=" + link + " data-type=" + typeStyle + ">";
                html += "<div class=\"pic_box\" data-link=" + link + " data-type=" + typeStyle + " style=\"background:url(" + imageTest + ") no-repeat 50% 50%;background-size: cover;\"></div>";
                if (DataArrow[i].name.length > 16) {

                    var titleS = DataArrow[i].name.substr(0, 14) + '...';
                    html += "<div class=\"content\"><div class=\"txt\" data-link=" + link + " data-type=" + typeStyle + ">" + titleS + "</div>";

                } else {
                    html += "<div class=\"content\"><div class=\"txt\" data-link=" + link + " data-type=" + typeStyle + ">" + DataArrow[i].name + "</div>";
                }

               /* if (DataArrow[i].myLove == "true") {
                    html += "<div href=\"javascript:;\" class=\"add_btn active\" ></div><div  href=\"javascript:;\" data-link=" + link + " class=\"type " + typeStyle + "\" data-type=" + typeStyle + "></div>";
                } else {*/
                    html += "<div href=\"javascript:;\" class=\"add_btn\" ></div><div href=\"javascript:;\" data-link=" + link + " class=\"type " + typeStyle + "\" data-type=" + typeStyle + "></div>";
                //}

                html += "</div>";
                html += "</a>";

        }

        $('#container').append(html);

        setPageNum();

        if(DataArrow[0].isTop){
            $('#container').addClass('b_list');
        }else{
            $('#container').removeClass('b_list');
        }

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

            $('.item').unbind('mousedown mouseup touchstart touchend touchmove');

            $('.commodity a').unbind('click');

            $('.commodity a').click(function(e) {
                $(this).addClass('active').siblings().removeClass('active');

                console.log($(this).data('pid'));
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


            $('.item').bind('mousedown mouseup', function(e) {

                var etc = e.target.className;

                if (e.type === 'mousedown') {
                    if (!$('#container').hasClass('mylove')) return;

                    holdDown();
                } else if (e.type === 'mouseup') {
                    if ($(this).data('type') === 'type-d') {
                        if (etc.indexOf('add_btn') > -1) return;
                        holdUp($(this), true);
                    } else {
                        if (etc.indexOf('add_btn') > -1) return;
                        holdUp($(this));
                    }

                }

            });

            // $('.item').bind('touchstart touchend touchmove', function(e) {

            //     var etc = e.target.className;

            //     if (e.type === 'touchstart') {
            //         if (!$('#container').hasClass('mylove')) return;

            //         holdDown();
            //     } else if (e.type === 'touchend') {
            //         if ($(this).data('type') === 'type-d') {
            //             if (etc.indexOf('add_btn') > -1) return;
            //             holdUp($(this), true);
            //         } else {
            //             if (etc.indexOf('add_btn') > -1) return;
            //             holdUp($(this));
            //         }

            //     } else if (e.type === 'touchmove') {
            //         OffLink = true;
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

    var OffLink = false;


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

function doAjaxRequest(method, apiName, dataParm, func){   

        $.ajax({
            type: method,
            url: apiUrl + apiName,
            data: dataParm,
            beforeSend: function(XMLHttpRequest){
                
            },
            success: function(data) {
                
                if(typeof data == 'object' && data.Return_Code == "0"){
                    func( JSON.parse(data.Return_Message) );
                }else{
                    alert(data.Return_Message);
                    return;
                }

            },
            statusCode: {
                401: function() {
                    alert('Your session has expired. Please log in.');
                    return;
                },
                405: function() {
                    alert('Method not allowed.');
                    return;
                },
            }
        }).done(function() {})

    }