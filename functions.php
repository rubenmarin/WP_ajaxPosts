<?php

function prevnext__modify( $a , $attr = '' , $before = null , $after = null ){
	if(empty($a)) return;	
	$_attr = '';
	if(!empty( $attr ) && is_array($attr)):		
		foreach($attr as $key => $val):
			if($val == '%page%' && preg_match('/-paged/i', $key )):		
				preg_match('/href="(.*)"/i', $a , $res);
				if(isset($res[1])):
					preg_match('!\d+!', $res[1] , $nums);
					if( isset($nums[0]) ):
						$val = $nums[0];
					else:
						$val = 1;
					endif;
				endif;
			endif;
			$_attr[] = "{$key}=\"{$val}\"";
		endforeach;
		$_attr = join(' ', $_attr );
	endif;
	if(!empty($before)):
		$a = preg_replace('/>(.*)</i', ">{$before} $1<" , $a );
	endif;
	if(!empty($after)):
		$a = preg_replace('/>(.*)</i', ">$1 {$after}<" , $a );
	endif;
	echo preg_replace('/(<a href="(.*)")/i', '$1 '  . $_attr , $a );
}
require get_template_directory() . '/ajaxprevnext/core.php';

/// USE LIKE :
////////////////////////* index.php */

// prevnext__modify( get_previous_posts_link() , 
// 	$attributes = array(
// 		'class' => 'button alignleft',
// 	));

// prevnext__modify( get_next_posts_link() , 
// 	$attributes = array(
// 		'class' => 'button alignright',
//	));

////////////////////// /* SINGLE.php */

// prevnext__modify( get_previous_post_link( $format = "<span class=\"alignleft\">&laquo; %link</span>") , 
// 	$attributes = array(
// 		'class' => 'button',
// 	));

// prevnext__modify( get_next_post_link( $format = "<span class=\"alignright\">%link &raquo;</span>" ) , 
// 	$attributes = array(
// 		'class' => 'button',
// 	));
