(function($) {
	$(function() {//doc.ready[shorthand] start
	var batarang = {
		postsWrap      : $('#PostsAjaxWrapper'),
		nextlink       : '#ajaxNextPH',
		prevlink       : '#ajaxPrevPH',
		animationSpeed : 1000,
		urlPushState   : true,
		onclick : function(){
			$('.doAjaxPagination a').unbind('click');
			$('.doAjaxPagination a').on('click',function (e){
				e.preventDefault();
				
				var t = $(this);
				var paged = t.attr('data-paged');
				var next = false;
				var prev = false;
				
				t.parents('.doAjaxPagination').hide();
				$('#doajaxLoading').show();
				
				if(t.hasClass('ajax-next')){
					next = true;
				}else{
					prev = true;
				}
				batarang.ajax({
					't'		 : t,
					'_paged' : paged,
					'_next'  : next,
					'_prev'  : prev,
				});

			});
		},
		replacePosts : function(posts , animateReplace){
			postsWrap      = batarang.postsWrap;
			animationSpeed = batarang.animationSpeed;
			$('html , body').animate({ scrollTop: postsWrap.offset().top - 100 }, animationSpeed , function(){
				
				postsWrap.html( posts );
				setTimeout(function() {
					$('.doAjaxPagination').removeAttr('style');
					$('#doajaxLoading').hide();	
				}, 1000);
				

				// var __posts = $(posts).hide();
				// var currentPosts = postsWrap.children();
				// var currentPostsLength = currentPosts.length;
				// currentPosts.each(function(i , e){
				// 	setTimeout(function() {
				// 		$(e).slideUp(300);
				// 		n = i + 1;
				// 		if(n == currentPostsLength ){
				// 			postsWrap.html(__posts); /* REPLACE POSTS */ 
				// 			var children = postsWrap.children();
				// 			children.each(function(i , e){
				// 				setTimeout(function() {
				// 					$(e).slideDown(750);
				// 				}, i * 500 );
				// 			});/* ANIMATE IN NEW POSTS */
				// 		}
				// 	}, i * 250 );
				// });/*HIDE OLD POSTS */
			});
		},
		ajax : function(link){
			postsWrap      = batarang.postsWrap;
			animationSpeed = batarang.animationSpeed;
			$.ajax({
				url: bataranglocal.ajaxurl,
				type: 'post',
				data: {
					action : 'batarangposts',
					paged : link._paged,
					prev : link._prev,
					next : link._next
				}
			}).done(function(res){
				res = JSON.parse(res);
					
					if( link._next ){
						link.t.attr('href' , bataranglocal.urlnopage + "/page/" + res.n + "/" );
						link.t.attr('data-paged' , res.n );
						
						/* REPLACE POSTS START */
						/* SCROLL TO TOP */
							setTimeout(function() {
								batarang.replacePosts( res.posts , true);
							}, 500);
							
						
						/* REPLACE POSTS END */
						//$('.doAjaxPagination').removeAttr('style');

						if(batarang.urlPushState == true ){
							history.pushState( { "pageurl" : bataranglocal.urlnopage + "/page/" + link._paged + "/" } , "", bataranglocal.urlnopage + "/page/" + link._paged + "/" );
						}
						
						
						if( link._paged == res.maxnumpages ){
							link.t.hide();
						}
						else{
							link.t.show();
						}
						if($(batarang.prevlink).children().length <= 0){
							$(batarang.prevlink).html('<a data-paged="'+res.p+'" href="'+bataranglocal.urlnopage + "/page/" + res.p + "/"+'">'+prevnextlabels.p+'</a>');
							batarang.onclick();
						}
						else{
							$(batarang.prevlink +' a').attr('href' , bataranglocal.urlnopage + "/page/" + res.p + "/" ).show();
							$(batarang.prevlink +' a').attr('data-paged' , res.p );
						}
					}
					else{
						link.t.attr('href' , bataranglocal.urlnopage + "/page/" + res.p + "/" );
						link.t.attr('data-paged' , res.p );
						
						/* REPLACE POSTS START */
						/* SCROLL TO TOP */
							setTimeout(function() {
								batarang.replacePosts( res.posts , true);
							}, 500);
						/* REPLACE POSTS END */
					
						//$('.doAjaxPagination').removeAttr('style');
						
						if( batarang.urlPushState == true ){
							if(link._paged == 1){
								history.pushState( { "pageurl" : bataranglocal.urlnopage + "/" } , "", bataranglocal.urlnopage + "/" );
							}
							else{
								history.pushState( { "pageurl" : bataranglocal.urlnopage + "/page/" + link._paged + "/" } , "", bataranglocal.urlnopage + "/page/" + link._paged + "/" );
							}	
						}
						if($(batarang.nextlink).children().length <= 0){
							$(batarang.nextlink).html('<a data-paged="'+res.n+'" href="'+bataranglocal.urlnopage + "/page/" + res.n + "/"+'">'+prevnextlabels.n+'</a>');
							batarang.onclick();
						}
						else{
							$(batarang.nextlink +' a').attr('href' , bataranglocal.urlnopage + "/page/" + res.n + "/" ).show();
							$(batarang.nextlink +' a').attr('data-paged' , res.n );
						}

						if( res.p <= 0 ){
							link.t.hide();
						}
						else{
							link.t.show();
						}
					}
			
			});
		},
	};
	batarang.urlPushState = false;
	batarang.onclick();


	});// end of doc.ready
})(jQuery);
console.log('batarang:ready');