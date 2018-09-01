import './style.scss';
import $ from 'jquery';
import { fadeIn } from './anim.js';

const $tagLine = $('.tag-line').eq(0);
fadeIn($tagLine);

const $html = document.getElementsByTagName("html")[0];

$html.style.display="none";
document.addEventListener("DOMContentLoaded",function(event) { $html.style.display="block"; });