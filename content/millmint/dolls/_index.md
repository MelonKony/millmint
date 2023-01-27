---
title: Dolls
fulltitle: Create-a-Character
description: Stories of life and living in the country of Vekllei.
icon: 🧍‍♀️
emoji: P
color: indigo

tags: 
  - dolls
categories:
  - tools
  
type: blank
---

<div class="dolls">
	<div class="canvas-wrapper">
		<div class="dolls-left-side">
			<div class="dolls-canvas">
				<div class="dolls-canvas-inner"></div>
			</div>
			<button class="article-button download-link" onclick="downloadDollImage()" download="Vekllei character.png"><span class="smallicon" style="font-size: 14px;">📂</span> <span class="text">Download Image</span></button>
			<button class="article-button download-pfp" onclick="downloadDollFace(event)" download="Vekllei character.png"><span class="smallicon" style="font-size: 14px;">🙂</span> <span class="text">Download Profile Picture</span></button>
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
		<div class="color-options">
			<div class="color-circle reset-circle" onclick="setColor(null)"></div>
		</div>
		<div class="doll-options"></div>
	</div>
</div>

<div class="dolls-templates">
	<template class="dolls-nav-item-template">
		<button class="dolls-nav-item">
			<span class="icon">←</span>
			<span class="text">My nav</span>
		</button>
	</template>
</div>

<script src="/js/dolls.js"></script>