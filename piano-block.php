<?php
/**
 * Plugin Name: Piano Block
 * Description: Can play a variety of tones using the piano keyboard.
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * Version: 2.5.0
 * Author: Aki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: piano-block
 *
 * @author Aki Hamano
 * @license GPL-2.0+
 */

defined( 'ABSPATH' ) || exit;

define( 'PIANO_BLOCK_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'PIANO_BLOCK_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

// Register block.
function piano_block_register_block() {
	register_block_type(
		PIANO_BLOCK_PATH . '/build',
		array(
			'render_callback' => 'piano_block_render_callback',
		)
	);
}
add_action( 'init', 'piano_block_register_block' );

// Render callback.
function piano_block_render_callback( $attributes ) {
	if ( empty( $attributes['showOnFront'] ) ) {
		return '';
	}

	$volume              = ! empty( $attributes['volume'] ) ? min( max( round( (float) $attributes['volume'], 1 ), -10 ), 5 ) : 0;
	$use_sustain_pedal   = ! empty( $attributes['useSustainPedal'] );
	$octave_offset       = ! empty( $attributes['octaveOffset'] ) ? min( max( (int) $attributes['octaveOffset'], -2 ), 2 ) : 0;
	$instrument          = ! empty( $attributes['instrument'] ) ? $attributes['instrument'] : 'acoustic-piano';
	$synthesizer_setting = ! empty( $attributes['synthesizerSetting'] ) ? $attributes['synthesizerSetting'] : array();
	$key_layout          = ! empty( $attributes['keyLayout'] ) ? $attributes['keyLayout'] : 'qwerty-1';
	$key_indicator       = ! empty( $attributes['keyIndicator'] ) ? $attributes['keyIndicator'] : 'key';

	wp_enqueue_style( 'wp-components' );

	wp_localize_script(
		'piano-block-piano-view-script',
		'pianoBlockVars',
		array(
			'assetsUrl' => PIANO_BLOCK_URL . '/assets',
		)
	);

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'data-volume'            => $volume,
			'data-use-sustain-pedal' => $use_sustain_pedal ? 1 : 0,
			'data-octave-offset'     => $octave_offset,
			'data-instrument'        => $instrument,
			'data-key-layout'        => $key_layout,
		)
	);

	if ( ! empty( $attributes['synthesizerSetting'] ) ) {
		$escaped_synthesizer_setting = array_map(
			function ( $attribute ) {
				if ( is_array( $attribute ) ) {
					return array_map(
						function ( $child_attribute ) {
							return esc_attr( $child_attribute );
						},
						$attribute
					);
				}
				return esc_attr( $attribute );
			},
			$attributes['synthesizerSetting']
		);

		$wrapper_attributes .= " data-synthesizer-setting='" . json_encode( $escaped_synthesizer_setting ) . "'";
	}

	wp_set_script_translations( 'piano-block-piano-view-script', 'piano-block' );

	return sprintf(
		'<div %s></div>',
		$wrapper_attributes,
	);
}

// Enqueue block editor assets.
function piano_block_enqueue_block_editor_assets() {
	wp_localize_script(
		'piano-block-piano-editor-script',
		'pianoBlockVars',
		array( 'assetsUrl' => PIANO_BLOCK_URL . '/assets' )
	);

	wp_set_script_translations( 'piano-block-piano-view-script', 'piano-block' );
}
add_action( 'enqueue_block_editor_assets', 'piano_block_enqueue_block_editor_assets' );
