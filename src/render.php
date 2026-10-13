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

$piano_block_volume              = ! empty( $attributes['volume'] ) ? min( max( round( (float) $attributes['volume'], 1 ), -10 ), 5 ) : 0;
$piano_block_use_sustain_pedal   = ! empty( $attributes['useSustainPedal'] );
$piano_block_octave_offset       = ! empty( $attributes['octaveOffset'] ) ? min( max( (int) $attributes['octaveOffset'], -2 ), 2 ) : 0;
$piano_block_instrument          = ! empty( $attributes['instrument'] ) ? $attributes['instrument'] : 'acoustic-piano';
$piano_block_synthesizer_setting = ! empty( $attributes['synthesizerSetting'] ) ? $attributes['synthesizerSetting'] : array();
$piano_block_key_layout          = ! empty( $attributes['keyLayout'] ) ? $attributes['keyLayout'] : 'qwerty-1';
$piano_block_key_indicator       = isset( $attributes['keyIndicator'] ) ? $attributes['keyIndicator'] : 'key';

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

// get_block_wrapper_attributes() already escapes each value with esc_attr(),
// so the output is echoed as is to avoid double escaping.
?>
<div <?php echo $piano_block_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>></div>
