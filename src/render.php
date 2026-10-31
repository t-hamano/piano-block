<?php
/**
 * Server-side rendering of the `piano-block/piano` block.
 *
 * @var array $attributes Block attributes.
 *
 * @package piano-block
 */

defined( 'ABSPATH' ) || exit;

if ( empty( $attributes['showOnFront'] ) ) {
	return;
}

$piano_block_settings = array(
	'volume'             => min( max( round( (float) $attributes['volume'], 1 ), -10 ), 5 ),
	'useSustainPedal'    => (bool) $attributes['useSustainPedal'],
	'octaveOffset'       => min( max( (int) $attributes['octaveOffset'], -2 ), 2 ),
	'instrument'         => $attributes['instrument'],
	'synthesizerSetting' => $attributes['synthesizerSetting'],
	'keyLayout'          => $attributes['keyLayout'],
	'keyIndicator'       => $attributes['keyIndicator'],
);

$piano_block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'tabindex'      => '0',
		'aria-label'    => __( 'Piano: Press keys to play', 'piano-block' ),
		'data-settings' => wp_json_encode( $piano_block_settings ),
	)
);
?>
<div <?php echo $piano_block_wrapper_attributes; ?>></div>
