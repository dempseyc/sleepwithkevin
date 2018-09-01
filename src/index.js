import './style.scss';
import $ from 'jquery';
import { fadeIn } from './anim.js';

const $tagLine = $('.tag-line').eq(0);
fadeIn($tagLine);

(function(H){H.className=H.className.replace(/\bno-js\b/,'js')})(document.documentElement)
