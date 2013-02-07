/*! jQuery UI - v1.10.0 - 2013-01-17
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.slider.js, jquery.ui.sortable.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js
* Copyright (c) 2013 jQuery Foundation and other contributors Licensed MIT */
// 全屏的实现：
// 关键点一：在js里面应用screen.width;方法获取当前浏览器屏幕的分辨率的宽度；同理获取高度的方法为screen.height;这样就实现不同屏幕同样能实现全屏切换；
// 关键点二：在用到left.animate({marginLeft:+w},1000);这个方法时，切换后会有横向滚动条的；这时要在css样式定义定义属性overflow：hidden；在非ie6浏览器中只要对body{over：hidden；}就可以实现；
// 但在该死的ie6里面要加上html{overf：hidden；}才能兼容；
// 关 键点三：这个实例里面有四个div分别是：向左按钮（调用样式为clickleft），向右按钮（调用样式clickright），以及左边div（调用 样式left），右边div（调用样式right）；这四个div的相对位置要同个z-index属性来对它们的位置进行微妙的变化； 
$(function(){

	$('.outMain').fullscreen();

});

 
(function($) {  
  // plugin definition 
  $.fn.fullscreen = function(options) {  
    debug(this);  
    // build main options before element iteration  
    var opts = $.extend({}, $.fn.fullscreen.defaults, options);  
	
	opts.current_screen_num = 0;
	
	// 生成如下结构的html
	// <div id="nav">
	// 		<div id="prev">&larr; prev</div>
	// 		<ul id="indicator">
	// 			<li class="active">1</li>
	// 			<li>2</li>
	// 			<li>3</li>
	// 			<li>4</li>
	// 			<li>5</li>
	// 			<li>6</li>
	// 			<li>7</li>
	// 		</ul>
	// 		<div id="next">next &rarr;</div>
	// 	</div>
	function add_nav_div(screen_count_p){
		
		var prev_and_next_btn_css={
			'float':'left',
			'font-weight':'bold',
			'font-size':'14px',
			'padding':'5px 0',
			'width':'80px',
		}
		
		var nav_css = {
			width:'300px',
			'text-align':'center',
			position: 'absolute',
			bottom: '10px',
			left: '43%',
			'z-index': '20',
			display: 'block'
		}
		
		$('<div></div>',
			{  
			 	id:'nav',
				css:nav_css
			}
		 )
		.appendTo(document.body)
 		.append($('<div></div>',
 			{  
 			 	id:'prev',
 				css:prev_and_next_btn_css
 			}
 		 ))
 		.append($('<ul></ul>',
 			{  
 			 	id:'indicator'
 			}
 		 ))
		.append($('<div></div>',
			{  
			 	id:'next',
				css:prev_and_next_btn_css
			}
		 ));
		 
		 
		// $('#prev').html('&larr; prev');
		// 		$('#next').html('next &rarr;');
		
		for(var i = 0; i<screen_count_p; i++ ){
			console.log(i);
			$('<li>'+(i+1)+'</li>',
				{  
				 	id:'nav',
					'class':i==0?'active':''
				}
			 )
			 .appendTo(
				 $('#indicator')
			 );
		}
		
		$('#nav li :eq('+ 0 +')').addClass('active');
	}
	
	/**
	 * add left | right switch buttons
	 *
	 */

	 //<a href="#" class="clickleft">left</a>
	 //<a href="#" class="clickright">right</a>
	 
	function add_switch_button(){
		var left_btn_css={
		    display:'block',
		    'text-decoration':'none',
		    background:'#099',
		    position:'absolute',
		    'z-index':200,
		    color:'#FFF',
		    left:0,
			top:'40%'
		}
		
		var right_btn_css={
		    display:'block',
		    'text-decoration':'none',
		    background:'#09F',
		    position:'absolute',
		    'z-index':500,
		    color:'#FFF',
		    top:'40%',
		    right:0
		}
		
		 
		
		var dom = $('.outMain');
		
		$('<a></a>',
			{  
			 	id:'left_btn',
				href:"#",
				css:left_btn_css
			}
		 )
		.appendTo(dom);
		
		$('<a></a>',
			{  
			 	id:'right_btn',
				href:"#",
				css:right_btn_css,
			}
		 )
		 .appendTo(dom);

		 $('#left_btn').html('&larr; prev');
		 $('#right_btn').html('next &rarr;');
		 
		 //default
		 $('#left_btn').hide();
		 $('#right_btn').show();
	}
	
	/**
	 * 
	 * 
	 * 
	 */
	function add_switch_button_event(dom){
		 $('#left_btn').click(function(e){
 			set_screen_rect_with_dom_and_index(dom,opts.current_screen_num);
		
			if(dom,opts.current_screen_num == 0){
				$('#left_btn').hide();
				return;
			}else{
				opts.current_screen_num--;
			}
		 });
		
		 $('#right_btn').click(function(e){
			set_screen_rect_with_dom_and_index(dom,opts.current_screen_num);
		
			if(dom,opts.current_screen_num == (dom.find('.screen').length -1 ) ){
				$('#right_btn').hide();
				return;
			}else{
				opts.current_screen_num++;
			}
		 });
	}
	
	/**
	
	1,2,3,4,5,6,7,8
	cur_i = 3
	next = 4;
	*/
	function set_screen_rect_with_dom_and_index(dom,cur_index){
		var w=screen.width;
		//keep btn show
		$('#right_btn').show();
		$('#left_btn').show();
		
		dom.find('.screen').each(function(index){
			
			if(cur_index > index){
				$(this).css({
				    'text-align':'center',
				    position:'absolute',
				    'background-color':el_bg_color,
				    width:'100%',
				    height:'100%',
				    top:0,
				    left:0-w,
				    right:0,
				    bottom:0,
				    'z-index':1,
				});	
			}else{
				
				var el_margin_left = (index-cur_index) * w;
				var el_bg_color = index%2==0 ? '#fff' : '#CCC';
				
				
				
				console.log( cur_index +'-----'+el_margin_left );
				
				$(this).css({
				    'text-align':'center',
				    position:'absolute',
				    'background-color':el_bg_color,
				    width:'100%',
				    height:'100%',
				    top:0,
				    left:el_margin_left,
				    right:0,
				    bottom:0,
				    'z-index':1,
				});	
			}
			
			//console.log($(this));
		});	//end each 
		
		set_nav_status();
	}
	
	
	function set_screen_rect(dom){
		var w=screen.width;
		dom.find('.screen').each(function(index){
			var el_margin_left = index * w;
			var el_bg_color = index%2==0 ? '#fff' : '#CCC';
			
			$(this).css({
			    'text-align':'center',
			    position:'absolute',
			    'background-color':el_bg_color,
			    width:'100%',
			    height:'100%',
			    top:0,
			    left:el_margin_left,
			    right:0,
			    bottom:0,
			    'z-index':1,
			});	
		});	 
	}
	
	/*
	// 生成如下结构的html
	// <div id="nav">
	// 		<div id="prev">&larr; prev</div>
	// 		<ul id="indicator">
	// 			<li class="active">1</li>
	// 			<li>2</li>
	// 			<li>3</li>
	// 			<li>4</li>
	// 			<li>5</li>
	// 			<li>6</li>
	// 			<li>7</li>
	// 		</ul>
	// 		<div id="next">next &rarr;</div>
	// 	</div>
	
	*/
	function set_nav_status(){
		var index = opts.current_screen_num;
		$('#nav li').removeClass('active');
		$('#nav li :eq('+ index +')').addClass('active');
		
		log_info_dump();
	}
	
	
	function log_info_dump(){
		var index = opts.current_screen_num;
		$('#nav li').removeClass('active');
		$('#nav li :eq('+ index +')').addClass('active');
		
		$(this).find('.screen')
		
		var dom = $('.screen:eq('+ index +')');
		
		
		$('<div></div>',
			{  
			 	id:'div_log_'+index,
				css:{'background-color':'red'}
			}
		 )
		 .appendTo(dom);
		 
		 var str = 'current_screen_num='+index +'\n' +'count='+($('.outMain').find('.screen').length -1 );
		 console.log(str);
		 $('#div_log_'+index).html(str);
		 
	}
    // iterate and reformat each matched element  
    return this.each(function() {  
		$this = $(this);  
		
		var screen_count = $(this).find('.screen').length;
		//设置div的css。
		set_screen_rect($this);
		add_nav_div(screen_count);
		add_switch_button();
		
		setTimeout(function(){
			add_switch_button_event($this);
		},200);
		
		

		// build element specific options  
		var o = $.meta ? $.extend({}, opts, $this.data()) : opts;  
		// update element styles  
		// $this.css({  
		// 			backgroundColor: o.background,  
		// 			color: o.foreground  
		// 		});  
		var markup = $this.html();  
		// call our format function  
		markup = $.fn.fullscreen.format(markup);  
		$this.html(markup);  
    });  
  }; 
   
  // 私有函数：debugging  
  function debug($obj) {  
    if (window.console && window.console.log)  
      window.console.log('hilight selection count: ' + $obj.size());  
  };  
  
  // 定义暴露format函数  
  $.fn.fullscreen.format = function(txt) {  
    return '<strong>' + txt + '</strong>';  
  };  
  
  // 插件的defaults  
  $.fn.fullscreen.defaults = {  
    	foreground: 'red',  	
		background: 'yellow'  
  };  
// 闭包结束  
})(jQuery);   
