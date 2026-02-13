<?php
/*
Plugin Name: WEPT Dental Chat
Description: KINS WITH 動物病院向け 歯科相談UI（右ドロワー形式）
Version: 2.1.0
Author: WEPT
License: GPLv2 or later
*/

if (!defined('ABSPATH')) { exit; }

define('WEPT_DENTAL_CHAT_VER', '2.1.0');

function wept_dental_chat_register_assets() {
    // Tailwind CDN (runtime JIT)
    wp_register_script(
        'wept-tailwind',
        'https://cdn.tailwindcss.com',
        array(),
        '3.4.0',
        true
    );

    $tw_config = <<<JS
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  corePlugins: { preflight: false },
  important: '#webpilot-root'
};
JS;
    wp_add_inline_script('wept-tailwind', $tw_config, 'before');

    // Scoped CSS
    wp_register_style('wept-dental-chat-scoped', false, array(), WEPT_DENTAL_CHAT_VER);
    $scoped_css = <<<CSS
/* =========================
   WEPT Dental Chat v2.1.0
   ========================= */

#webpilot-root {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  position: relative;
}

#webpilot-root *, #webpilot-root *::before, #webpilot-root *::after {
  box-sizing: border-box;
}
#webpilot-root img {
  max-width: 100%;
  height: auto;
  display: block;
}
#webpilot-root button {
  cursor: pointer;
  background: none;
  border: 0;
}

/* === FAB（相談するボタン） === */
#webpilot-root .wept-fab {
  position: fixed;
  right: 12px;
  bottom: 100px;
  z-index: 99997;
  padding: 10px 14px;
  border-radius: 9999px;
  border: 1px solid #e8ddd3;
  background: #fff9f5;
  color: #3d3d3d;
  font-size: 13px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  transition: opacity 0.2s ease;
}

/* === オーバーレイ === */
#webpilot-root .wept-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  background: rgba(0,0,0,0.28);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
#webpilot-root .wept-overlay.is-open {
  opacity: 1;
  pointer-events: auto;
}

/* === ドロワー === */
#webpilot-root .wept-drawer {
  position: fixed;
  right: 12px;
  bottom: 40px;
  height: 90%;
  max-height: 750px;
  width: min(420px, calc(100vw - 24px));
  z-index: 99999;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: -10px 0 30px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  transform: translateX(110%);
  transition: transform 0.25s ease;
}
#webpilot-root .wept-drawer.is-open {
  transform: translateX(0);
}

/* === Body === */
#webpilot-root .wept-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* === Footer === */
#webpilot-root .wept-footer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #e8e0d5;
  flex-shrink: 0;
}

/* === Input === */
#webpilot-root .wept-input {
  flex: 1;
  border-radius: 9999px;
  border: 1px solid #e8ddd3;
  padding: 10px 12px;
  background: #f5ede4;
  color: #3d3d3d;
  font-size: 14px;
  outline: none;
}

/* === Send Button === */
#webpilot-root .wept-send {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  border: 0;
  background: #8B6B5C;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}
#webpilot-root .wept-send:disabled {
  opacity: 0.5;
}

/* === Common Button Styles === */
#webpilot-root .wept-btn {
  background-color: #FFF9F5;
  border: 1px solid #E8DDD3;
  border-radius: 12px;
  padding: 12px 8px;
  cursor: pointer;
  text-align: center;
  width: 100%;
}
#webpilot-root .wept-btn-primary {
  background-color: #8B6B5C;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
}
#webpilot-root .wept-btn-secondary {
  background-color: #F5EDE4;
  color: #5D5D5D;
  border: none;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
}

/* === Color Variables === */
#webpilot-root {
  --wept-brown: #8B6B5C;
  --wept-brown-dark: #5D4E4E;
  --wept-brown-line: #965D57;
  --wept-text: #5D5D5D;
  --wept-text-light: #8B7B6B;
  --wept-text-muted: #A69B8D;
  --wept-bg: #FDF8F3;
  --wept-bg-card: #F5EDE4;
  --wept-border: #E8E0D5;
}

/* === Loading Animation === */
@keyframes weptLoadingBar {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}
#webpilot-root .wept-loading-bar {
  animation: weptLoadingBar 2s ease-in-out infinite;
}

@keyframes weptDotBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
}

CSS;
    wp_add_inline_style('wept-dental-chat-scoped', $scoped_css);

    // React 18 UMD
    wp_register_script(
        'wept-react',
        'https://unpkg.com/react@18/umd/react.production.min.js',
        array(),
        '18.2.0',
        true
    );
    wp_register_script(
        'wept-react-dom',
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        array('wept-react'),
        '18.2.0',
        true
    );

    // Babel
    wp_register_script(
        'wept-babel',
        'https://unpkg.com/@babel/standalone/babel.min.js',
        array(),
        '7.23.0',
        true
    );

    // heic2any（HEIC→JPG変換ライブラリ）
    wp_register_script(
        'wept-heic2any',
        'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
        array(),
        '0.0.4',
        true
    );

    // App (JSX)
    $js_path = plugin_dir_path(__FILE__) . 'assets/wept-app.js';
    $js_url  = plugin_dir_url(__FILE__) . 'assets/wept-app.js';
    $ver = file_exists($js_path) ? filemtime($js_path) : WEPT_DENTAL_CHAT_VER;

    wp_register_script(
        'wept-dental-chat-app',
        $js_url,
        array('wept-tailwind', 'wept-react', 'wept-react-dom', 'wept-babel', 'wept-heic2any'),
        $ver,
        true
    );

    // article-summaries.json を JS に渡す（要約機能用）
    $json_path = plugin_dir_path(__FILE__) . 'data/article-summaries.json';
    if (file_exists($json_path)) {
        $articles = json_decode(file_get_contents($json_path), true);
        if ($articles) {
            wp_localize_script('wept-dental-chat-app', 'WEPT_ARTICLES', $articles);
        }
    }

    // プラグイン設定（アセットURLなど）を JS に渡す
    wp_localize_script('wept-dental-chat-app', 'WEPT_CONFIG', array(
        'assetsUrl' => plugin_dir_url(__FILE__) . 'assets/',
    ));

    add_filter('script_loader_tag', function($tag, $handle, $src) {
        if ($handle === 'wept-dental-chat-app') {
            return '<script type="text/babel" src="' . esc_url($src) . '"></script>';
        }
        return $tag;
    }, 10, 3);
}
add_action('wp_enqueue_scripts', 'wept_dental_chat_register_assets');

/**
 * Shortcode: [wept_dental_chat]
 */
function wept_dental_chat_shortcode($atts = array(), $content = null) {
    wp_enqueue_style('wept-dental-chat-scoped');
    wp_enqueue_script('wept-tailwind');
    wp_enqueue_script('wept-react');
    wp_enqueue_script('wept-react-dom');
    wp_enqueue_script('wept-babel');
    wp_enqueue_script('wept-heic2any');
    wp_enqueue_script('wept-dental-chat-app');

    return '<div id="webpilot-root"></div>';
}
add_shortcode('wept_dental_chat', 'wept_dental_chat_shortcode');
