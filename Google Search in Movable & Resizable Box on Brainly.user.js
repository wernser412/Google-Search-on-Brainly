// ==UserScript==
// @name         Google Search in Movable & Resizable Box on Brainly
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Muestra un icono de búsqueda de Google al seleccionar texto en Brainly y abre los resultados en un cuadro movible y redimensionable sin retraso.
// @downloadURL  https://github.com/wernser412/Google-Search-on-Brainly/raw/refs/heads/main/Google%20Search%20in%20Movable%20&%20Resizable%20Box%20on%20Brainly.user.js
// @icon         https://github.com/wernser412/Google-Search-on-Brainly/raw/refs/heads/main/icono.ico
// @author       wernser412
// @match        https://brainly.lat/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let searchBox, searchFrame, searchIcon, resizeHandle;

    function createSearchUI() {
        // Crear el icono de búsqueda
        searchIcon = document.createElement("img");
        searchIcon.src = "https://www.google.com/favicon.ico";
        searchIcon.style.cssText = `
            position: absolute;
            width: 24px;
            height: 24px;
            cursor: pointer;
            background: white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            padding: 4px;
            display: none;
            z-index: 9999;
        `;
        document.body.appendChild(searchIcon);

        // Crear el cuadro de búsqueda
        searchBox = document.createElement("div");
        searchBox.style.cssText = `
            position: fixed;
            width: 500px;
            height: 400px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            overflow: hidden;
            z-index: 9999;
            display: none;
            top: 50px;
            left: 50px;
        `;

        // Crear la barra de título para mover el cuadro
        let titleBar = document.createElement("div");
        titleBar.style.cssText = `
            width: 100%;
            height: 30px;
            background: #0078D7;
            color: white;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            padding-left: 10px;
            cursor: grab;
        `;
        titleBar.innerText = "Google Search";

        // Crear el botón de cierre
        let closeButton = document.createElement("span");
        closeButton.innerText = "✖";
        closeButton.style.cssText = `
            margin-left: auto;
            margin-right: 10px;
            cursor: pointer;
        `;
        closeButton.onclick = () => searchBox.style.display = "none";

        titleBar.appendChild(closeButton);
        searchBox.appendChild(titleBar);

        // Crear el iframe para mostrar los resultados de búsqueda
        searchFrame = document.createElement("iframe");
        searchFrame.style.cssText = `
            width: 100%;
            height: calc(100% - 30px);
            border: none;
        `;
        searchBox.appendChild(searchFrame);

        // Crear un manejador para redimensionar
        resizeHandle = document.createElement("div");
        resizeHandle.style.cssText = `
            width: 15px;
            height: 15px;
            background: #0078D7;
            position: absolute;
            bottom: 0;
            right: 0;
            cursor: se-resize;
        `;
        searchBox.appendChild(resizeHandle);

        // Función para mover el cuadro
        titleBar.onmousedown = function(event) {
            let startX = event.clientX;
            let startY = event.clientY;
            let startLeft = searchBox.offsetLeft;
            let startTop = searchBox.offsetTop;

            function moveAt(event) {
                let newLeft = startLeft + (event.clientX - startX);
                let newTop = startTop + (event.clientY - startY);
                searchBox.style.left = newLeft + "px";
                searchBox.style.top = newTop + "px";
            }

            function stopMove() {
                document.removeEventListener("mousemove", moveAt);
                document.removeEventListener("mouseup", stopMove);
            }

            document.addEventListener("mousemove", moveAt);
            document.addEventListener("mouseup", stopMove);
        };

        // Optimización del redimensionamiento con requestAnimationFrame
        resizeHandle.onmousedown = function(event) {
            event.preventDefault();

            let startX = event.clientX;
            let startY = event.clientY;
            let startWidth = searchBox.offsetWidth;
            let startHeight = searchBox.offsetHeight;

            let resize = (event) => {
                requestAnimationFrame(() => {
                    let newWidth = Math.max(300, startWidth + (event.clientX - startX));
                    let newHeight = Math.max(200, startHeight + (event.clientY - startY));
                    searchBox.style.width = newWidth + "px";
                    searchBox.style.height = newHeight + "px";
                });
            };

            let stopResize = () => {
                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stopResize);
            };

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        };

        document.body.appendChild(searchBox);
    }

    function onTextSelect(event) {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            searchIcon.style.left = `${rect.right + window.scrollX + 5}px`;
            searchIcon.style.top = `${rect.top + window.scrollY}px`;
            searchIcon.style.display = "block";

            searchIcon.onclick = () => {
                searchFrame.src = `https://www.google.com/search?igu=1&q=${encodeURIComponent(selectedText)}`;
                searchBox.style.display = "block";
            };
        } else {
            searchIcon.style.display = "none";
        }
    }

    document.addEventListener("mouseup", onTextSelect);
    createSearchUI();
})();
