// Inline the fonts as base64 so the render never falls back.
import { readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
const dir = os.homedir() + '/Library/Fonts/';
const fonts = [['Anton', 'Anton-Regular.ttf'], ['JBMono', 'JetBrainsMono-Medium.ttf'], ['ISerif', 'InstrumentSerif-Italic.ttf']];
const css = fonts.map(([fam, file]) => `@font-face{font-family:'${fam}';src:url(data:font/ttf;base64,${readFileSync(dir + file).toString('base64')}) format('truetype');}`).join('\n');
// Declared fonts are only loaded when used, so touch each one in a hidden element.
const touch = fonts.map(([fam]) => `<span style="font-family:'${fam}';position:absolute;opacity:0">a</span>`).join('');
writeFileSync('intro.html', readFileSync('intro.src.html', 'utf8').replace('/*FONTS*/', css).replace('<div id="stage">', touch + '<div id="stage">'));
console.log('built intro.html');
