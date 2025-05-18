// Core variables
const dataUrls = {}, imgs = {}, groupColors = {};
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
let dollAssets = [], uniqueGroups = [], currentGroup, gender = "f";
let redrawDebounce, colorDebounce, currentColorScheme = {}, currentActiveItem = null;

// Initialize groupSelections with female defaults
const groupSelections = {};

if (!isSafari) {
    document.querySelectorAll(".download-link .text").forEach(span => span.textContent = "Download Image");
}

// Male doll configuration defaults
const maleGroupSelections = {
    figure: ["Olive"],
    face: ["Leroy"],
    shoes: ["Default navy oxfords"],
    bottom: ["Default navy trousers"],
    outer: ["Default navy jumper"],
    socks: ["Default navy everyday socks"],
    top: ["Default white button shirt", "Default white long sleeves", "Default white square collar", "Default navy tie"],
    hair: ["Default navy curls"],
    outerwear: ["Default navy blazer"],
};

// Helper function to get default selections based on gender
function getDefaultSelections() {
    // Base doll configuration for female
    return {
        figure: ["Olive"],
        face: ["Tzipora"],
        shoes: ["Default brown penny loafers"],
        outfits: ["Default navy gymslip"],
        outer: ["Default navy short bolero", "Bolero back"],
        socks: ["Default white folded socks"],
        top: ["Default white button shirt", "Default white long sleeves", "Default white round collar", "Default navy tab tie"],
        hair: ["Default navy scruff"],
        accessories: ["Default blue name card"],
        outerwear: ["Default navy overcape", "Default navy overcape back"],
    };
}

// Add gender toggle UI with icons
function createGenderToggle() {
    if (document.querySelector('.gender-toggle')) {
        updateGenderToggle();
        return;
    }
    
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "gender-toggle";
    Object.assign(toggleContainer.style, {
        position: "relative",
        textAlign: "center",
        marginBottom: "10px",
        display: "block",
        width: "100%",
        height: "auto"
    });
    
    const btnStyles = {
        padding: "5px 10px",
        margin: "0 5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        backgroundColor: "#fff"
    };
    
    const femaleBtn = document.createElement("button");
    femaleBtn.innerHTML = "♀";
    femaleBtn.title = "Female";
    femaleBtn.className = "gender-btn female" + (gender === "f" ? " active" : "");
    femaleBtn.onclick = () => switchGender("f");
    
    const maleBtn = document.createElement("button");
    maleBtn.innerHTML = "♂";
    maleBtn.title = "Male";
    maleBtn.className = "gender-btn male" + (gender === "m" ? " active" : "");
    maleBtn.onclick = () => switchGender("m");
    
    [femaleBtn, maleBtn].forEach(btn => Object.assign(btn.style, btnStyles));
    
    toggleContainer.append(femaleBtn, maleBtn);
    
    // Insert the toggle at the very top of the dolls-left-side
    const dollsLeftSide = document.querySelector(".dolls-left-side");
    if (dollsLeftSide) {
        dollsLeftSide.insertBefore(toggleContainer, dollsLeftSide.firstChild);
    }
    
    updateGenderToggle();
}

// Update gender toggle state without recreating it
function updateGenderToggle() {
    const femaleBtn = document.querySelector('.gender-btn.female');
    const maleBtn = document.querySelector('.gender-btn.male');
    
    if (!femaleBtn || !maleBtn) return;
    
    // Reset styles
    [femaleBtn, maleBtn].forEach(btn => {
        btn.style.backgroundColor = "#fff";
        btn.style.color = "#000";
        btn.className = btn.className.replace(" active", "");
    });
    
    // Set active style
    if (gender === "f") {
        femaleBtn.style.backgroundColor = "#272b40";
        femaleBtn.style.color = "white";
        femaleBtn.className += " active";
    } else {
        maleBtn.style.backgroundColor = "#272b40";
        maleBtn.style.color = "white";
        maleBtn.className += " active";
    }
}

// Function to switch gender
function switchGender(newGender) {
    if (gender === newGender) return;
    
    gender = newGender;
    
    // Reset selections when switching gender
    if (gender === "f") {
        // Use female defaults
        Object.keys(groupSelections).forEach(key => {
            groupSelections[key] = [];
        });
        
        // Apply female defaults
        Object.entries(getDefaultSelections()).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                groupSelections[key] = [...value];
            }
        });
    } else {
        // Use male defaults
        Object.keys(groupSelections).forEach(key => {
            groupSelections[key] = [];
        });
        
        // Apply male defaults
        Object.entries(maleGroupSelections).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                groupSelections[key] = [...value];
            }
        });
    }
    
    // Reset colors
    Object.keys(groupColors).forEach(key => {
        delete groupColors[key];
    });
    
    // Reset current color scheme
    currentColorScheme = {};
    
    // Reload assets for the new gender
    dollAssets = [];
    loadDollAssets();
    
    // Update UI
    renderNav();
    updateGenderToggle(); // Update toggle instead of recreating
    dollsMain(true);
}

// Helper function to get default selections based on gender
function getDefaultSelections() {
    // Base doll configuration for female
    return {
        figure: ["Olive"],
        face: ["Tzipora"],
        shoes: ["Default brown penny loafers"],
        outfits: ["Default navy gymslip"],
        outer: ["Default navy short bolero", "Bolero back"],
        socks: ["Default white folded socks"],
        top: ["Default white button shirt", "Default white long sleeves", "Default white round collar", "Default navy tab tie"],
        hair: ["Default navy scruff"],
        accessories: ["Default navy overcape", "Default navy overcape back"],
    };
}

// Group definitions
const groups = {
	background: { label: "Background", icon: "🌲", noColor: true },
	figure: { label: "Figure", icon: "🎨", forceOne: true, noColor: true },
	hair: { label: "Hair", icon: "✂️" },
	face: { label: "Face", icon: "☺️", forceOne: true, noColor: true },
	shirt: { label: "Shirts", icon: "V" },
	top: { label: "Shirts", icon: "👚" },
	bottom: { label: "Bottoms", icon: "👖" },
	outerwear: { label: "Outerwear", icon: "🧥" },
	socks: { label: "Socks", icon: "🧦" },
	shoes: { label: "Shoes", icon: "👞" },
	outfits: { label: "Outfits", icon: "👗" },
	outer: { label: "Outerwear", icon: "🧣" },
	accessories: { label: "Accessories", icon: "👒", multiple: true },
};

// Initialize with defaults on page load
document.addEventListener('DOMContentLoaded', function() {
    // Apply female defaults initially
    Object.entries(getDefaultSelections()).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            groupSelections[key] = [...value];
        }
    });
});

function loadDollAssets() {
    const dataScript = document.getElementById('doll-assets-data');
    if (!dataScript?.textContent) {
        console.error('Doll assets data script not found');
        throw new Error('Doll assets data not found');
    }

    try {
        const rawData = dataScript.textContent.trim();
        let assetData;
        try {
            const firstParse = JSON.parse(rawData);
            assetData = typeof firstParse[0] === 'string' ? JSON.parse(firstParse[0]) : firstParse;
        } catch (e) {
            console.error('Failed to parse asset data:', e);
            throw e;
        }
        
        dollAssets = assetData
            .filter(asset => {
                // Filter assets by gender
                const assetPath = asset.layers && asset.layers[0] && asset.layers[0].img;
                const isCurrentGender = assetPath && assetPath.includes(`/${gender}/`);
                
                const isValid = asset && typeof asset === 'object' && asset.group && asset.name && 
                               Array.isArray(asset.layers) && isCurrentGender;
                               
                if (!isValid && asset && asset.name) console.warn('Invalid or wrong gender asset skipped:', asset.name);
                return isValid;
            })
            .map(asset => {
                const isComponent = asset.group.includes('/');
                const [baseGroup, componentType] = isComponent ? asset.group.split('/') : [asset.group, null];
                
                if (isComponent) {
                    const baseItem = dollAssets.find(a => 
                        a.group === baseGroup && 
                        a.name === asset.name.replace(` ${componentType}`, '')
                    );
                    
                    if (baseItem) {
                        baseItem.layers = [...baseItem.layers, ...asset.layers];
                        return null;
                    }
                }
                
                return {
                    ...asset,
                    isComponent,
                    baseGroup,
                    componentType,
                    layers: asset.layers
                        .filter(layer => layer?.img)
                        .map(layer => ({
                            ...layer,
                            path: layer.img,
                            img: createImage(layer.img)
                        }))
                };
            })
            .filter(asset => asset && asset.layers.length > 0);

        uniqueGroups = [...new Set(dollAssets.map(t => t.baseGroup))];
        currentGroup = currentGroup || uniqueGroups[0];
    } catch (error) {
        console.error('Asset loading failed:', error);
        throw error;
    }
}

function createImage(src) {
    if (!src) {
        console.error('Attempted to load image with undefined path');
        return null;
    }
    
    // Make sure the path includes the current gender
    if (!src.includes(`/${gender}/`) && !src.startsWith('/')) {
        src = `/${gender}/` + src;
    } else if (src.startsWith('/') && !src.includes(`/${gender}/`)) {
        // If it starts with / but doesn't have gender, insert gender after first /
        src = '/' + gender + src;
    }
    
    const img = new Image();
    img.src = src;
    return img;
}

function render() {
	const allLayers = getLayers();
	const wrapper = document.querySelector(".dolls-canvas-inner");
	wrapper.innerHTML = "";

	for (const asset of allLayers) {
		const layer = document.createElement("div");
		layer.classList.add("layer");

		if (asset.mask) {
			const mask = document.createElement("div");
			mask.classList.add("mask");
			mask.style.setProperty("--url", `url(${asset.path})`);
			mask.style.backgroundColor = asset.color || "black";
			layer.appendChild(mask);
		} else {
			const img = document.createElement("img");
			img.src = asset.path;
			layer.appendChild(img);
		}

		wrapper.appendChild(layer);
	}
}

function getLayers() {
    // Create a custom order for specific groups
    const customOrder = {
        background: 0,
        figure: 100,
        hair: 200,
        face: 300,
        top: 400,
        shirt: 400,
        outfits: 800,
        outer: 850,
        outerwear: 900,
        bottom: 700,
        socks: 400,
        shoes: 600,
        accessories: 1000
    };
    
    // For any groups not explicitly ordered, use the original dynamic ordering
    const groupOrder = Object.keys(groups).reduce((acc, group, index) => {
        if (customOrder[group] !== undefined) {
            acc[group] = customOrder[group];
        } else {
            acc[group] = (index + 10) * 100;
        }
        return acc;
    }, {});

    return Object.entries(groupSelections)
        .flatMap(([group, itemNames]) => 
            dollAssets
                .filter(asset => (asset.group === group || asset.baseGroup === group) && itemNames.includes(asset.name))
                .flatMap(asset => {
                    const isBack = asset.name.toLowerCase().includes(' back');
                    const baseOrder = groupOrder[asset.isComponent ? asset.baseGroup : asset.group] || 0;
                    const color = groupColors[asset.group] || groupColors[asset.baseGroup];
                    
                    // Extract layer number from name if present
                    const layerMatch = asset.name.match(/\s(\d+)$/);
                    const explicitLayer = layerMatch ? parseInt(layerMatch[1]) : null;
                    
                    return asset.layers.map(layer => ({
                        layer: explicitLayer !== null ? explicitLayer : (baseOrder + (layer.layer || 0) + (isBack ? -10000 : 0)),
                        path: layer.path,
                        mask: !!color,
                        color
                    }));
                })
        )
        .filter(Boolean)
        .sort((a, b) => a.layer - b.layer);
}

const colorMap = {
    'red': '#ad3647', 'blue': '#6080cc', 'navy': '#272b40',
    'brown': '#8C533C', 'black': '#272727', 'green': '#8F9A6B',
    'yellow': '#D99E52', 'purple': '#8a2be2', 'pink': '#ff69b4',
    'orange': '#ff8c00', 'grey': '#808080', 'gray': '#808080',
    'olive': '#808000', 'tan': '#d2b48c', 'beige': '#f5f5dc',
    'cream': '#fffdd0', 'gold': '#ffd700', 'silver': '#c0c0c0',
    'white': '#ffffff'
};

const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;

function getAvailableColorsForItem(itemName) {
    const colors = {};
    const asset = dollAssets.find(a => a.name === itemName);
    if (!asset) return colors;
    
    const match = itemName.match(colorRegex);
    if (!match) return colors;
    
    const baseName = match[3];
    dollAssets
        .filter(variant => {
            const assetMatch = variant.name.match(colorRegex);
            return assetMatch && 
                   assetMatch[3] === baseName && 
                   (variant.group === currentGroup || variant.baseGroup === currentGroup) &&
                   !variant.name.toLowerCase().includes(' back') &&
                   (!asset.isComponent || variant.componentType === asset.componentType);
        })
        .forEach(asset => {
            const assetMatch = asset.name.match(colorRegex);
            if (assetMatch && colorMap[assetMatch[2].toLowerCase()]) {
                colors[assetMatch[2].toLowerCase()] = colorMap[assetMatch[2].toLowerCase()];
            }
        });
    
    return colors;
}

function getAvailableColorsForCurrentGroup() {
    const colors = {};
    dollAssets
        .filter(asset => 
            (asset.group === currentGroup || asset.baseGroup === currentGroup) &&
            !asset.name.toLowerCase().includes(' back') &&
            !asset.isComponent
        )
        .forEach(asset => {
            const match = asset.name.match(colorRegex);
            if (match && colorMap[match[2].toLowerCase()]) {
                colors[match[2].toLowerCase()] = colorMap[match[2].toLowerCase()];
            }
        });
    
    return colors;
}

function updateSelectionsByColor(colorName, itemName) {
    if (!itemName) return;
    
    const asset = dollAssets.find(a => a.name === itemName);
    if (!asset) return;
    
    const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
    const match = itemName.match(colorRegex);
    
    if (!match) return;
    
    const baseName = match[3];
    
    const colorVariants = dollAssets.filter(variant => {
        const assetMatch = variant.name.match(colorRegex);
        return assetMatch && 
               assetMatch[3] === baseName && 
               (variant.group === currentGroup || variant.baseGroup === currentGroup) &&
               !variant.name.toLowerCase().includes(' back') &&
               // Match component type if it's a component
               (!asset.isComponent || variant.componentType === asset.componentType);
    });
    
    const targetVariant = colorVariants.find(asset => {
        const assetMatch = asset.name.match(colorRegex);
        return assetMatch && assetMatch[2].toLowerCase() === colorName.toLowerCase();
    });
    
    if (targetVariant) {
        const currentSelections = [...groupSelections[currentGroup]];
        const index = currentSelections.indexOf(itemName);
        
        if (index !== -1) {
            currentSelections[index] = targetVariant.name;
            
            const oldBackItems = findBackItems({ name: itemName, group: currentGroup });
            const newBackItems = findBackItems(targetVariant);
            
            oldBackItems.forEach(oldBack => {
                const oldBackIndex = currentSelections.indexOf(oldBack.name);
                if (oldBackIndex !== -1) {
                    const newBack = newBackItems.find(newBack => {
                        return newBack.name.includes(oldBack.name.replace(itemName, ''));
                    });
                    
                    if (newBack) {
                        currentSelections[oldBackIndex] = newBack.name;
                    } else {
                        currentSelections.splice(oldBackIndex, 1);
                    }
                }
            });
            
            groupSelections[currentGroup] = currentSelections;
            
            if (groups[currentGroup]?.multiple) {
                currentActiveItem = targetVariant.name;
            }
        }
    }
}

function updateColors() {
	if (colorDebounce) clearTimeout(colorDebounce);

	colorDebounce = setTimeout(() => {
		for (const asset of dollAssets) {
			const color = groupColors[asset.group] || undefined;
			setMaskColor(asset.name, color);
		}
		drawCharacter();
	}, 100);
}

function renderOptions() {
    const wrapper = document.querySelector(".doll-options");
    // Save existing color palettes before clearing
    const existingPalettes = {};
    wrapper.querySelectorAll(".component-color-palette").forEach(palette => {
        const section = palette.closest(".component-section");
        if (section) {
            existingPalettes[section.querySelector(".component-title")?.textContent] = palette;
        }
    });

    wrapper.innerHTML = "";

    const createOptionElement = (asset, isComponent = false) => {
        const div = document.createElement("div");
        div.classList.add("doll-option");
        if (isComponent) div.classList.add("component-option");
        
        // Extract base name for comparison
        const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
        const assetMatch = asset.name.match(colorRegex);
        const assetBaseName = assetMatch ? assetMatch[3].toLowerCase() : asset.name.toLowerCase();
        
        // Check if any variant of this item is selected
        const isSelected = groupSelections[asset.baseGroup]?.some(selectedName => {
            const selectedMatch = selectedName.match(colorRegex);
            const selectedBaseName = selectedMatch ? selectedMatch[3].toLowerCase() : selectedName.toLowerCase();
            return selectedBaseName === assetBaseName && !selectedName.toLowerCase().includes(' back');
        });
        
        if (isSelected) {
            div.classList.add("active");
        }

        const displayName = formatDisplayName(asset.name);
        div.innerText = displayName;
        
        div.addEventListener("click", () => {
            const targetGroup = asset.baseGroup || currentGroup;
            if (!groupSelections[targetGroup]) {
                groupSelections[targetGroup] = [];
            }
            
            const group = groups[targetGroup];
            const backItems = findBackItems(asset);
            
            currentActiveItem = asset.name;
            
            if (group?.forceOne) {
                groupSelections[targetGroup] = [asset.name, ...backItems.map(b => b.name)];
                setDefaultColorForItem(asset.name);
            } else if (group?.multiple) {
                if (groupSelections[targetGroup].includes(asset.name)) {
                    groupSelections[targetGroup] = groupSelections[targetGroup]
                        .filter(a => a !== asset.name && !backItems.some(b => b.name === a));
                    delete currentColorScheme[asset.name];
                } else {
                    groupSelections[targetGroup].push(asset.name);
                    backItems.forEach(backItem => {
                        if (!groupSelections[targetGroup].includes(backItem.name)) {
                            groupSelections[targetGroup].push(backItem.name);
                        }
                    });
                    setDefaultColorForItem(asset.name);
                }
            } else {
                if (asset.isComponent) {
                    if (groupSelections[targetGroup].includes(asset.name)) {
                        groupSelections[targetGroup] = groupSelections[targetGroup]
                            .filter(a => a !== asset.name && !backItems.some(b => b.name === a));
                    } else {
                        const hasBaseItem = groupSelections[targetGroup].some(name => {
                            const item = dollAssets.find(a => a.name === name);
                            return item && !item.isComponent;
                        });
                        
                        if (hasBaseItem) {
                            const sameTypeComponents = dollAssets.filter(a => 
                                a.isComponent && 
                                a.componentType === asset.componentType &&
                                a.baseGroup === targetGroup
                            );
                            groupSelections[targetGroup] = groupSelections[targetGroup]
                                .filter(name => !sameTypeComponents.some(c => c.name === name));
                            
                            groupSelections[targetGroup].push(asset.name);
                            backItems.forEach(backItem => {
                                if (!groupSelections[targetGroup].includes(backItem.name)) {
                                    groupSelections[targetGroup].push(backItem.name);
                                }
                            });
                        }
                    }
                } else {
                    if (groupSelections[targetGroup].includes(asset.name)) {
                        groupSelections[targetGroup] = [];
                    } else {
                        groupSelections[targetGroup] = [asset.name];
                        
                        backItems.forEach(backItem => {
                            groupSelections[targetGroup].push(backItem.name);
                        });
                        
                        const componentTypes = [...new Set(dollAssets
                            .filter(a => a.isComponent && a.baseGroup === targetGroup)
                            .map(a => a.componentType))];
                            
                        componentTypes.forEach(type => {
                            const firstComponent = dollAssets.find(a => 
                                a.isComponent && 
                                a.baseGroup === targetGroup && 
                                a.componentType === type
                            );
                            if (firstComponent) {
                                groupSelections[targetGroup].push(firstComponent.name);
                                const componentBackItems = findBackItems(firstComponent);
                                componentBackItems.forEach(backItem => {
                                    groupSelections[targetGroup].push(backItem.name);
                                });
                            }
                        });
                        
                        setDefaultColorForItem(asset.name);
                    }
                }
            }
            
            renderNav();
            dollsMain(true);
        });
        
        return div;
    };

    // Group assets by their base name (without color prefix)
    const groupedAssets = groupAssetsByBaseName();
    
    // Render base items
    if (Object.keys(groupedAssets).length) {
        wrapper.appendChild(Object.assign(document.createElement("div"), {
            className: "component-title",
            innerText: ""
        }));
        
        // For each base name, only show one option
        Object.values(groupedAssets).forEach(assetGroup => {
            // Find the default asset if available, otherwise use the first one
            const defaultAsset = assetGroup.find(asset => asset.name.toLowerCase().includes('default')) || assetGroup[0];
            wrapper.appendChild(createOptionElement(defaultAsset));
        });
    }

    // Group components by their base name too
    const components = dollAssets.filter(asset => 
        asset.isComponent && 
        (asset.group === currentGroup || asset.baseGroup === currentGroup) &&
        !asset.name.toLowerCase().includes(' back')
    );

    // Group components by type and then by base name
    const componentTypes = [...new Set(components.map(a => a.componentType))];
    componentTypes.forEach(type => {
        if (!type) return;
        
        const componentSection = document.createElement("div");
        componentSection.className = "component-section";
        
        // Add title
        const titleDiv = document.createElement("div");
        titleDiv.className = "component-title";
        titleDiv.innerText = type.charAt(0).toUpperCase() + type.slice(1);
        componentSection.appendChild(titleDiv);
        
        // Check if we have a saved palette for this type
        let colorPaletteDiv = existingPalettes[titleDiv.textContent];
        if (!colorPaletteDiv) {
            colorPaletteDiv = document.createElement("div");
            colorPaletteDiv.className = "component-color-palette";
        }
        componentSection.appendChild(colorPaletteDiv);

        // Group components of this type by base name
        const typeComponents = components.filter(a => a.componentType === type);
        const groupedComponents = {};
        
        typeComponents.forEach(asset => {
            const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
            const match = asset.name.match(colorRegex);
            const baseName = match ? match[3].toLowerCase() : asset.name.toLowerCase();
            
            if (!groupedComponents[baseName]) groupedComponents[baseName] = [];
            groupedComponents[baseName].push(asset);
        });
        
        // For each base name, only show one option
        Object.values(groupedComponents).forEach(assetGroup => {
            const defaultAsset = assetGroup.find(asset => asset.name.toLowerCase().includes('default')) || assetGroup[0];
            componentSection.appendChild(createOptionElement(defaultAsset, true));
            
            // If this component is selected, update the color palette
            if (groupSelections[defaultAsset.baseGroup]?.includes(defaultAsset.name)) {
                const colors = getAvailableColorsForItem(defaultAsset.name);
                if (Object.keys(colors).length > 0) {
                    colorPaletteDiv.innerHTML = ''; // Clear existing colors
                    Object.entries(colors).forEach(([colorName, colorHex]) => {
                        const circle = document.createElement("div");
                        circle.classList.add("color-circle");
                        circle.setAttribute("style", `--color: ${colorHex}`);
                        circle.setAttribute("data-color-name", colorName);
                        
                        if (currentColorScheme[defaultAsset.name] === colorName) {
                            circle.classList.add("active");
                        }
                        
                        circle.addEventListener("click", (e) => {
                            e.stopPropagation();
                            colorPaletteDiv.querySelectorAll(".color-circle").forEach(c => c.classList.remove("active"));
                            circle.classList.add("active");
                            updateSelectionsByColor(colorName, defaultAsset.name);
                            renderNav();
                            dollsMain(true);
                        });
                        
                        colorPaletteDiv.appendChild(circle);
                    });
                }
            }
        });
        
        // Add the color palette right after the title, before the options
        componentSection.insertBefore(colorPaletteDiv, titleDiv.nextSibling);
        wrapper.appendChild(componentSection);
    });
}

function renderNav() {
    const nav = document.querySelector(".dolls-nav");
    if (!nav) return;
    
    const navInner = nav.querySelector(".nav-inner");
    if (!navInner) return;
    
    navInner.innerHTML = "";

    if (!dollAssets || dollAssets.length === 0) {
        console.error('No doll assets available to render navigation');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'No assets available - please check console for errors';
        navInner.appendChild(errorMsg);
        return;
    }
    
	navInner.innerHTML = "";

	for (const groupName of uniqueGroups) {
		const el = document
			.importNode(
				document.querySelector(".dolls-nav-item-template").content,
				true
			)
			.querySelector("*");

		const group = groups[groupName];

		el.querySelector(".text").textContent = group?.label ?? groupName;
		if (group?.icon) el.querySelector(".icon").textContent = group.icon;

		el.addEventListener("click", () => {
			currentGroup = groupName;
			dollsMain();
		});

		if (groupName === currentGroup) el.classList.add("active");
		navInner.appendChild(el);
	}

	document.querySelector(".current-page").innerText =
		groups[currentGroup]?.label ?? currentGroup;

	const currentIndex = uniqueGroups.indexOf(currentGroup);
	document
		.querySelector(".nav-nav-button.nav-previous")
		.classList[currentIndex > 0 ? "remove" : "add"]("disabled");
	document
		.querySelector(".nav-nav-button.nav-next")
		.classList[currentIndex < uniqueGroups.length - 1 ? "remove" : "add"](
			"disabled"
		);

    const colorWrapper = document.querySelector(".color-options");
    colorWrapper.classList.remove("color-hidden");
    colorWrapper
        .querySelectorAll(".color-circle[style]")
        .forEach((el) => el.remove());

    const activeItem = groups[currentGroup]?.multiple ? currentActiveItem : getSelectedBaseItem();
    
    if (activeItem) {
        const availableColors = getAvailableColorsForItem(activeItem);
        const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
        const match = activeItem.match(colorRegex);
        const currentColor = match ? match[2].toLowerCase() : null;
        
        for (const [colorName, colorHex] of Object.entries(availableColors)) {
            const circle = document.createElement("div");
            circle.classList.add("color-circle");
            circle.setAttribute("style", `--color: ${colorHex}`);
            circle.setAttribute("data-color-name", colorName);
            
            circle.addEventListener("click", () => {
                // Remove active class from all circles before setting new one
                colorWrapper.querySelectorAll(".color-circle").forEach(c => c.classList.remove("active"));
                circle.classList.add("active");
                setColorScheme(colorName, activeItem);
            });
            
            // Only set active if this is the current color
            if (colorName === currentColor) {
                circle.classList.add("active");
            }
            
            colorWrapper.appendChild(circle);
        }
    }

    if (groups[currentGroup]?.noColor) colorWrapper.classList.add("color-hidden");
}

function setDefaultColorForItem(itemName) {
    const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
    const match = itemName.match(colorRegex);
    
    if (match) {
        const isDefault = !!match[1];
        const colorName = match[2].toLowerCase();
        const baseName = match[3];
        
        currentColorScheme[itemName] = colorName;
        
        if (!isDefault) {
            const variants = dollAssets.filter(asset => {
                const assetMatch = asset.name.match(colorRegex);
                return assetMatch && 
                       assetMatch[3] === baseName && 
                       (asset.group === currentGroup || asset.baseGroup === currentGroup);
            });
            
            const defaultVariant = variants.find(asset => asset.name.toLowerCase().includes('default'));
            
            if (defaultVariant) {
                const defaultMatch = defaultVariant.name.match(colorRegex);
                if (defaultMatch) {
                    const defaultColor = defaultMatch[2].toLowerCase();
                    currentColorScheme[itemName] = defaultColor;
                    updateSelectionsByColor(defaultColor, itemName);
                }
            }
        }
    }
}

function findBackItems(asset) {
    if (!asset) return [];
    
    const backItems = dollAssets.filter(a => 
        a.name.toLowerCase().includes(' back') && 
        a.name.toLowerCase().includes(asset.name.toLowerCase().replace(' back', '')) &&
        (a.group === asset.group || a.baseGroup === asset.baseGroup)
    );
    
    return backItems;
}

function formatDisplayName(name) {
    // Remove layer numbers from display name
    name = name.replace(/\s\d+$/, '');
    
    const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
    const match = name.match(colorRegex);
    
    if (match) {
        return match[3].charAt(0).toUpperCase() + match[3].slice(1);
    }
    
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function groupAssetsByBaseName() {
    const groups = {};
    const colorRegex = /^(default\s+)?(red|blue|navy|white|brown|black|green|yellow|purple|pink|orange|grey|gray|olive|tan|beige|cream|gold|silver)\s+(.+)$/i;
    
    dollAssets
        .filter(asset => 
            (asset.group === currentGroup || asset.baseGroup === currentGroup) && 
            !asset.isComponent &&
            !asset.name.toLowerCase().includes(' back')
        )
        .forEach(asset => {
            const match = asset.name.match(colorRegex);
            if (match) {
                const baseName = match[3].toLowerCase();
                if (!groups[baseName]) groups[baseName] = [];
                groups[baseName].push(asset);
            } else {
                if (!groups[asset.name.toLowerCase()]) groups[asset.name.toLowerCase()] = [];
                groups[asset.name.toLowerCase()].push(asset);
            }
        });
    
    return groups;
}

function getSelectedBaseItem() {
    if (!groupSelections[currentGroup]) return null;
    
    return groupSelections[currentGroup].find(name => {
        const asset = dollAssets.find(a => a.name === name && (a.group === currentGroup || a.baseGroup === currentGroup));
        return asset && !asset.isComponent && !name.toLowerCase().includes(' back');
    });
}

function setColorScheme(colorName, itemName) {
    if (!itemName) return;
    
    currentColorScheme[itemName] = colorName;
    updateSelectionsByColor(colorName, itemName);
    
    renderNav();
    dollsMain(true);
}

function setMaskColor(name, color) {
	if (!dataUrls[name]) return;
	if (!color) return;

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	const img = imgs[name];
	if (!img) return;

	canvas.width = img.width;
	canvas.height = img.height;

	ctx.drawImage(img, 0, 0);

	ctx.globalCompositeOperation = "source-in";
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	dataUrls[name] = canvas.toDataURL();
}

function drawCharacter() {
	if (redrawDebounce) clearTimeout(redrawDebounce);

	redrawDebounce = setTimeout(() => {
		render();
	}, 100);
}

function dollsMain(redraw = true) {
	if (typeof navigator.clipboard.write !== "undefined") {
		document
			.querySelectorAll(".is-clipboard-button")
			.forEach((el) => el.classList.remove("hidden"));
	}

	if (!window._colorSchemesInitialized) {
		for (const [group, selections] of Object.entries(groupSelections)) {
			if (selections && selections.length > 0) {
				const baseItem = selections.find(itemName => {
					const asset = dollAssets.find(a => a.name === itemName && (a.group === group || a.baseGroup === group));
					return asset && !asset.isComponent && !itemName.toLowerCase().includes(' back');
				});
				
				if (baseItem) {
					setDefaultColorForItem(baseItem);
				}
			}
		}
		window._colorSchemesInitialized = true;
	}

	// Create gender toggle if it doesn't exist
	if (!document.querySelector('.gender-toggle')) {
		createGenderToggle();
	} else if (redraw) {
		updateGenderToggle();
	}

	renderNav();
	renderOptions();
	if (redraw) drawCharacter();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
	try {
		loadDollAssets();
		
		document.querySelector(".nav-nav-button.nav-previous").addEventListener("click", () => {
			const currentIndex = uniqueGroups.indexOf(currentGroup);
			if (currentIndex > 0) {
				currentGroup = uniqueGroups[currentIndex - 1];
				dollsMain();
			}
		});

		document.querySelector(".nav-nav-button.nav-next").addEventListener("click", () => {
			const currentIndex = uniqueGroups.indexOf(currentGroup);
			if (currentIndex < uniqueGroups.length - 1) {
				currentGroup = uniqueGroups[currentIndex + 1];
				dollsMain();
			}
		});

		dollsMain();
	} catch (error) {
		console.error("Initialization failed:", error);
		document.querySelector(".dolls-loading").textContent = "Failed to load doll assets. Please check the console for errors.";
	}
});


function generateDollImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Set canvas size based on window width
    const [width, height] = window.innerWidth > 800 ? [3000, 4500] : [1500, 2250];
    canvas.width = width;
    canvas.height = height;

    // Draw all layers
    getLayers()
        .sort((a, b) => a.layer - b.layer)
        .forEach(layer => {
            const img = new Image();
            img.src = layer.path;
            
            if (layer.mask) {
                // Create color mask
                const maskCanvas = document.createElement("canvas");
                const maskCtx = maskCanvas.getContext("2d");
                maskCanvas.width = width;
                maskCanvas.height = height;
                
                maskCtx.drawImage(img, 0, 0, width, height);
                maskCtx.globalCompositeOperation = 'source-in';
                maskCtx.fillStyle = layer.color;
                maskCtx.fillRect(0, 0, width, height);
                
                ctx.drawImage(maskCanvas, 0, 0);
            } else {
                ctx.drawImage(img, 0, 0, width, height);
            }
        });

    return canvas;
}

async function downloadDollImage(writeToClipboard = false) {
    const copyText = document.querySelectorAll(".copy-link .text");
    const downloadText = document.querySelectorAll(".download-link .text");
    
    if (writeToClipboard) {
        copyText.forEach(text => text.innerText = "Working...");
    } else {
        downloadText.forEach(text => text.innerText = "Working...");
    }

    setTimeout(() => {
        const canvas = generateDollImage();

        if (writeToClipboard) {
            const item = new ClipboardItem({
                "image/png": new Promise(async (resolve) => {
                    canvas.toBlob((blob) => {
                        resolve(blob, { type: "image/png" });
                    });
                }),
            });
            navigator.clipboard.write([item]);
        } else {
            download(canvas);
        }

        downloadText.forEach(text => text.innerText = "Download Image");
        copyText.forEach(text => text.innerText = "Copy Image to Clipboard");
    }, 100);
}

async function downloadDollFace(evt) {
    const text = evt.currentTarget.querySelector(".text");
    text.innerText = "Working...";

    setTimeout(() => {
        const full = generateDollImage();
        const squareSize = full.width / 2.5;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = squareSize;
        canvas.height = squareSize;

        ctx.translate(-full.width / 2, -full.height / 15);
        ctx.drawImage(full, squareSize / 2, 0);

        download(canvas, "Profile Picture");
        text.innerText = "Download Profile Picture";
    }, 100);
}

function download(canvas, fileName = "Character") {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = `${fileName}.png`;
    a.click();
}


function renderColorPalette(container, colors, itemName) {
    container.innerHTML = '';
    
    for (const [colorName, colorHex] of Object.entries(colors)) {
        const circle = document.createElement("div");
        circle.classList.add("color-circle");
        circle.setAttribute("style", `--color: ${colorHex}`);
        circle.setAttribute("data-color-name", colorName);
        
        if (currentColorScheme[itemName] === colorName) {
            circle.classList.add("active");
        }
        
        circle.addEventListener("click", () => {
            container.querySelectorAll(".color-circle").forEach(c => c.classList.remove("active"));
            circle.classList.add("active");
            setColorScheme(colorName, itemName);
        });
        
        container.appendChild(circle);
    }
}