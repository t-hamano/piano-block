<?php
/**
 * Plugin Name: Piano Block
 * Description: Can play a variety of tones using the piano keyboard on the block editor.
 * Requires at least: 5.9
 * Requires PHP: 7.3
 * Version: 1.0.0
 * Author: Tetsuaki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: piano-block
 *
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

defined( 'ABSPATH' ) || exit;

define( 'PIANO_BLOCK_NAMESPACE', 'piano-block' );
define( 'PIANO_BLOCK_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'PIANO_BLOCK_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

// Register block.
function piano_block_enqueue_editor_scripts() {
	register_block_type( PIANO_BLOCK_PATH . '/build' );
}
add_action( 'init', 'piano_block_enqueue_editor_scripts' );

// Enqueue block editor assets.
function piano_block_register_block() {
	wp_enqueue_script(
		PIANO_BLOCK_NAMESPACE,
		PIANO_BLOCK_URL . '/src/block.js',
		array(),
		filemtime( PIANO_BLOCK_PATH . '/src/block.js' ),
		false
	);

	wp_localize_script(
		PIANO_BLOCK_NAMESPACE,
		'pianoBlockVars',
		array( 'assetsUrl' => PIANO_BLOCK_URL . '/assets' )
	);

	wp_set_script_translations( PIANO_BLOCK_NAMESPACE, PIANO_BLOCK_NAMESPACE );
}
add_action( 'init', 'piano_block_register_block' );
