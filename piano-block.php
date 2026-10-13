<?php
/**
 * Plugin Name: Piano Block
 * Description: Can play a variety of tones using the piano keyboard.
 * Requires at least: 7.1
 * Requires PHP: 8.0
 * Version: 2.10.0
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
	$block_type = register_block_type( PIANO_BLOCK_PATH . '/build' );

	if ( ! $block_type ) {
		return;
	}

	$inline_script = sprintf(
		'window.pianoBlockVars = %s;',
		wp_json_encode( array( 'assetsUrl' => PIANO_BLOCK_URL . '/assets' ) )
	);

	foreach ( array_merge( $block_type->editor_script_handles, $block_type->view_script_handles ) as $handle ) {
		wp_add_inline_script( $handle, $inline_script, 'before' );
	}
}
add_action( 'init', 'piano_block_register_block' );
