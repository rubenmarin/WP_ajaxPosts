<?php  
class _ajaxprevnext{
	function __construct(){
		add_action('wp_ajax_batarangposts' , array(&$this , 'getPosts'));
		add_action('wp_ajax_nopriv_batarangposts' , array(&$this , 'getPosts'));
		add_action('wp_enqueue_scripts' , array(&$this , 'scripts') , 100);
	}
	function scripts(){
		wp_register_script( 'batarang-script' , get_template_directory_uri() . "/ajaxprevnext/assets/js/script.js", $deps = array(), $ver = '1', $in_footer = true );

		
		global $wp;
		$current_url = home_url(add_query_arg(array(),$wp->request));
		if( strpos( $current_url ,'/page/') !== false ):
			$current_url =  preg_replace("/\/page(.*)/i", '', $current_url );
		endif;
		wp_localize_script( 'batarang-script' , 'bataranglocal', array( 
			'ajaxurl'     => admin_url( 'admin-ajax.php'),
			'urlnopage'   => $current_url
			) );
		wp_enqueue_script(  'batarang-script' );
		
	}
	function getPosts(){
		
		if(!isset($_POST['paged'])):
			return;
		endif;
		$paged = $_POST['paged'];
		$query = array(
			'post_type'   		=> 'post',
			'post_status' 		=> 'publish',
			'orderby'     		=> 'date',
			'posts_per_page' 	=> get_option('posts_per_page'),
			'order'       		=> 'DESC',
			'paged'		  		=> $paged
		);
		$q = new WP_Query($query);
		ob_start();
			while ( $q->have_posts() ) : $q->the_post();
				get_template_part( 'contentblog' , get_post_format() );
			endwhile;
		$thePosts = ob_get_clean();
		$thePosts = str_replace('src="https"' , 'src="http"', $thePosts);
		$next = $paged + 1;
		$previous = $paged - 1;
		$res = array(
			'success' 	  =>	true,
			'more'		  =>  ( $q->max_num_pages > $paged ) ? true : false ,
			'maxnumpages' => $q->max_num_pages,
			'n' 	=> 	$next,
			'p'	=>	$previous,
			'posts' => 	$thePosts
		);
		echo  wp_json_encode( $res );
		wp_reset_query();
		wp_die();
	}

}
new _ajaxprevnext();
