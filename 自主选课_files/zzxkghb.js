	var isWebApp = isPc();
	var step = 10;
	var startLiIndex = 0;
	var stopLiIndex = 0;
	jQuery(function($){
		//alert($("#yhgnPage").width());
		var tabWidth = _localeKey == "en_US" ? 120 : 110;
		//加载已选教学班
		loadChoosedCourse();
		categroyClick($("#blzyTool"),"xk_1","bl");
		stopLiIndex = parseInt(parseInt($("#yhgnPage").width()-250)/tabWidth);
		for(var m=0; m<=stopLiIndex; m++){//初始化页签项
			$("#nav_tab .leaf").eq(m).css("display","");
		}
		$("#nextPage").click(function(){
			var jspage = $("#jspage").val();
	        var globJsPage = $("#globJsPage").val();
	        var isEnd = $("#isEnd").val();
	        var isHaveResult = $("#isHaveResult").val();//查询结果是否有数据
	        //var isSlct = $("#isSlct").val();
	        if(isHaveResult=="0"){//查询结果无数据时
				$("#more").hide(); //隐藏查看更多
				$("#endsign").hide(); //隐藏到达最后一页提示
	        }else if(isHaveResult=="1" && parseInt(globJsPage)<parseInt(jspage) && isEnd=="true"){
				$("#globJsPage").val(jspage);
				$("#endsign").show(); //显示到达最后一页提示
				$("#more").hide(); //隐藏查看更多
			}else if(isHaveResult=="1" && parseInt(globJsPage)<parseInt(jspage) && isEnd=="false"){
				if(jspage==10 && $(".kc_head").length < 10){//未瀑布加载前已到最后页时，就不需要再次访问数据库
					$("#more").hide(); //隐藏查看更多
					$("#endsign").show(); //显示到达最后一页提示
				}else{
					$("#globJsPage").val(jspage);
					$("#more").show(); //显示查看更多
					$("#endsign").hide(); //隐藏到达最后一页提示
					var xkmc = $.founded($("#kclbms").attr("kclbmc")) ? 
						$("#kclbms").attr("kclbmc") : $("#kclbms").text();
					var dl = $("#current_dl").val();
					var jxjhh = $("#nj").val()+$("#zydm").val();
					var nj = $("#nj").val();
					var zydm = $("#zydm").val();
					if(dl=="zx"){
						dl = "xk_1";//跨类选课为主修时，取课程方法与本类（专业选课类似），不同的是年级专业
						nj = $("#kdl_nj").val();
						zydm = $("#kdl_zydm").val();
						jxjhh = nj + zydm;
					}else if(dl=="fx"){
						dl = "zjdx_zylb";
						nj = $("#kdl_nj").val();
						zydm = $("#kdl_zydm").val();
						jxjhh = nj + zydm;
					}
					if(dl=="xk_6"){
						jxjhh = $("#xn").val().substring(0,4)+"cx01";
					}
					if(dl=="Z"){
						//xkmc = $.i18n.get("zkzxykc");
						xkmc = "竺可桢学院课程";
					}
					var t_path = _path+"/xsxk/zzxkghb_cxZzxkGhbKcList.html";
					var paraMap={
							"dl":dl,
							"lx":$("#current_lx").val(),
							"xkmc":xkmc,
							"nj":nj,
							"xn":$("#xn").val(),
							"xq":$("#xq").val(),
							"zydm":zydm,
							"jxjhh":jxjhh,
							"xnxq":"("+$("#xn").val()+"-"+$("#xq").val()+")-",
							"kspage":parseInt(jspage)+1,
							"jspage":parseInt(jspage)+parseInt(step)
					};
					if(dl=="xk_9"){
						t_path = _path+"/xsxk/zzxkghb_cxZzxkGhbDdkcList.html";
						paraMap = {
							"xnxq":"("+$("#xn").val()+"-"+$("#xq").val()+")-",
							"cx_cxlb_1":$("#cx_cxlb_1").val(),
							"cx_cxgx_1":$("#cx_cxgx_1").val(),
							"cx_cxnr_1":$("#cx_cxnr_1").val(),
							"cx_xingq_1":$("#cx_xingq_1").val(),
							"cx_kclb_1":$("#cx_kclb_1").val(),
							"cx_sjd_1":$("#cx_sjd_1").val(),
							"cx_zbgx":$("input:checkbox[name='cx_zbgx']:checked").val(),
							"cx_cxlb_2":$("#cx_cxlb_2").val(),
							"cx_cxgx_2":$("#cx_cxgx_2").val(),
							"cx_cxnr_2":$("#cx_cxnr_2").val(),
							"cx_xingq_2":$("#cx_xingq_2").val(),
							"cx_kclb_2":$("#cx_kclb_2").val(),
							"cx_sjd_2":$("#cx_sjd_2").val(),
							"cx_ylcx":$("#cx_ylcx").prop("checked")?"1":"0",
							"kspage":parseInt(jspage)+1,
							"jspage":parseInt(jspage)+parseInt(step)
						};
					}
					$.ajaxSetup({async:false});
					$.post(t_path,paraMap,
						function(data){
							loadCourseList(data);
						},'json');
					$.ajaxSetup({async:true});
				}
			}
		});
		
		//浮动框的宽度及动作设定
		$(".outer").animate({width:"40px"},1000);
		$(".outer_left").unbind("click").click(function(event) {	
			//阻止继续冒泡
			event.stopPropagation();
			//第一次加载已选课程时，从数据库查找，在这里加载体育课的学分无法正确计算
			/*if($("#firstLoadChoosedCourse").val()=="1"){
				$("#firstLoadChoosedCourse").val("0");
				$(".right_div").empty();
				loadChoosedCourse();
			}*/
			if($(".outer").css("width")	==	"40px"){
				if($(window).width() > 740){
					$(".outer").animate({width:"740px"},500);
					$(".outer_left .btn-lg").addClass("icon-arrow-right");
				}else{
					$(".outer").animate({width:$(window).width()},500);
					$(".outer_left .btn-lg").addClass("icon-arrow-right");
				}
			}else{
				$(".outer").animate({width:"40px"},500);
				$(".outer_left .btn-lg").removeClass("icon-arrow-right");
			}
		});

		/*$(".dropdown-toggle").click(function(event){
			alert(1);
			//event.stopPropagation();
		});*/

		//点击页面其他地方右侧内容隐藏(会影响有子页签的课程大类页签)
		/*$(document).unbind("click").click(function(event) {
			try {
				if (!event || $(event.target).size() == 0) {
					return;
				}
				var drag = $(".outer"),
					dragel = $(".outer")[0],
					target = event.target;
				if (dragel !== target && !$.contains(dragel, target)) {
					$(".outer").animate({width:"40px"},500);
					$("#wrapper").mCustomScrollbar("update");
					//$(".outer_left .glyphicon").removeClass("glyphicon-arrow-right");
					$(".outer_left .btn-lg").removeClass("icon-arrow-right");
				}
			} catch (e) {}
		});*/
		
		$(document).off("click",".fa-arrow-up").on("click",".fa-arrow-up",function(event){
			event.stopPropagation();
			var curLiObj = $(this).parent().parent().parent().parent().parent().parent();
			var preLiObj = curLiObj.prev();
			if($.founded(preLiObj.html()) && preLiObj.html()!=""){
				preLiObj.before(curLiObj.clone(true));
				curLiObj.remove();
				saveOrder();
				myDragsort();
			}
		}).off("click",".fa-arrow-down").on("click",".fa-arrow-down",function(event){
			event.stopPropagation();
			var curLiObj = $(this).parent().parent().parent().parent().parent().parent();
			var nextLiObj = curLiObj.next();
			if($.founded(nextLiObj.html()) && nextLiObj.html()!=""){
				nextLiObj.after(curLiObj.clone(true));
				curLiObj.remove();
				saveOrder();
				myDragsort();
			}
		}).off("click",".jump").on("click",".jump",function(event){
			event.stopPropagation();
			var m_kcmc = $(this).text();
			m_kcmc = $.trim(m_kcmc.split(")")[1].split("-")[0]);
			if(m_kcmc=="体育课" || m_kcmc == "Physical Education"){
				categroyClick($("#tykTool"),'xk_8','bl');
				$("#nav_tab").find("li.active").removeClass("active");
				$("#tykTool").parent().addClass("active");
			}else if($("#current_dl").val()!="xk_9"){
				categroyClick($("#searchTool"),"xk_9","bl")
				$("#nav_tab").find("li.active").removeClass("active");
				$("#searchTool").parent().addClass("active");
				var times = 0;
				var interval = window.setInterval(function(){
					if($("#cx_cxnr_1").val()!="" || times>100){
						window.clearInterval(interval);
					}
					$("#cx_cxnr_1").val(m_kcmc);
					$("#cx_cxgx_1").val("equal");
					times++;
				}, 300);
			}else{
				$("#cx_cxnr_1").val(m_kcmc);
				$("#cx_cxgx_1").val("equal");
			}
		}).off("click",".tjxk_list .panel-heading").on("click",".tjxk_list .panel-heading",function(event){
			event.stopPropagation();
			if($(this).children(".expand_close").attr("class").indexOf("expand1")>0){ 
				//打开一门课程的教学班列表的同时，关闭其他课程下的教学班列表 
				$(".tjxk_list .panel-heading .expand_close").each(function(index,item){
					if($(item).attr("class").indexOf("close1")>0){
						$(item).removeClass('close1').addClass('expand1');
						$(item).parent().parent().find(".panel-body").slideUp();
					}
				});
				$(this).children(".expand_close").removeClass('expand1').addClass('close1');
				$(this).next(".panel-body").slideDown();
				//var kcdm = $(this).find("input[name='kcdm']").val();
				//alert($(this).find("input[name='kcdm']").val());
				//window.location.hash = "#zxs_"+$(this).find("input[name='kcdm']").val();
			}else{
				$(this).children(".expand_close").removeClass('close1').addClass('expand1');
				$(this).next(".panel-body").slideUp();
			}
		}).off("click",".xuanke").on("click",".xuanke",function(event){
			event.stopPropagation();
			var xkkh = $(this).data("xkkh");
			var kcdm = $(this).data("kcdm");
			var tabname = $(this).data("tabname");
			if($("#current_dl").val()=="xk_7"){
				if(tabname!="jxrwbview"){
					$.confirm($.i18n.get("msg_qdfqbk"),function(isBoolean){
						if(isBoolean){
							xuanKe(xkkh,kcdm,tabname,'xk');
						}
					});
				}else{
					$.confirm($.i18n.get("msg_qdcjbk"),function(isBoolean){
						if(isBoolean){
							xuanKe(xkkh,kcdm,tabname,'bkxk');
						}
					});
				}
			}else{
				xuanKe(xkkh,kcdm,tabname,'xk');
			}
			
			/*$.ajaxSetup({async:false});
			$.post(
				_path+"/xsxk/zzxkghb_xkBcZyZzxkGhb.html",
				{
					"xn":$("#xn").val(),
					"xq":$("#xq").val(),
					"xkkh":xkkh,
					"tabname":tabname,
					"xkzys":$("#xkzys").val()
				},
				function(data){
					setTimeout(function(){
						if(data!=null){
							if(data.flag=="1"){
								$.success(data.msg);
								appendChoosedHtml(kcdm,xkkh,tabname);
								reflushRs(xkkh,tabname);
							}else{
								$.alert(data.msg);
								return false;
							}
						}
					},1); 
				},'json');
			$.ajaxSetup({async:true});*/
		}).off("click",".xuanke_bk").on("click",".xuanke_bk",function(event){
			event.stopPropagation();
			var xkkh = $(this).data("xkkh");
			var kcdm = $(this).data("kcdm");
			var tabname = $(this).data("tabname");
			$.confirm($.i18n.get("msg_qdcjbk"),function(isBoolean){
				if(isBoolean){
					xuanKe(xkkh,kcdm,tabname,'bkxk');
				}
			});
		}).off("click",".tuike").on("click",".tuike",function(event){
			event.stopPropagation();
			var xkkh = $(this).data("xkkh");
			var kcdm = $(this).data("kcdm");
			var tabname = $(this).data("tabname");
			if($("#confirmModal").size() > 0 ){
				return;
			}
			$.confirm($.i18n.get("msg_qdtdkc"),function(isBoolean){
				if(isBoolean){
					tuiKe(xkkh,kcdm,tabname,"tk");
				}
			});
		}).off("click",".tuike_bk").on("click",".tuike_bk",function(event){
			event.stopPropagation();
			var xkkh = $(this).data("xkkh");
			var kcdm = $(this).data("kcdm");
			var tabname = $(this).data("tabname");
			if($("#confirmModal").size() > 0 ){
				return;
			}
			$.confirm($.i18n.get("msg_qdtdkc"),function(isBoolean){
				if(isBoolean){
					tuiKe(xkkh,kcdm,tabname,"bktk");
				}
			});
		});
		
		var times_1 = 0;
		var interval_1 = window.setInterval(function(){
			if(times_1 >= 10){
				window.clearInterval(interval_1);
			}
			if($.fn.dragsort){
				myDragsort();
				window.clearInterval(interval_1);
			}
			times_1 += 1;
		}, 1000);
		
		var times_2 = 0;
		var interval_2 = window.setInterval(function(){
			if(times_2 >= 10){
				window.clearInterval(interval_2);
			}
			if($.fn.mCustomScrollbar){
				//滚动条
				$(".outer_right_wrapper").mCustomScrollbar({
					axis:"yx",
					scrollbarPosition:"outside",
				});
				window.clearInterval(interval_2);
			}
			times_2 += 1;
		}, 1000);
		
		var times_3 = 0;
		//已选课程数，延迟加载
		var interval_3 = window.setInterval(function(){
			if(times_3 >= 3){
				window.clearInterval(interval_3);
			}
			$("#choosedCount").text($(".right_table_head").length);
			$(".fade").css("display","block");
			times_3++;
		}, 300);
	});
	
	
	
	$("#forwardLeft").click(function(){
		if(startLiIndex>0){
			$("#nav_tab .leaf").eq(startLiIndex-1).css("display","");
			$("#nav_tab .leaf").eq(stopLiIndex).css("display","none");
			startLiIndex = startLiIndex-1;
			stopLiIndex = stopLiIndex-1;
			$("#forwardRight").css({"color":"#2a6496"});
			if(startLiIndex==0){
				$("#forwardLeft").css({"color":"#CCCCCC"});
			}
		}else{
			//$.alert("已到最左边！");
			$("#forwardLeft").css({"color":"#CCCCCC"});
			return false;
		}
	});

	$("#forwardRight").click(function(){
		totalLen = $("#nav_tab .leaf").length;
		if(stopLiIndex < totalLen-1){
			$("#nav_tab .leaf").eq(startLiIndex).css("display","none");
			$("#nav_tab .leaf").eq(stopLiIndex+1).css("display","");
			startLiIndex = startLiIndex+1;
			stopLiIndex = stopLiIndex+1;
			$("#forwardLeft").css({"color":"#2a6496"});
			if(stopLiIndex == totalLen-1){
				$("#forwardRight").css({"color":"#CCCCCC"});
			}
			$(".fade").css("display","none");
		}else{
			//$.alert("已到最右边！");
			$("#forwardRight").css({"color":"#CCCCCC"});
			return false;
		}
	});
	
	function xuanKe(xkkh,kcdm,tabname,czlx){
		$.ajaxSetup({async:false});
		$.post(
			_path+"/xsxk/zzxkghb_xkBcZyZzxkGhb.html",
			{
				"xn":$("#xn").val(),
				"xq":$("#xq").val(),
				"xkkh":xkkh,
				"tabname":tabname,
				"xkzys":$("#xkzys").val()
			},
			function(data){
				setTimeout(function(){
					if(data!=null){
						if(data.flag=="1"){
							$.success(data.msg);
							appendChoosedHtml(kcdm,xkkh,tabname,czlx);
							if(czlx != "bkxk"){
								reflushRs(xkkh,tabname);
							}
						}else{
							$.alert(data.msg);
							return false;
						}
					}
				},1); 
			},'json');
		$.ajaxSetup({async:true});
	}
	
	function tuiKe(xkkh,kcdm,tabname,czlx){
		$.ajaxSetup({async:false});
		$.post(
			_path+"/xsxk/zzxkghb_tuikBcZzxkGhb.html",
			{"xkkh":xkkh},
			function(data){
				setTimeout(function(){
					if(data!=null){
						if(data.flag=="1"){
							$.success(data.msg);
							removeChoosedHtml(kcdm,xkkh,tabname,czlx);
							if(czlx != "bktk"){
								reflushRs(xkkh,tabname);
							}
						}else{
							$.alert(data.msg);
							return false;
						}
					}
				},1); 
			},'json');
		$.ajaxSetup({async:true});
	}
	
	//页签事件
	function categroyClick(obj,dl,lx){
		//event.stopPropagation();
		//var dl 	= $(this).data("dl");
		//var lx 	= $(this).data("lx");
		var nj 	= $("#nj").val();
		var zydm = $("#zydm").val();
		var xkmc = $(obj).parent().attr("title");
		var kclbmc = $(obj).parent().attr("kclbmc");
		$("#current_dl").val(dl);
		$("#current_lx").val(lx);
		$("#kclbms").text(xkmc).attr(
			"kclbmc", $.founded(kclbmc) ? kclbmc : xkmc);
		$("#jspage").val("0");
		if(lx=="zl" || dl=="xk_2" || dl=="xk_3" || dl=="xk_4" || dl=="zy_b" || dl=="zy_qb"){
			$("#nav_tab").find("li.active").removeClass("active");
			$(obj).parent().parent().parent().addClass("active");
		}
		$("#endsign").hide(); //每一次重新查询时隐藏可能显示出来的到达最后一页提示
		$("#more").hide(); //关闭查看更多
		$("#contentBox").empty();
		$("#selectBox").empty();
		if(dl=="xk_1_1"){//跨类(专业)选课
			$("#contentBox").load(_path+"/xsxk/zzxkghb_cxZzxkGhbKzyxxtx.html",{},function(){});
		}else if(dl=="xk_9"){
			$("#selectBox").load(_path+"/xsxk/zzxkghb_cxZzxkGhbSuperQuery.html",{},function(){});
		}else if(dl=="iconyjsxk"){
			$("#contentBox").load(_path+"/xsxk/zzxkghb_cxZzxkGhbJumpYjsCourses.html",{},function(){});
		}else{
			loadCourses(($.founded(kclbmc) ? kclbmc : xkmc),dl,lx,nj,zydm);
		}
	}
	
	function loadCourses(xkmc,dl,lx,nj,zydm){
		var xn 	= $("#xn").val();
		var xq 	= $("#xq").val();
		//var xkmc =$(obj).parent().attr("title");
		var jxjhh = nj+zydm;
		if(dl=="X" && xn.substring(0,4) != nj){
			$.alert($.i18n.get("msg_xsytkzyyxsxk"));
			return false;
		}
		if(dl=="zx"){
			dl = "xk_1";//跨类选课为主修时，取课程方法与本类（专业选课类似），不同的是年级专业
			$("#current_dl").val("zx");
		}else if(dl=="fx"){
			dl = "zjdx_zylb";
			$("#current_dl").val("fx");
		}
		if(dl=="xk_6"){
			jxjhh = xn.substring(0,4)+"cx01";
		}
		if(dl=="Z"){
			//xkmc = $.i18n.get("zkzxykc");
			xkmc = "竺可桢学院课程";
		}
		var s_html = [];
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkghb_cxZzxkGhbKcList.html",
			{
				"dl":dl,
				"lx":lx,
				"xkmc":xkmc,
				"nj":nj,
				"xn":xn,
				"xq":xq,
				"zydm":zydm,
				"jxjhh":jxjhh,
				"xnxq":"("+xn+"-"+xq+")-",
				"kspage":1,
				"jspage":10
			},
			function(data){
				loadCourseList(data);
			},'json');
		$.ajaxSetup({async:true});
	}
	
	
	function loadCourseList(data){
		var t_html = [];
		if(data != null && data.length>0){
			var jspage = $("#jspage").val();
			if(jspage=="0"){
				$("#isHaveResult").val("1");
				t_html.push("<div class='tjxk_list' style='margin-top:-30px'>");
				t_html.push("<h4 class='tjxk_title'></h4>");
			}
			var ks_kcrow = 0;
			var js_kcrow = 0;
			for(var i=0; i<data.length; i++){
				if(i==0){
					ks_kcrow = data[0].rn;
				}
				if(i==data.length-1){
					js_kcrow = data[i].rn;
				}
				var mdA = data[i];
				var kcxx = mdA.kcxx.split("~");
				var xxkbj = kcxx[0];
				var xf = kcxx[1];
				var zxs = kcxx[2];
				t_html.push("<div class='panel panel-info'>");
				t_html.push("<div class='panel-heading kc_head kc_head_"+mdA.kcdm+"' onclick='loadJxbxxZzxk(this)' ");
				if(mdA.kcxzzt=="1"){
					t_html.push("style='background-color:#fff7b2;'");
				}
				t_html.push("><h3 class='panel-title'>");
				if(xxkbj == "1"){
					t_html.push("<span style='margin-right:-40px'><font color='red'>【" + $.i18n.get("yyxyq") + "】</font></span>");
				}
				//html_kc/20189010.html
				t_html.push("<span id='kcmc_"+mdA.kcdm+"' class='kcmc'>("+mdA.kcdm+")<a href='javascript:void(0);' onclick=showCourseInfo('"+mdA.kcdm+"')>"+mdA.kcmc+"</a>-<i id='xf_"+mdA.kcdm+"'>"+xf+"</i> " +$.i18n.get("xf")+"</span>");
				//t_html.push("<span id='kcmc_"+mdA.kcdm+"' class='kcmc'>("+mdA.kcdm+")<a href='"+_kcjsjjPath+"/html_kc/"+mdA.kcdm+".html'>"+mdA.kcmc+"</a>-<i id='xf_"+mdA.kcdm+"'>"+mdA.xf+"</i> 学分</span>");
				t_html.push("<span>" + $.i18n.get("zxs") + "：<i id='zxs_"+mdA.kcdm+"'>"+zxs+"</i></span>");
				if(mdA.kcxzzt=="1"){
					t_html.push("<span id='zt_txt_"+mdA.kcdm+"'>" + $.i18n.get("zt") + "：<b>" + $.i18n.get("yx") + "</b></span>");
				}else{
					t_html.push("<span id='zt_txt_"+mdA.kcdm+"'>" + $.i18n.get("zt") + "：" + $.i18n.get("wx") + "</span>");
				}
				t_html.push("</h3>");
				t_html.push("<input type='hidden' value='"+mdA.kcdm+"' name='kcdm'/>");
				t_html.push("<input type='hidden' value='"+mdA.xkkh+"' name='p_xkkh'>");
				t_html.push("<input type='hidden' value='"+mdA.rn+"' name='rn'>");
				t_html.push("<input id='xxkbj_"+mdA.kcdm+"' type='hidden' value='"+xxkbj+"'/>");
				t_html.push("<input type='hidden' value='0' name='czzt'>");
				t_html.push("<a class='expand_close expand1' href='javascript:void(0);'>" + $.i18n.get("zkgb") + "</a>");
				t_html.push("</div>");
				t_html.push("<div class='panel-body table-responsive'>");
				t_html.push("<table class='table table-hover'>");
				t_html.push("<thead>");
				t_html.push("<tr class='active'>");
				t_html.push("<th width='7%' nowrap='nowrap'>" + $.i18n.get("jiaoshi") + "</th>");
				t_html.push("<th nowrap='nowrap'>" + $.i18n.get("xq") + "</th>");
				t_html.push("<th width='1%' nowrap='nowrap'>" + $.i18n.get("sksj") + "</th>");
				t_html.push("<th nowrap='nowrap'>" + $.i18n.get("skdd") + "</th>");
				t_html.push("<th width='7%' nowrap='nowrap'>" + $.i18n.get("kssj") + "</th>");
				t_html.push("<th width='20%'>" + $.i18n.get("mxdx") + "</th>");
				t_html.push("<th width='8%'>" + $.i18n.get("jxfs") + "</th>");
				t_html.push("<th width='8%'>" + $.i18n.get("ylrl") + "</th>");
				t_html.push("<th width='14%'>" + $.i18n.get("bzyddrs") + "</th>");
				t_html.push("<th width='12%'>" + $.i18n.get("syddrs") + "</th>");
				t_html.push("<th width='15%'>" + $.i18n.get("cz") + "</th>");
				t_html.push("</tr></thead><tbody id='tbody_"+mdA.kcdm+"_"+mdA.rn+"'>");
				t_html.push("</tbody></table></div></div>");
			}
			//$("#more").show();//显示查看更多
			if(jspage=="0"){
				t_html.push("<div class='clearfix' id='left_clearfix'></div>");
				t_html.push("</div>");
				$("#contentBox").html(t_html.join(""));
				loadJxbxxZzxk($(".kc_head").eq(0));//加载第一门课程数据
				$(".tjxk_list .panel-heading .expand_close").eq(0).removeClass('expand1').addClass('close1');
				$(".tjxk_list .panel-body").eq(0).show();
				//$("#jspage").val("10");
				$("#globJsPage").val("0");
		        $("#isEnd").val("false");
			}else{
				$("#left_clearfix").before($(t_html.join("")));
			}
			if((parseInt(js_kcrow)-parseInt(ks_kcrow)+1)<step){
				$("#isEnd").val("true");
				$("#endsign").show();
				$("#more").hide(); //关闭查看更多
			}else{
				$("#more").show();
			}
			$("#jspage").val(parseInt(jspage)+parseInt(step));
		}else{
			if($("#jspage").val()=="0"){
				$("#isHaveResult").val("0");
				t_html.push("<div class='clearfix'></div>");
				t_html.push("<div class='panel panel-info'>");
				t_html.push("<div class='panel-heading'>&nbsp;</div>");
				t_html.push("<div class='panel-body'>");
				t_html.push("<div class='nodata'><span>" + $.i18n.get("msg_wkxkc") + "</span></div>");
				t_html.push("</div>");
				t_html.push("</div>");
				$("#contentBox").html(t_html.join(""));
				$("#more").hide(); //关闭查看更多
			}else{
				$("#more").hide(); //关闭查看更多
				$("#isEnd").val("true");
				$("#endsign").show();
			}
		}
	}
	
	function showTeacherInfo(xkkh,jszgh){
		/*$.showDialog(_path+'/xkgl/common_cxJsxxModel.html','教师简介',$.extend({},viewConfig,
				{width: ($("#yhgnPage").innerWidth()-400)+"px",data: {'dm':jszgh}}
		));*/
		//(2015-2016-2)-20189010-0013203-1
		var paramData = {
			xn: xkkh.substring(1,10),
			xq: xkkh.substring(11,12),
			kcdm: xkkh.substring(14,22),
			//jszgh: xkkh.substring(23,30),
			jszgh:jszgh,
			jxrl: xkkh.substring(1,10) + xkkh.substring(11,12)
				+ xkkh.substring(14,22) + xkkh.substring(23,30)
		}
		$.showDialog(_path+'/xsxk/zzxkghb_cxJsjj.html', $.i18n.get("jsjj"),$.extend({},viewConfig,
				{width: ($("#yhgnPage").innerWidth()-400)+"px",data: paramData}
		));
	}

	function showCourseInfo(kcdm){
		var event = $.event.get();
		event.stopPropagation();
		$.showDialog(_path+'/xsxk/zzxkghb_cxKcjj.html',$.i18n.get("kcjj"),$.extend({},viewConfig,
				{width:($("#yhgnPage").innerWidth()-400)+"px",data:{'kcdm':kcdm}}
		));
	}
	
	function loadJxbxxZzxk(obj){
		if($(obj).children(".expand_close").attr("class").indexOf("expand1")>0){ 
			var kcdm = $(obj).find("input[name='kcdm']").val();
			var xkkh = $(obj).find("input[name='p_xkkh']").val();
			if(kcdm=="00000000"){
				var dl = $("#current_dl").val();
				var jxjhh = $("#nj").val() + $("#zydm").val();
				if(dl=="zx" || dl=="fx"){
					jxjhh = $("#kdl_nj").val() + $("#kdl_zydm").val();
				}
				$.showDialog(_path+'/xsxk/zzxkghb_cxZzxkGhbXzBklx.html',$.i18n.get("bkxz"),$.extend({},addConfig,{
						width: ($("#yhgnPage").innerWidth()-600)+"px",
						data: {"xkkh":xkkh,"jxjhh":jxjhh},
						modalName:"addModal",
						buttons:{
							success : {
								label : $.i18n.get("btn_xd"),
								className : "btn-primary",
								callback : function() {
									if($("#bkdm").val()==null || $("#bkdm").val()==""){
										$.alert($.i18n.get("msg_qxzbk"));
										return false;
									}
									xkkh = "6"+$("#xn").val()+$("#xq").val()+$("#kdl_nj").val()+$("#yydj").val()+$("#bkdm").val();
									subLoadJxbxxZzxk(obj,xkkh,"special");
								}
							},
							cancel : {
								label : $.i18n.get("btn_gb"),
								className : "btn-default"
							}
						}
					}
				));
			}else{
				subLoadJxbxxZzxk(obj,xkkh,"normal");
			}
		}
	}
	
	//查询参数
	function paramMap(obj,xkkh){
		var dl = $("#current_dl").val();
		var map = {};
		map["dl"] = dl;
		map["xn"] = $("#xn").val();
		map["xq"] = $("#xq").val();
		map["kcdm"] = $(obj).find("input[name='kcdm']").val();
		map["xkkh"] = xkkh;
		map["ylxs"] = $("#ylxs").val();
		if(dl=="xk_9"){
			map["xnxq"] = "("+$("#xn").val()+"-"+$("#xq").val()+")-";
			map["cx_cxlb_1"] = $("#cx_cxlb_1").val();
			map["cx_cxgx_1"] = $("#cx_cxgx_1").val();
			map["cx_cxnr_1"] = $("#cx_cxnr_1").val();
			map["cx_xingq_1"] = $("#cx_xingq_1").val();
			map["cx_kclb_1"] = $("#cx_kclb_1").val();
			map["cx_sjd_1"] = $("#cx_sjd_1").val();
			map["cx_zbgx"] = $("input:checkbox[name='cx_zbgx']:checked").val();
			map["cx_cxlb_2"] = $("#cx_cxlb_2").val();
			map["cx_cxgx_2"] = $("#cx_cxgx_2").val();
			map["cx_cxnr_2"] = $("#cx_cxnr_2").val();
			map["cx_xingq_2"] = $("#cx_xingq_2").val();
			map["cx_kclb_2"] = $("#cx_kclb_2").val();
			map["cx_sjd_2"] = $("#cx_sjd_2").val();
			map["cx_ylcx"] = $("#cx_ylcx").prop("checked")?"1":"0";
		}
		return map;
	}
	
	//加载某门课程的教学班
	function subLoadJxbxxZzxk(obj,xkkh,czlx){
		var czzt = $(obj).find("input[name='czzt']").val();
		if(czzt=="0" || czlx=="special"){
			var dl = $("#current_dl").val();
			var rn = $(obj).find("input[name='rn']").val();
			$.ajaxSetup({async:false});
			$.post(
				_path+"/xsxk/zzxkghb_cxZzxkGhbJxbList.html",
				paramMap(obj,xkkh),
				function(data){
					setTimeout(function(){
						var s_html = [];
						var ish = 0;
						var kcdm = $(obj).find("input[name='kcdm']").val();
						if(data!=null && data.length>0){
							for(var i=0; i<data.length; i++){
								if(i==0){
									$("#current_tab").val(data[i].tabname);
								}
								var bxddrs = 0;
								var syddrs = 0;
								if(data[i].yxrs!=null){
									bxddrs = data[i].yxrs.split("~")[0];
									syddrs = data[i].yxrs.split("~")[1];
								}
								s_html.push("<tr id='tr_"+data[i].xkkh+"' class='body_tr'>");
								s_html.push("<td style='display:none' class='xkkh'>"+data[i].xkkh+"</td>");
								s_html.push("<td class='jsxm' nowrap=''><a href='javascript:void(0);' onclick=showTeacherInfo('"+data[i].xkkh+"','"+data[i].jszgh+"')>"+data[i].jsxm+"</a></td>");
								//s_html.push("<td class='jsxm' nowrap=''><a href='"+_kcjsjjPath+"/html_js/"+data[i].jszgh+".html'>"+data[i].jsxm+"</a></td>");
								
								//s_html.push("<td class='zxs' nowrap=''>"+data[i].zxs+"</td>");
								s_html.push("<td class='xxq' nowrap=''>"+data[i].xxq+"</td>");
								s_html.push("<td class='sksj' nowrap='nowrap' style='text-align:left'>"+data[i].sksj+"</td>");
								s_html.push("<td class='skdd' nowrap='nowrap'>"+data[i].skdd+"</td>");
								s_html.push("<td class='kssj' nowrap='nowrap'>"+data[i].kssj+"</td>");
								s_html.push("<td class='mxdx'>"+data[i].mxdx+"</td>");
								s_html.push("<td class='jxfs'>"+data[i].jxfs+"</td>");
								s_html.push("<td class='rsxx'>"+data[i].rs+"</td>");
								s_html.push("<td class='bxdd'>"+bxddrs+"</td>");
								s_html.push("<td class='sydd'>"+syddrs+"</td>");
								s_html.push("<td class='an'>");
								s_html.push("<input type='hidden' name='sfxz' value='"+data[i].sfxz+"'>");
								if(data[i].sfxz=="1"){
									s_html.push("<button class='btn btn-danger btn-sm tuike' data-xkkh='"+data[i].xkkh+"' data-tabname='"+data[i].tabname+"' data-kcdm='"+kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
								}else{
									s_html.push("<button class='btn btn-primary btn-sm xuanke' data-xkkh='"+data[i].xkkh+"' data-tabname='"+data[i].tabname+"' data-kcdm='"+kcdm+"' type='button'>" + $.i18n.get("xk") + "</button>");
								}
								if(dl=="xk_7"){
									if(data[i].sfxz=="2"){
										ish = 1;
										s_html.push("<button style='margin-left:8px' class='btn btn-danger btn-sm tuike_bk' data-xkkh='"+data[i].xkkh+"' data-tabname='jxrwbview' data-kcdm='"+kcdm+"' type='button'>" + $.i18n.get("tk") + "</button>");
									}else{
										s_html.push("<button style='margin-left:8px' class='btn btn-primary btn-sm xuanke_bk' data-xkkh='"+data[i].xkkh+"' data-tabname='jxrwbview' data-kcdm='"+kcdm+"' type='button'>" + $.i18n.get("bk") + "</button>");
									}
								}
								s_html.push("</td>");
								s_html.push("</tr>");
								$("#tbody_"+kcdm+"_"+rn).append(s_html.join(""));
								if(ish==1){
									$("#tbody_"+kcdm+"_"+rn).find("tr").each(function(index,item){
										if($(item).find(".an .tuike_bk").length==0){
											$(item).find(".an .xuanke_bk").addClass("btn-h").removeClass("xuanke_bk");
										}
									});
								}
								s_html = [];
							}
							$(obj).find("input[name='czzt']").val("1");
						}else{
							s_html.push("<tr>");
							s_html.push("<td colspan='12'>");
							s_html.push("<div class='nodata' style='height:30px'><span>" + $.i18n.get("msg_wkxjxb") + "</span></div>");
							s_html.push("</td>");
							s_html.push("</tr>");
							$("#tbody_"+kcdm+"_"+rn).html(s_html.join(""));
							s_html = [];
						}
					},1); 
				},'json');
			$.ajaxSetup({async:true});
		}
	}
	
	
	//在浮动框添加选课信息
	function appendChoosedHtml(t_kcdm,xkkh,tabname,czlx){
		var kcdm=null;
		var kcmc=null;
		var isktk = "1";
		var trObj = $("#tr_"+$.convertID(xkkh));
		var t_kcmc = $("#kcmc_"+t_kcdm).text();
		//var kcxzzt = $("#kcxzzt_"+kcdm).val(); //课程选中状态
		var kcxzzt = "0";
		var kcxf = $("#xf_"+t_kcdm).text();
		var currentDl = $("#current_dl").val();
		var zypx = 0;
		var s_html = [];
		if((t_kcdm+"").substring(0,2)=="40"){
			kcdm = "tyk";
			kcmc = "(tyk)" + (_localeKey == "en_US" ? "Physical Education" : "体育课") + " - "+t_kcmc.split("-")[1];
		}else{
			kcdm = t_kcdm;
			kcmc = t_kcmc;
		}
		if(czlx=="bkxk"){
			var tableName=trObj.find(".an button").eq(0).data("tabname");
			//trObj.find(".an .xuanke_bk").remove();
			//trObj.find(".an").append("<button style='margin-left:8px' class='btn btn-danger btn-sm tuike_bk' data-xkkh='"+xkkh+"' data-tabname='jxrwbview' data-kcdm='"+t_kcdm+"' type='button'>退考</button>");
			trObj.find(".an").html("<button class='btn btn-primary btn-sm xuanke' data-xkkh='"+xkkh+"' data-tabname='"+tableName+"' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("xk") + "</button><button style='margin-left:8px' class='btn btn-danger btn-sm tuike_bk' data-xkkh='"+xkkh+"' data-tabname='jxrwbview' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
			trObj.parent().find("tr").each(function(index,item){
				var currentXkkh = $(item).find(".xkkh").text();
				if(currentXkkh!=xkkh){
					$(item).find(".an .xuanke_bk").addClass("btn-h").removeClass("xuanke_bk");
				}
			});
		}else if(currentDl=="xk_7" && czlx=="xk"){
			//trObj.find(".an .xuanke").remove();
			//trObj.find(".an .tuike_bk").before("<button class='btn btn-danger btn-sm tuike' data-xkkh='"+xkkh+"' data-tabname='"+tabname+"' data-kcdm='"+t_kcdm+"' type='button'>退选</button>");
			trObj.find(".an").html("<button class='btn btn-danger btn-sm tuike' data-xkkh='"+xkkh+"' data-tabname='"+tabname+"' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button><button style='margin-left:8px' class='btn btn-primary btn-sm btn-h' data-xkkh='"+xkkh+"' data-tabname='jxrwbview' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("bk") + "</button>");
			trObj.parent().find("tr").each(function(index,item){
				if($(item).find(".an .tuike_bk").length==1){
					$("#right_"+t_kcdm).remove();
					var choosedCount = $("#choosedCount").text();
					$("#choosedCount").text(parseInt(choosedCount)-1);
					$(item).find(".an .tuike_bk").remove();
					$(item).find(".an").append("<button style='margin-left:8px' class='btn btn-primary btn-sm btn-h' type='button'>" + $.i18n.get("bk") + "</button>");
				}
				$(item).find(".an .xuanke_bk").addClass("btn-h").removeClass("xuanke_bk");
			});
		}else{
			trObj.find(".an").html("<button class='btn btn-danger btn-sm tuike' data-xkkh='"+xkkh+"' data-tabname='"+tabname+"' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
		}
		
		$("#zt_txt_"+t_kcdm).html($.i18n.get("zt") + "：<b>" + $.i18n.get("yx") + "</b>");
		$(".kc_head_"+t_kcdm).attr("style","background-color:#fff7b2;");
		
		if($("#right_"+kcdm).length>0){
			kcxzzt = "1";
		}
		if(kcxzzt=="0"){
			zypx = 1;
			s_html.push("<div id='right_"+kcdm+"' class='outer_xkxx_list'>");
			s_html.push("<h6>");
			s_html.push("<span style='white-space:nowrap;'>");
			if($("#xxkbj_"+t_kcdm).val()=="1"){
				s_html.push("<font color='red'>【" + $.i18n.get("yyxyq") + "】</font>");
			}
			if(czlx=="bkxk"){
				s_html.push("<font color='red'>【" + $.i18n.get("bk") + "】</font>");
			}
			s_html.push("<a href='javascript:void(0)' title='" + kcmc + "' class='jump'>"+kcmc+"</a>");
			s_html.push("</span>");
			s_html.push("<span class='pull-right'></span></h6>");
			s_html.push("<table class='right_table_head'><thead>");
			s_html.push("<td class='h_num'>" + $.i18n.get("zhiyuan") + "</td><td class='arraw-px'>" + $.i18n.get("px") + "</td><td class='h_sxbj'>" + $.i18n.get("xsf") + "</td><td class='h_teacher'>" + $.i18n.get("jiaoshi") + "</td><td class='h_zxs'>" + $.i18n.get("zxs") + "</td><td class='h_xxq'>" + $.i18n.get("xq") + "</td><td class='h_time'>" + $.i18n.get("sksj") + "</td><td class='h_addr'>" + $.i18n.get("skdd") + "</td><td class='h_cz'>" + $.i18n.get("cz") + "</td></thead></table>");
			s_html.push("<ul id='right_ul_"+kcdm+"' class='list-group'>");
			if(currentDl != "xk_8"){
				s_html.push("<input type='hidden' name='right_kcdm' value='"+kcdm+"'/>");
				s_html.push("<input type='hidden' name='right_xf_"+kcdm+"' value='"+kcxf+"'/>");
			}
			if(czlx!="bkxk"){
				$("#xf9").text(parseFloat($("#xf9").text())+parseFloat(kcxf));
			}
			$("#choosedCount").text(parseFloat($("#choosedCount").text())+1);
		}else{
			zypx = $("#right_ul_"+kcdm).find("li").length+1;
		}
		
		s_html.push("<li id='right_"+xkkh+"' class='list-group-item'>");
		s_html.push("<div class='item' style='cursor: pointer;'>");
		s_html.push("<table width='100%'><tr>");
		s_html.push("<td><p class='num'>"+zypx+"</p></td>");
		s_html.push("<td class='arraw-px'><a class='fa fa-arrow-up padding-lr10' href='javascript:void(0);'></a><br><a class='fa fa-arrow-down padding-lr10' href='javascript:void(0);'></a></td>");
		s_html.push("<td><p class='sxbj'>");
		//这里无论怎样都是待筛选
		s_html.push("<font color='red'><i>" + $.i18n.get("dsx") + "</i></font>");
		s_html.push("</p></td>");
		s_html.push("<td><p class='teachers popover-demo'>");
		if(kcdm=="tyk"){
			s_html.push(trObj.find(".jsxm a").html()+"<br/>["+$("#kcmc_"+t_kcdm).find("a").text()+"]");
		}else{
			s_html.push(trObj.find(".jsxm a").html());
		}
		s_html.push("</p></td>");
		s_html.push("<td><p class='zxs'>"+$("#zxs_"+t_kcdm).text()+"</p></td>");
		s_html.push("<td><p class='xxq'>"+trObj.find(".xxq").html()+"</p></td>");
		s_html.push("<td><p class='time'>"+trObj.find(".sksj").html()+"</p></td>");
		s_html.push("<td><p class='addr'>"+trObj.find(".skdd").html()+"</p></td>");
		//s_html.push("<td><p class='xksj'>"+trObj.find(".xksj").text()+"</p></td>");
		s_html.push("<td><p class='but'>");
		if(isktk=="1" && czlx=="bkxk"){
			s_html.push("<button class='btn btn-danger btn-sm tuike_bk' data-xkkh='"+xkkh+"' data-tabname='jxrwbview' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
		}else if(isktk=="1"){
			s_html.push("<button class='btn btn-danger btn-sm tuike' data-xkkh='"+xkkh+"' data-tabname='"+tabname+"' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
		}else{
			s_html.push("<span style='font-size:15px;color:#428BCA;'><b>" + $.i18n.get("yx") + "</b></span>");
		}
		s_html.push("</p></td>");
		s_html.push("</tr>");
		s_html.push("</table>");
		s_html.push("</div>");
		s_html.push("<input type='hidden' name='right_xkkh' value='"+xkkh+"'>");
		if((t_kcdm+"").substring(0,2)=="40"){
			s_html.push("<input type='hidden' name='right_kcdm' value='"+t_kcdm+"'/>");
			s_html.push("<input type='hidden' name='right_xf_"+t_kcdm+"' value='"+kcxf+"'/>");
		}
		s_html.push("</li>");
		
		if(kcxzzt=="0"){
			s_html.push("</ul></div>");
		}
		if(kcxzzt=="0"){//该课程结点不存在
			var beforeLastSelectKcJd = "0";	//选中教学班对应课程前面最近一个被选中的课程
			var afterFirstSelectKcJd = "0";	//选中教学班对应课程后面最近一个被选中的课程
			$("input[name='right_kcdm']").each(function(index,item){
				var currentKcdm = $(item).val();
				if(currentKcdm+"" < kcdm+""){
					beforeLastSelectKcJd = currentKcdm;
				}
				if(currentKcdm+"" > kcdm+"" && afterFirstSelectKcJd == 0){
					afterFirstSelectKcJd = currentKcdm;
				}
			});
			if(beforeLastSelectKcJd != 0){//表示前面有被选中的课程，可以在此课程后添加新的课程结点
				if(beforeLastSelectKcJd.substring(0,2)=="40"){
					$("#right_tyk").after(s_html.join(""));
				}else{
					$("#right_" + beforeLastSelectKcJd).after(s_html.join(""));
				}
			}else if(afterFirstSelectKcJd != 0){//由于学分结点存在，故一定存在课程，如果该课程不在当前被选中课程的前面，就一定在当前被选中课程的后面
				if(afterFirstSelectKcJd.substring(0,2)=="40"){
					$("#right_tyk").before(s_html.join(""));
				}else{
					$("#right_" + afterFirstSelectKcJd).before(s_html.join(""));
				}
			}else{
				$(".right_div").html(s_html.join(""));
			}
		}else{
			$("#right_ul_"+kcdm).append(s_html.join(""));
			//$("#right_"+kcdm).find(".pull-right").html("<font color='red'>" + $.i18n.get("sbtdpzy") + "</font>");
			var $pullright = $("#right_"+kcdm).find(".pull-right");
			$pullright.html("<font color='red'>" + $.i18n.get("sbtdpzy") + "</font>");
			if ($pullright.width() > 0) {
				var spanWidth = ($pullright.parent().width() - $pullright.width()) + "px";
				$pullright.prev().css({"float":"left", "width":spanWidth, 
					"overflow":"hidden", "text-overflow":"ellipsis"});
			}
		}
		//识别终端确定是否显示排志愿的箭头
		if(isWebApp){
			$(".arraw-px").css("display","none");
		}else{
		    $(".arraw-px").css("display","");
		}
		if($.fn.dragsort){
			myDragsort();
		}
	}
	
	//在浮动框移除选课信息
	function removeChoosedHtml(t_kcdm,xkkh,tabname,czlx){
		var trObj = $("#tr_"+$.convertID(xkkh));
		var kcdm = t_kcdm;
		if((t_kcdm+"").substring(0,2)=="40"){
			kcdm = "tyk";
		}
		var kcxf = $("input[name='right_xf_"+t_kcdm+"']").val();
		var iskxk="1";
		if(iskxk=="1" && czlx=="bktk" && $.founded(trObj)){
			trObj.find(".an .tuike_bk").remove();
			trObj.find(".an").append("<button style='margin-left:8px' class='btn btn-primary btn-sm xuanke_bk' data-xkkh='"+xkkh+"' data-tabname='jxrwbview' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("bk") + "</button>");
			trObj.parent().find("tr").each(function(index,item){
				var currentXkkh = $(item).find(".xkkh").text();
				if(currentXkkh!=xkkh){
					$(item).find(".an .btn-h").addClass("xuanke_bk").removeClass("btn-h");
				}
			});
		}else if(iskxk=="1" && czlx!="bktk" && $.founded(trObj)){
			if(trObj.find(".an").find(".tuike").length==1){
				trObj.find(".an").find(".tuike").addClass("btn-primary").removeClass("btn-danger").addClass("xuanke").removeClass("tuike").text($.i18n.get("xk"));
			}else{
				trObj.find(".an").html("<button class='btn btn-primary btn-sm xuanke' data-xkkh='"+xkkh+"' data-tabname='"+tabname+"' data-kcdm='"+t_kcdm+"' type='button'>" + $.i18n.get("xk") + "</button>");
			}
		}else if($.founded(trObj)){
			trObj.find(".an").html("<span style='font-size:15px;color:red;'><b>" + $.i18n.get("jx") + "</b></span>");
		}else{
			//该课程未显示在页面上，故无操作
		}
		$("#right_"+$.convertID(xkkh)).remove();//移除浮动框中的对应教学班
	
		if(kcdm=="tyk"){
			if($("input[name='right_kcdm'][value='"+t_kcdm+"']").size()==0){
				$("#zt_txt_"+t_kcdm).html($.i18n.get("zt") + "：" + $.i18n.get("wx"));
				$(".kc_head_"+t_kcdm).attr("style","background-color:#d9edf7;");
			}
		}
		
		if($("#right_ul_"+kcdm).find("li").length==0){//如果指定课程不存在被选中的教学班
			//$("#kcxzzt_"+t_kcdm).val("0");//将课程的选中状态置为0
			$("#zt_txt_"+t_kcdm).html($.i18n.get("zt") + "：" + $.i18n.get("wx"));
			$(".kc_head_"+t_kcdm).attr("style","background-color:#d9edf7;");
			$("#right_"+kcdm).remove();//浮动框中课程结点移除
			if(czlx!="bktk"){
				$("#xf9").text(parseFloat($("#xf9").text())-parseFloat(kcxf));
			}
			$("#choosedCount").text(parseFloat($("#choosedCount").text())-1);
		}else if($("#right_ul_"+kcdm).find("li").length==1){
			var $pullright = $("#right_"+kcdm).find(".pull-right");
			$pullright.text("");
			$pullright.prev().css({"float":"", "width":"", 
					"overflow":"", "text-overflow":""});
		}
		reSort();
	}
	
	//加载学生已选教学班
	function loadChoosedCourse(){
		$.ajaxSetup({async:false});
		$.post(
			_path+"/xsxk/zzxkghb_cxZzxkGhbChoosed.html",
			{"xn":$("#xn").val(),"xq":$("#xq").val()},
			function(data){
				setTimeout(function(){
					if(data!=null){
						var rightKcdm = null;
						var s_html = [];
						for(var i=0; i<data.length; i++){
							var modelA = data[i];
							var modelB = null;
							if(i<data.length-1){
								modelB = data[i+1];
							}
							if(rightKcdm!=modelA.kcdm){
								rightKcdm = modelA.kcdm;
								s_html.push("<div id='right_"+rightKcdm+"' class='outer_xkxx_list'>");
								s_html.push("<h6>");
								s_html.push("<span style='white-space:nowrap;'>");
								if(modelA.xxkbj=="1"){
									s_html.push("<font color='red'>【" + $.i18n.get("yyxyq") + "】</font>");
								}
								if(modelA.jxbly=="2"){
									s_html.push("<font color='red'>【" + $.i18n.get("bk") + "】</font>");
								}
								s_html.push("<a href='javascript:void(0)' title='("+modelA.kcdm+")"+modelA.kcmc+"-"+modelA.xf + $.i18n.get("xf")+"' class='jump'>"
									+ "("+modelA.kcdm+")"+modelA.kcmc+"-"+modelA.xf + $.i18n.get("xf") + "</a>");
								s_html.push("</span>");
								s_html.push("<span class='pull-right'></span></h6>");
								s_html.push("<table class='right_table_head'><thead>");
								s_html.push("<td class='h_num'>" + $.i18n.get("zhiyuan") + "</td><td class='arraw-px'>" + $.i18n.get("px") + "</td><td class='h_sxbj'>" + $.i18n.get("xsf") + "</td><td class='h_teacher'>" + $.i18n.get("jiaoshi") + "</td><td class='h_zxs'>" + $.i18n.get("zxs") + "</td><td class='h_xxq'>" + $.i18n.get("xq") + "</td><td class='h_time'>" + $.i18n.get("sksj") + "</td><td class='h_addr'>" + $.i18n.get("skdd") + "</td><td class='h_cz'>" + $.i18n.get("cz") + "</td></thead></table>");
								s_html.push("<ul id='right_ul_"+rightKcdm+"' class='list-group'>");
								if(rightKcdm != "tyk"){
									s_html.push("<input type='hidden' name='right_kcdm' value='"+rightKcdm+"'/>");
									s_html.push("<input type='hidden' name='right_xf_"+rightKcdm+"' value='"+modelA.xf+"'/>");
								}
							}
	
							/************加单个课程对应的教学班信息************(开始)************/
							var isktk = "1";
							s_html.push("<li id='right_"+modelA.xkkh+"' class='list-group-item'>");
							s_html.push("<div class='item' style='cursor: pointer;'>");
							s_html.push("<table width='100%'><tr>");
							s_html.push("<td><p class='num'>"+modelA.xkzy+"</p></td>");
							s_html.push("<td class='arraw-px'><a class='fa fa-arrow-up padding-lr10' href='javascript:void(0);'></a><br><a class='fa fa-arrow-down padding-lr10' href='javascript:void(0);'></a></td>");
							s_html.push("<td><p class='sxbj'>");
							if(modelA.sxbj=="1"){
								s_html.push("<font color='blue'>" + $.i18n.get("yxs") + "</font>");
							}else{
								s_html.push("<font color='red'><i>" + $.i18n.get("dsx") + "</i></font>");
							}
							s_html.push("</p></td>");
							s_html.push("<td><p class='teachers popover-demo'>"+modelA.jsxm+"</p></td>");
							s_html.push("<td><p class='zxs'>"+modelA.zxs+"</p></td>");
							s_html.push("<td><p class='xxq'>"+modelA.xxq+"</p></td>");
							s_html.push("<td><p class='time'>"+modelA.sksj+"</p></td>");
							s_html.push("<td><p class='addr'>"+modelA.skdd+"</p></td>");
							//s_html.push("<td><p class='xksj'>"+modelA.xksj+"</p></td>");
							s_html.push("<td><p class='but'>");
							if(isktk=="1" && modelA.jxbly=="2"){
								s_html.push("<button class='btn btn-danger btn-sm tuike_bk' data-xkkh='"+modelA.xkkh+"' data-tabname='jxrwbview' data-kcdm='"+modelA.t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
							}else if(isktk=="1" && modelA.jxbly!="2"){
								s_html.push("<button class='btn btn-danger btn-sm tuike' data-xkkh='"+modelA.xkkh+"' data-tabname='"+modelA.tabname+"' data-kcdm='"+modelA.t_kcdm+"' type='button'>" + $.i18n.get("tx") + "</button>");
							}else{
								s_html.push("<span style='font-size:15px;color:#428BCA;'><b>" + $.i18n.get("yx") + "</b></span>");
							}
							s_html.push("</p></td>");
							s_html.push("</tr>");
							s_html.push("</table>");
							s_html.push("</div>");
							s_html.push("<input type='hidden' name='right_xkkh' value='"+modelA.xkkh+"'>");
							if(rightKcdm == "tyk"){
								s_html.push("<input type='hidden' name='right_kcdm' value='"+modelA.t_kcdm+"'/>");
								s_html.push("<input type='hidden' name='right_xf_"+modelA.t_kcdm+"' value='"+modelA.xf+"'/>");
							}
							s_html.push("</li>");
							/************加单个课程对应的教学班信息************(结束)************/
	
							if(modelB==null || modelB.kcdm != modelA.kcdm){
								s_html.push("</ul></div>");
								$(".right_div").append(s_html.join(""));
								s_html = [];
							}
						}
	
						//识别终端确定是否显示排志愿的箭头
						if(isWebApp){
							$(".arraw-px").css("display","none");
						}else{
						    $(".arraw-px").css("display","");
						}
						//添加可能存在的提示信息
						$(".outer_xkxx_list").each(function(index,item){
							if($(item).find("ul li").length>1){
								var $pullright = $(item).find(".pull-right");
								$pullright.html("<font color='red'>" + $.i18n.get("sbtdpzy") + "</font>");
								if ($pullright.width() > 0) {
									var spanWidth = ($pullright.parent().width() - $pullright.width()) + "px";
									$pullright.prev().css({"float":"left", "width":spanWidth, 
										"overflow":"hidden", "text-overflow":"ellipsis"});
								}								
							}
						});
						if($.fn.dragsort){
							myDragsort();
						}
					}
				},1); 
			},'json');
		$.ajaxSetup({async:true});
	}
	
	
	
	//客户端类型识别(是否是PC机)
	function isPc(){
		var isPc = true;
		var sUserAgent= navigator.userAgent.toLowerCase(); 
		var bIsIpad= sUserAgent.match(/ipad/i) == "ipad"; 
		var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os"; 
		var bIsMidp= sUserAgent.match(/midp/i) == "midp"; 
		var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"; 
		var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb"; 
		var bIsAndroid= sUserAgent.match(/android/i) == "android"; 
		var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce";
		var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile"; 
		if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) { 
			isPc = false; 
		}
		return isPc;
	}
	
	function myDragsort(){
		$(".list-group").each(function(){
			$(this).dragsort("destroy");
			$(this).dragsort({
				dragSelector: "li", 
				dragBetween: false, 
				dragEnd: saveOrder, 
				placeHolderTemplate: "<li class='list-group-item'><div></div></li>",
				scrollSpeed: 5
			});
		});	
	}
	
	function saveOrder() {
		var zypxs = [];
		var xkkhs = [];
		$(".list-group").each(function(index,item){
			$(item).find("li").each(function(index1,item1){
				if((index1+1)!=parseInt($(item1).find(".num").text())){
					//alert((index1+1)+"=="+$(item1).find(".num").text());
					zypxs.push(index1+1);
					xkkhs.push($(item1).find("input[name='right_xkkh']").val());
				}
			});
		});
		//alert(xkkhs.join(","));
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkghb_xkBcZypxZzxkGhb.html",
			{zypxs:zypxs.join(","),xkkhs:xkkhs.join(",")},
			function(data){
				setTimeout(function(){
					if(data=="success"){
						reSort();
					}else{
						$.alert($.i18n.get("msg_pzysb"));
					}
				},1); 
			},'json');
		$.ajaxSetup({async:true});
	}
	
	function reSort(){
		$(".list-group").each(function(index,item){
			$(item).find("li").each(function(index1,item1){
				if((index1+1)!=parseInt($(item1).find(".num").text())){
					$(item1).find(".num").text(index1+1);
				}
			});
		});
	}

	function reflushRs(xkkh,tabname){
		var kcdm = xkkh.substring(14,22);
		var p_xkkh = $(".kc_head_"+kcdm).find("input[name='p_xkkh']").val();
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkghb_cxRsZzxkGhb.html",
			{
				xkkh:xkkh,
				tabname:tabname,
				hxwz:p_xkkh.substring(0,1),
				ylxs:$("#ylxs").val()
			},
			function(data){
					if(data!=null){
						$("#tr_"+$.convertID(xkkh)).find(".rsxx").text(data.RS);
						$("#tr_"+$.convertID(xkkh)).find(".bxdd").text(data.YXRS.split("~")[0]);
						$("#tr_"+$.convertID(xkkh)).find(".sydd").text(data.YXRS.split("~")[1]);
					}
			},'json');
		$.ajaxSetup({async:true});
	}
