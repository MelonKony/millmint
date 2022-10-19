---
title: Dolls
fulltitle: Create-a-Character
description: Stories of life and living in the country of Vekllei.

type: stories
layout: stories

color: indigo
---

<div class="dolls">
	<div class="dolls-loading">
		<label for="assets">Loading assets:</label>
		<div class="progress-wrapper">
			<progress id="assets" max="100" value="70"></progress>
			<span class="percentage">00%</span>
		</div>
	</div>
	<div class="canvas-wrapper">
		<div class="dolls-left-side">
			<canvas class="dolls-canvas"></canvas>
			<button class="article-button download-link" onclick="downloadDoll()" download="Vekllei character.png"><span class="smallicon" style="font-size: 14px;">📂</span> Download Image</button>
		</div>
	</div>
	<div class="dolls-editor">
		<nav class="dolls-nav">
			<button class="nav-previous nav-nav-button" onclick="previousNav()">←</button>
			<div class="nav-inner"></div>
			<button class="nav-next nav-nav-button" onclick="nextNav()">→</button>
		</nav>
		<span class="current-page">Faces</span>
		<hr />
		<div class="doll-options"></div>
	</div>
</div>

<div class="dolls-templates">
	<template class="dolls-nav-item-template">
		<button class="dolls-nav-item">
			<span class="emoji">←</span>
			<span class="text">My nav</span>
		</button>
	</template>
</div>

<script src="/js/dolls.js"></script>
