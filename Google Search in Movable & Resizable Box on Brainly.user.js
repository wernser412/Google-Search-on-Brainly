// ==UserScript==
// @name         Google Search in Movable & Resizable Box on Brainly
// @namespace    http://tampermonkey.net/
// @version      2025.09.08
// @description  Muestra un icono de búsqueda de Google al seleccionar texto en Brainly y abre los resultados en un cuadro movible y redimensionable sin retraso.
// @downloadURL  https://github.com/wernser412/Google-Search-on-Brainly/raw/refs/heads/main/Google%20Search%20in%20Movable%20&%20Resizable%20Box%20on%20Brainly.user.js
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAEEklEQVR4nO2av0tzVxzGP6l5o2isCIIv2poIbX1Noq+aDuKaQdxVcOqog5jFH4vi4iBu/gHi5KCQyVFEBxUhVrFNYo1FMEReqENjpcU2mtMhRnNrbjTv/ZXY+8DlJOb8eJ7nnPs933OvYMKEif8zLEYT0BDlwDeAF3AB7ofPDdmVrPrzUh3vgK95EpgR+wH44qXGpWZAA9LZzHyu+NwOi9WAWtLCssV+BOxqD2S0AV8C3yIV+z3wXi8CehnwDviOJ5GZshWDA7EWBjQgvT9dgId0VC46KDEgc59mi+0AqlTgpRteY0AN6f00W2wbUK8hL92Qy4AfSIttfyi/0pWRzsgVgITuLPSFRPOLmdJbh2mA0QSMhqGZYF1dHR6PB4fDgdPpxOFwYLfbub6+JhqNEggEOD8/15SDLkGwuroal8tFW1sbHo/n8aqvz7+TCiGYn59nenqaVCqlFh2L7JfMuEp6b2lpoaurSyLW6XRisXx+xjszM8Pc3JwSWtl4kYhQcm1tbQm1kUgkhM1mU8Qr65KgJIJgTU0Nbrdbk75LwgCAyspKTfo1bBeIx+Ps7+9zenpKbW0tw8PDlJWVyda/uLjQjZsuMcDv90vaLS8vy9Y9PDxU6/7XPgasra0xMjLC0tJSQe2qquRP0QsLC0ppFQRVnJ6cnHzVCqioqBB+v1/c39/nrBcIBITFYtFsBRhmwNHRkTg4OBC3t7eyddbX14XdbldTfPFsgx0dHXi9XsrLcz8pS6VSJJNJBgcHsdlsunLTZQUUglAoJJqamt7WCigEbreb1dVVRem0HErCAIDu7m56enpU79cwA4LBILOzs/T399Pe3o7P5yMej+dt4/V6VedhWCa4srLC4uLis79NTU3JtrFa1adbVLdAc3Nz3t8vLy9VH9Pod4NAOgscHR1lYGBAto4QgmAwqPrYhhnQ29tLZ2fn40MTuXwgg52dHU0ejxlmQF9f36vrJpNJxsbGNGQjhaJEY2JiQmxvb4tEIqFKEnR3dyeGhoZK5yyg5iOxWCwmfD7f2zwL5EMsFmN8fJzW1lY2Nzc1HasodoGrqyuOj4/Z29tjY2OD3d1dhHjValUMXQ24ubkhGo0SiUQIh8OPpdYvP/JBEwOSySRnZ2cSkZFIhJOTEzVfcGgGRUGmsbFRWK1WtQOXZkHQ/P8Ao1gUC0wDjCZgNIoiD9AYfwInwM9A+L8/viUD7oAYEAF+JC02AvwC3Ms1KlUDPvEkMCM2DNwW2lGxG/A7z2f0iPSyVgXFYkCCp1mMPJQ/Ab9pPbDeBvwD/Ip0RsOAYYcBrQxIAmdIRUZIR+OiOgyoYcAnns9oCPhbhb41RyEGZEfeTHkI/KUBL92Qy4Ar0klDiLTQTALxh468TJgwYUIX/Atm/TIQO00IWQAAAABJRU5ErkJggg==
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
