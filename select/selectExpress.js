Zepto(function($){
    ant.call('setTitle', {
        title: '选择快递',
    });

    FastClick.attach(document.body);
    window.isServicing = getUrlParam("isServicing") || "2";  // 判断如果已经选择了快递后，是否在服务区！
    // alert(window.isServicing !="1");
    ant.on('resume', function (event) {
        resumePage();
    });

    window.pageNo = 1;    //  默认拉取 第一页的数据
    window.nextPagination = false;   // 默认是不执行 下一页 分页
    var filterCompanyId = []          //  过滤到快递公司
    // BizLog.call('info',{
    //     spmId:"a106.b2108",
    //     actionId:'pageMonitor'
    // });
      window.prePagination = false;  // 默认是不执行 上一页 分页

    // 这里实现分页效果
    // $(window).bind("scroll",function(){
    //   var  contentHeight  = $(".express_content").height();
    //   var  clientHeight   = $(window).height();
    //   var  scrollHeight  = $(window).scrollTop();
    //   console.log(" contentHeight "+contentHeight +" clientHeight "+clientHeight+" scrollHeight:  "+scrollHeight);
    //   var total = contentHeight - clientHeight - scrollHeight
    //   console.log("total "+(contentHeight - clientHeight - scrollHeight));
    //   console.log(contentHeight - clientHeight - scrollHeight<40);
    //   if(window.nextPagination){
    //       if(contentHeight - clientHeight - scrollHeight<10){    // 加载下一页
    //           window.nextPagination = false;
    //              window.pageNo++;
    //             $(".am-loading").show();
    //              Express.init();
    //       }
    //   }
    // });

    Express.init();
    function resumePage(){

        ant.setSessionData({
            data: {
                // epCompanyId:'',
                epCompanyNo:'',
                epCompanyName:'',
                acceptOrderFrom:'',
                acceptOrderTo:'',
                productTypeId:"",
                productTypeName:"",
                presetWeight:"",
                presetWeightPrice:"",
                extraWeightUnit:"",
                extraWeightPrice:"",
                goodsOneValue:"",
                goodsOneIndex:"",
                goodstypeValue:"",
                dayValue: "",
                timeValue: "",
                timeDate:"",
                remarkContent:"",
            }
        });
        if(window.swiperflag){
          promotion(window.cityCode,"BM1010","a106.b2108.c4627");
        }
      Express.init();
        // hideLoading();
    }
});
var Express = new Object({
    init:function(){
        showLoading();
        ant.getSessionData({
                keys: ['filterCompanyId','cityCode','sendAreaCode','recAreaCode','epCompanyId','epCompanyName']
            }, function (result) {
                filterCompanyId = result.data.filterCompanyId;
                window.cityCode = result.data.cityCode;
                var snderDstrCode = result.data.sendAreaCode;
                var rcvrDstrCode =  result.data.recAreaCode;


                window.swiperflag = true;
                   //判断 是否从选快递下单页面转来
                console.log("是否从选快递下单页面转来" +result.data.epCompanyId )
                    //  alert(window.isServicing);
                 if(result.data.epCompanyId&&result.data.epCompanyId!=""&&window.isServicing!="1"){
                          $(".sorrynotic").show();
                          $("#oldExpressName").html(result.data.epCompanyName);
                          window.swiperflag = false;
                          $(".express_content").css("padding-bottom","0");
                 }
                var info = {
                    cityCode: window.cityCode,
                    snderDstrCode:snderDstrCode,
                    rcvrDstrCode: rcvrDstrCode
                };
                console.log("cityCode "+window.cityCode);
                console.log("snderDstrCode "+snderDstrCode);
                console.log("rcvrDstrCode "+rcvrDstrCode);
                var xhrurl = jUrl+'/ep/express_com/list';
                $.axs(xhrurl, info, function(result) {
                    hideLoading();
                    if(result.meta.success)  {
                        var expresshtml = '',xHtml='';
                        var tagval = '';
                        var listOperation = '';
                        if(!result.result.listPageMenuConf||(!result.result.listPageMenuConf.length)){
                            //暂时没有可服务的快递公司
                            //服务范围扩展中，敬请期待
                            $(".sorrynotic").hide();
                            $(".select_expresscontent_empty").show();
                              window.swiperflag = false;
                        }else{
                            $(".select_expresscontent_empty").hide();
                            //  实现分页 加载 的判断
                            var paginationArr = result.result.listPageMenuConf;
                            //  if(paginationArr.length>=11){
                            //     paginationArr.length = 10;       // 表示下一页 还有数据
                            //     window.nextPagination = true;
                             //
                            //  }else {
                            //      window.nextPagination = false;
                            //      $(".am-loading").hide();
                            //  }

                            var filterTemp = filterCompanyId;

                            if(Object.prototype.toString.call(filterTemp) === "[object Array]"){} else {
                              if(filterTemp.length == 2) {
                                    filterTemp = [];
                              }else {
                                  filterTemp = filterCompanyId.slice(1,filterCompanyId.length-1).split(",");
                              }
                            }
                            // alert(Object.prototype.toString.call(filterTemp))
                            // var aadd = filterTemp[0].replace(/\"/g,'');

                          // if(filterTemp[0]){ alert(filterTemp[0].replace(/\"/g,'').replace(/\\/g,'')); }


                            $.each(paginationArr, function(i){
                               var isFilter = false;

                                for(var j =0;j<filterTemp.length;j++) {
                                     if(this.logisMerchCode == filterTemp[j].replace(/\"/g,'').replace(/\\/g,'')) {
                                         isFilter = true;
                                     }
                                };
                                if(isFilter){return;};
                                var taghtml = '',sHtml='';
                                var splitval = this.tag.substring(0, this.tag.length-1);
                                tagval=splitval.split(",");
                                $.each(tagval, function(i){
                                    taghtml += '<span style="">'+tagval[i]+'</span>'
                                })
                                if(this.presetWeightPrice!='' && this.presetWeightPrice!=null){
                                    sHtml='<div class="am-ft-orange" style="display:block;;font-size: .15rem;">'+this.presetWeightPrice*0.01+'元起</div>';
                                }
                                var spmv_i = i+1;
                                if(i==result.result.listPageMenuConf.length-1){
										xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.logisMerchCode+'" epCompanyName="'+this.logisMerchName+'" acceptOrderFrom="'+this.acceptOrderFrom+'" acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.logisMerchLog+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink" style="height:.90rem" data-spmv="a106.b2108.c4626.'+ spmv_i +'">';
                                    }else{
										xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.logisMerchCode+'" epCompanyName="'+this.logisMerchName+'" acceptOrderFrom="'+this.acceptOrderFrom+'" acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.logisMerchLog+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink" style="height:.90rem" data-spmv="a106.b2108.c4626.'+ spmv_i +'">';
									}
									expresshtml+=xHtml +'<div class="am-list-thumb choice_leftlogo">'

                                    +'<img src="'+this.logisMerchLog+'" alt="">'
                                    +'</div>'
                                    +'<div class="am-list-content" style="padding-top:.06rem;">'
                                    +'<div class="am-list-title list_lineheight">'
                                    +'<span class="compName" style="font-size:.16rem">'+this.logisMerchName+'</span>'
                                    +'<span class="hot_icon hoticon'+this.hotStatus+'">热</span>'
                                    +'<span class="hot_icon newicon'+this.newStatus+'">新</span>'
                                    +'</div>'
                                    +'<span class="am-ft-gray advertisementvals" style="font-size:.14rem;padding-top: 0.04rem;padding-bottom: .01rem;">'+this.slogan+'</span>'
                                    +'<div class="am-ft-orange bubble_font" style="height:.14rem;line-height:.14rem;">'+taghtml+'</div>'
                                    +'</div>'
                                    +sHtml
                                    +'<div class="am-list-arrow"><span class="am-icon horizontal" style="vertical-align:middle"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/indicator_icon.png"/></span></div>'
                                    +'</div>'

                                    BizLog.call('info',{
                                        spmId:"a106.b2108.c4626",
                                        actionId:'exposure',
                                        params:{
                                                CompName:this.logisMerchName
                                        }
                                    });

                            })
                        }
                       if(window.swiperflag){
                         promotion(window.cityCode,"BM1010","a106.b2108.c4627");
                       }

                        if (!result.result.notice) {
                            $(".header_notification").hide();
                        }else{
                           if(window.swiperflag){
                               $(".header_notification").show();
                           }

                            $(".noticeval").html(result.result.notice.content);
                            $(".express_content").css("margin-top","0");
                            //公告显示埋点
                            BizLog.call('info',{
                                spmId:"a106.b2108.c4625",
                                actionId:'exposure',
                                params:{
                                    title:result.result.notice.content
                                }
                            });
                        }


                        $(".management_list").html(expresshtml);


                        $(".management_list .typelink:nth-child(n)").css({"padding-bottom":"0.005rem","padding-top":"0"});
                        $(".management_list .typelink:first-child").css("padding-top","0.005rem");

                        $(".express_content").show();
                        // if($(window).width()>=393){
                            // $(".bubble_font span").css({"border":"1px solid0 #ff8200","height":".15rem","line-height":".15rem","font-size":"12px"});

                            // $(".bubble_font span").css({"border":"1px solid #ff8200","height":".13rem","line-height":".13rem"});
                        // }
                        if(isAndroid){
            								$(".borderTop").css("border-top","1px solid #ddd");
                            $(".bubble_font span").css({"border":"1px solid #ff8200","padding-top":"0.02rem","padding-bottom":"0.015rem","height":"auto","line-height":"1","font-size":".1rem"});
                          // if($(window).width()>=360){
                          //     $(".bubble_font span").css({"border":"1px solid #ff8200","height":".15rem","line-height":".15rem","font-size":".12rem"});
                          // }else{
                          //     $(".bubble_font span").css({"border":"1px solid #ff8200","height":".13rem","line-height":".13rem"});
                          // }

                          if(result.result.notice){
                               $(".am-notice-content").html('<marquee behavior="scroll" align="absmiddle" scrollamount="3" class="noticeval">'+result.result.notice.content+'</marquee>');
                             }

                        }else{
                           var marqueeWidth = $(".am-notice-content").width() - parseFloat($(".am-notice-content").css("padding-left"));
                           var marqueeContentWidth = marqueeWidth+$(".noticeval").width() -15;
                           $("#kong").width(marqueeWidth);
                           $("#outcontent").width(marqueeContentWidth)
                        }
                        //判断是否有多个快递产品类型
                        $(".typelink").click(function(){

                            var number = $(".typelink").index(this)+1;
                            BizLog.call('info',{
                                spmId:"a106.b2108.c4626." + number,
                                actionId:'clicked',
                                params:{
                                       CompName:$(this).find(".am-list-title .compName").text(),
                                }
                            });
                            var epCompanyId = $(this).attr("epCompanyId"),
                                epCompanyNo = $(this).attr("epCompanyNo"),
                                epCompanyName = $(this).attr("epCompanyName"),
                                acceptOrderFrom = $(this).attr("acceptOrderFrom"),
                                acceptOrderTo = $(this).attr("acceptOrderTo"),
                                slogan = $(this).attr("slogan"),
                                imgsrc = $(this).attr("imgsrc"),
                                tag = $(this).attr("tag");
                            ant.setSessionData({
                                data: {
                                    epCompanyId:epCompanyId,
                                    epCompanyNo:epCompanyNo,
                                    epCompanyName:epCompanyName,
                                    acceptOrderFrom:acceptOrderFrom,
                                    acceptOrderTo:acceptOrderTo,
                                    slogan:slogan,
                                    imgsrc:imgsrc,
                                    tag:tag
                                }
                            });
                            var info = {
                                "logisMerchId" : JSON.parse(epCompanyId),
                                "snderDstrCode" : snderDstrCode,
                                "rcvrDstrCode" : rcvrDstrCode
                            };
                            $(document.body).hide();
                            ant.pushWindow({
                                        url: "information-fill.html"
                                  });
                        });
                    }else{
                        alert(result.meta.msg);
                    }

                });
            }
        );
    }
});
