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

$piano_block_volume              = min( max( round( (float) $attributes['volume'], 1 ), -10 ), 5 );
$piano_block_use_sustain_pedal   = (bool) $attributes['useSustainPedal'];
$piano_block_octave_offset       = min( max( (int) $attributes['octaveOffset'], -2 ), 2 );
$piano_block_instrument          = $attributes['instrument'];
$piano_block_synthesizer_setting = $attributes['synthesizerSetting'];
$piano_block_key_layout          = $attributes['keyLayout'];
$piano_block_key_indicator       = $attributes['keyIndicator'];

$piano_block_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'data-volume'              => $piano_block_volume,
		'data-use-sustain-pedal'   => $piano_block_use_sustain_pedal ? 1 : 0,
		'data-octave-offset'       => $piano_block_octave_offset,
		'data-instrument'          => $piano_block_instrument,
		'data-key-layout'          => $piano_block_key_layout,
		'data-key-indicator'       => $piano_block_key_indicator,
		'data-synthesizer-setting' => wp_json_encode( $piano_block_synthesizer_setting ),
	)
);
?>
<div <?php echo $piano_block_wrapper_attributes; ?>></div>
