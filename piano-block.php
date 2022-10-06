<?php
/**
 * Plugin Name: Piano Block
 * Description: Can play a variety of tones using the piano keyboard.
 * Requires at least: 5.9
 * Requires PHP: 7.3
 * Version: 1.1.0
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

define( 'PIANO_BLOCK_NAMESPACE', 'piano-block' );
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

	$volume            = ! empty( $attributes['volume'] ) ? min( max( (int) $attributes['volume'], -10 ), 5 ) : 0;
	$use_sustain_pedal = ! empty( $attributes['useSustainPedal'] );
	$octave_offset     = ! empty( $attributes['octaveOffset'] ) ? min( max( (int) $attributes['octaveOffset'], -2 ), 2 ) : 0;
	$instrument        = ! empty( $attributes['instrument'] ) ? $attributes['instrument'] : 'acoustic-piano';

	$asset_file = include( PIANO_BLOCK_PATH . '/build/view.asset.php' );

	wp_enqueue_style( 'wp-components' );

	wp_enqueue_script(
		PIANO_BLOCK_NAMESPACE,
		PIANO_BLOCK_URL . '/build/view.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true,
	);

	wp_localize_script(
		PIANO_BLOCK_NAMESPACE,
		'pianoBlockVars',
		array(
			'assetsUrl'       => PIANO_BLOCK_URL . '/assets',
			'defaultSettings' => array(
				'volume'          => $volume,
				'useSustainPedal' => $use_sustain_pedal,
				'octaveOffset'    => $octave_offset,
				'instrument'      => $instrument,
			),
		)
	);

	return sprintf(
		'<div %s></div>',
		get_block_wrapper_attributes(),
	);
}

// Enqueue block editor assets.
function piano_block_enqueue_block_editor_assets() {
	wp_localize_script(
		PIANO_BLOCK_NAMESPACE . '-piano-editor-script',
		'pianoBlockVars',
		array( 'assetsUrl' => PIANO_BLOCK_URL . '/assets' )
	);

	wp_set_script_translations( PIANO_BLOCK_NAMESPACE, PIANO_BLOCK_NAMESPACE );
}
add_action( 'enqueue_block_editor_assets', 'piano_block_enqueue_block_editor_assets' );
