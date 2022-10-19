---
title: Dolls
fulltitle: Character creation
description: Stories of life and living in the country of Vekllei.

type: stories
layout: stories

color: orange
---

<div class="dolls">
	<div class="dolls-loading">
		Loading assets...
	</div>
	<div class="canvas-wrapper">
		<canvas class="dolls-canvas"></canvas>
		<button class="article-button download-link" onclick="downloadDoll()" download="Vekllei character.png"><span class="smallicon" style="font-size: 14px;">🔥</span> Download Image</button>
	</div>
	<div class="dolls-editor">
		<nav class="dolls-nav"></nav>
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