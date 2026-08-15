// Created by MACsepehri Copyright 2026
// more info at github : https://github.com/MACsepehri/JavascriptMarkdownSystem
// Here there are comments for getting more info of what does each part do.



// assets path
let python_txt = "assets/python.txt"
let html_tags = "assets/html_tags.txt"
let css_properties = "assets/css_properties.txt"





// show lines
function showLines() {
    const contentDivs = document.querySelectorAll('.content');
    
    contentDivs.forEach(contentDiv => {
        const container = contentDiv.parentElement;
        if (!container) return;
        
        if (container.querySelector('.line-numbers')) return;
        
        const codeText = contentDiv.textContent;
        const lines = codeText.split('\n');
        
        const lineNumbersDiv = document.createElement('div');
        lineNumbersDiv.className = 'line-numbers';
        lineNumbersDiv.style.cssText = `
            position: absolute;
            left: 0;
            top: 40px;
            padding: 20px 10px;
            text-align: right;
            user-select: none;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.6;
            min-width: 45px;
            background-color: rgba(0, 0, 0, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            height: auto;
            overflow: hidden;
            box-sizing: border-box;
            pointer-events: none;
            z-index: 1;
        `;
        
        lines.forEach((_, index) => {
            const lineNum = document.createElement('div');
            lineNum.textContent = index + 1;
            lineNum.style.cssText = `
                color: #858585;
                font-size: 14px;
                line-height: 1.6;
                padding: 0 5px;
                font-family: 'Courier New', monospace;
                white-space: nowrap;
            `;
            lineNumbersDiv.appendChild(lineNum);
        });
        
        container.style.position = 'relative';
        container.style.paddingLeft = '60px';
        
        container.insertBefore(lineNumbersDiv, contentDiv);
        
        contentDiv.style.paddingLeft = '0';
        contentDiv.style.marginLeft = '0';
        contentDiv.style.marginTop = '0';
        
        const header = container.querySelector('.header');
        if (header) {
            header.style.position = 'relative';
            header.style.left = '0';
            header.style.paddingLeft = '60px';
            header.style.width = 'calc(100% - 60px)';
            header.style.boxSizing = 'border-box';
        }
        
        contentDiv.addEventListener('scroll', function() {
            lineNumbersDiv.scrollTop = this.scrollTop;
        });
    });
}


// markdown of languages
async function markdownPython(tag) {
    let functions = [];
    let bools = ['True', 'False', 'None'];

    try {
        const response = await fetch(python_txt);
        const text = await response.text();

        const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
        
        functions = lines
            .filter(line => !line.startsWith("#"))
            .map(line => line.replace("()", ""));

        const boolLines = lines.filter(line => line.startsWith("#bool:"));
        if (boolLines.length > 0) {
            bools = boolLines[0]
                .replace("#bool:", "")
                .split(",")
                .map(b => b.trim());
        }

    } catch (error) {
        console.error("Error fetching python functions:", error);
        return;
    }

    if (functions.length === 0) {
        throw Error("Cannot find python file assets.");
    }

    const code = tag.innerText;

    let html = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    html = html.replace(
        /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
        `<span style="color: #ce9178;">$1</span>`
    );

    const escapedFunctions = functions.map(
        name => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const functionRegex = new RegExp(
        `\\b(${escapedFunctions.join("|")})\\b(?=\\s*\\()`,
        "g"
    );

    html = html.replace(
        functionRegex,
        `<span style="color: #ffd700;">$1</span>`
    );

    const escapedBools = bools.map(
        name => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const boolRegex = new RegExp(
        `\\b(${escapedBools.join("|")})\\b`,
        "g"
    );

    html = html.replace(
        boolRegex,
        `<span style="color: #569cd6;">$1</span>`
    );

    tag.innerHTML = html;
}

async function markdownHtml(tag) {
    let data = [];

    try {
        const response = await fetch(html_tags);
        const text = await response.text();

        data = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

    } catch (error) {
        console.error("Error fetching html tags:", error);
        return;
    }

    if (data.length === 0) {
        throw Error("Cannot find html file assets.");
    }

    const code = tag.textContent;

    const escapeHtml = text => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };

    const escapedTags = data.map(
        name => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    const tagNames = escapedTags.join("|");

    const tagRegex = new RegExp(
        `<\\/?(?:${tagNames})(?:\\s+[^<>]*?)?\\s*\\/?>`,
        "g"
    );

    let result = "";
    let lastIndex = 0;

    for (const match of code.matchAll(tagRegex)) {
        const index = match.index;
        const originalTag = match[0];

        result += escapeHtml(
            code.slice(lastIndex, index)
        );

        const isClosing = originalTag.startsWith("</");
        const isSelfClosing = originalTag.endsWith("/>");

        const nameMatch = originalTag.match(
            new RegExp(`^<\\/?(${tagNames})`)
        );

        if (!nameMatch) {
            result += escapeHtml(originalTag);
            lastIndex = index + originalTag.length;
            continue;
        }

        const tagName = nameMatch[1];

        let attributes = originalTag.slice(
            nameMatch[0].length
        );

        attributes = escapeHtml(attributes);

        attributes = attributes.replace(
            /\b([a-zA-Z_:][\w:.-]*)(?=\s*=)/g,
            `<span style="color: #9cdcfe;">$1</span>`
        );

        attributes = attributes.replace(
            /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
            `<span style="color: #ce9178;">$1</span>`
        );

        result += isClosing
            ? `&lt;/<span style="color: #569cd6;">${tagName}</span>${attributes}`
            : `&lt;<span style="color: #569cd6;">${tagName}</span>${attributes}`;

        lastIndex = index + originalTag.length;
    }

    result += escapeHtml(
        code.slice(lastIndex)
    );

    tag.innerHTML = result;
}

async function markdownCss(tag) {
    let properties = [];

    try {
        const response = await fetch(css_properties);
        const text = await response.text();

        properties = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

    } catch (error) {
        console.error("Error fetching CSS properties:", error);
        return;
    }

    if (properties.length === 0) {
        throw Error("Cannot find CSS properties file.");
    }

    const code = tag.textContent;

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const propertyList = properties
        .map(escapeRegex)
        .join("|");

    const blockRegex = /([^{}]+)\{([^{}]*)\}/g;

    let result = "";
    let lastIndex = 0;

    for (const match of code.matchAll(blockRegex)) {
        const selector = match[1];
        const body = match[2];
        const index = match.index;

        result += escapeHtml(
            code.slice(lastIndex, index)
        );

        result += escapeHtml(selector);

        result += `<span style="color: #d4d4d4;">{</span>`;

        const declarationRegex =
            /([^:;]+):([^;]+);?/g;

        let bodyResult = "";
        let bodyLastIndex = 0;

        for (const declaration of body.matchAll(declarationRegex)) {
            const property = declaration[1];
            const value = declaration[2];
            const fullMatch = declaration[0];

            const declarationIndex = declaration.index;

            bodyResult += escapeHtml(
                body.slice(bodyLastIndex, declarationIndex)
            );
            const cleanProperty = property.trim();

            const propertyMatch = new RegExp(
                `^(${propertyList})$`
            ).test(cleanProperty);

            if (propertyMatch) {
                bodyResult += escapeHtml(
                    property.slice(0, property.indexOf(cleanProperty))
                );

                bodyResult +=
                    `<span style="color: #9cdcfe;">${escapeHtml(cleanProperty)}</span>`;
            } else {
                bodyResult += escapeHtml(property);
            }

            bodyResult += ":";

            let valueHtml = escapeHtml(value);

            const strings = [];

            valueHtml = valueHtml.replace(
                /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
                match => {
                    const id = strings.length;

                    strings.push(
                        `<span style="color: #ce9178;">${match}</span>`
                    );

                    return `___STRING_${id}___`;
                }
            );

            const colors = [];

            valueHtml = valueHtml.replace(
                /#[0-9a-fA-F]{3,8}\b/g,
                match => {
                    const id = colors.length;

                    colors.push(
                        `<span style="color: #b5cea8;">${match}</span>`
                    );

                    return `___COLOR_${id}___`;
                }
            );

            const numbers = [];

            valueHtml = valueHtml.replace(
                /(?<![\w-])\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|vmin|vmax|s|ms|deg)?\b/g,
                match => {
                    const id = numbers.length;

                    numbers.push(
                        `<span style="color: #b5cea8;">${match}</span>`
                    );

                    return `___NUMBER_${id}___`;
                }
            );

            const important = [];

            valueHtml = valueHtml.replace(
                /!important\b/g,
                match => {
                    const id = important.length;

                    important.push(
                        `<span style="color: #c586c0;">${match}</span>`
                    );

                    return `___IMPORTANT_${id}___`;
                }
            );

            strings.forEach((value, id) => {
                valueHtml = valueHtml.replace(
                    `___STRING_${id}___`,
                    value
                );
            });

            colors.forEach((value, id) => {
                valueHtml = valueHtml.replace(
                    `___COLOR_${id}___`,
                    value
                );
            });

            numbers.forEach((value, id) => {
                valueHtml = valueHtml.replace(
                    `___NUMBER_${id}___`,
                    value
                );
            });

            important.forEach((value, id) => {
                valueHtml = valueHtml.replace(
                    `___IMPORTANT_${id}___`,
                    value
                );
            });

            bodyResult += valueHtml;

            if (fullMatch.endsWith(";")) {
                bodyResult += ";";
            }

            bodyLastIndex =
                declarationIndex + fullMatch.length;
        }

        bodyResult += escapeHtml(
            body.slice(bodyLastIndex)
        );

        result += bodyResult;

        result += `<span style="color: #d4d4d4;">}</span>`;

        lastIndex = index + match[0].length;
    }

    result += escapeHtml(
        code.slice(lastIndex)
    );

    tag.innerHTML = result;
}






function copyText(text) {
    try {
        navigator.clipboard.writeText(text);
        alert("Text has successfuly copied.");
    }
    catch {
        alert("An error happened while coping text.");
    }
}

function markdown(className, idName, theme="dark") {
    // handle selecting the box of code and error
    let box = null;
    if (className === null || className === "") { box = document.getElementById(idName); }
    else if (idName == null || idName === "") { box = document.getElementsByClassName(className)[0]; }
    else { throw Error("Please give className or idName in inputs"); }
    if (box === null) { throw Error("The selection is invalid."); }

    // storing the original text content
    let markdownContent = box.innerText;

    // clearing the box
    box.innerHTML = "";

    // create the main container
    let container = document.createElement("div");
    container.className = "header";
    container.style.width = "500px";
    container.style.height = "600px";
    container.style.overflow = "auto";
    container.style.overflowX = "hidden";
    container.style.padding = "0";
    container.style.borderRadius = "20px";
    container.style.boxSizing = "border-box";

    // create header
    let header = document.createElement("div");
    header.style.width = "100%";
    header.style.height = "40px";
    header.style.margin = "0";
    header.style.padding = "0";
    header.style.paddingLeft = "20px";
    header.style.paddingRight = "20px";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.overflow = "hidden";
    
    // left section (copy button + markdown text)
    let leftSection = document.createElement("div");
    leftSection.style.display = "flex";
    leftSection.style.alignItems = "center";
    leftSection.style.gap = "15px";
    
    let titleText = document.createElement("span");
    titleText.innerText = "Code Preview";
    titleText.style.fontWeight = "bold";
    titleText.style.fontSize = "16px";
    
    leftSection.appendChild(titleText);
    
    // right section (image)
    let rightSection = document.createElement("div");
    rightSection.style.display = "flex";
    rightSection.style.alignItems = "center";
    
    let image = document.createElement("img");
    image.title = "Copy";
    image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Rlo9z-2LhLaC5s2-ERmtnNUQYziPsijOnushRy8kNw&s=10";
    image.style.width = "24px";
    image.style.height = "24px";
    image.style.borderRadius = "5px";
    image.style.cursor = "pointer";
    image.style.display = "block";
    image.style.marginRight = "40px";
    image.onclick = function() { copyText(content.innerText); };
    rightSection.appendChild(image);
    
    header.appendChild(leftSection);
    header.appendChild(rightSection);

    // create content area for markdown
    let content = document.createElement("div");
    content.className = "content";

    content.style.width = "100%";
    content.style.padding = "20px";
    content.style.boxSizing = "border-box";
    content.style.position = "absolute";
    content.style.top = "45px";

    content.style.setProperty("white-space", "pre-wrap", "important");
    content.style.setProperty("text-align", "left", "important");
    
    container.style.paddingLeft = '60px';
    header.style.paddingLeft = '60px';
    header.style.width = 'calc(100% - 60px)';
    header.style.position = "absolute";
    header.style.left = "0";
    
    // set theme
    if (theme === "dark") {
        container.style.backgroundColor = "#1e1e1e";
        container.style.color = "#d4d4d4";
        header.style.backgroundColor = "#212121";
        header.style.color = "#ffffff";
        header.style.borderRadius = "20px 20px 0 0";
    }
    else if (theme === "light") {
        container.style.backgroundColor = "#ffffff";
        container.style.color = "#333333";
        container.style.border = "1px solid #ddd";
        header.style.backgroundColor = "#f5f5f5";
        header.style.color = "#333333";
        header.style.borderRadius = "20px 20px 0 0";
        header.style.borderBottom = "1px solid #ddd";
    }

    // detect language and remove it from content
    let displayContent = markdownContent;

    const langMatch = markdownContent.match(/```(\w+)\n/);

    if (langMatch) {
        titleText.innerText = langMatch[1];

        displayContent = markdownContent.replace(
            /```\w+\n/,
            ""
        );

        displayContent = displayContent.replaceAll(
            "```",
            ""
        );
    }
    else {
        displayContent = markdownContent.replaceAll(
            "```",
            ""
        );
    }

    // Add original text
    content.textContent = displayContent;

    // Preserve formatting
    content.style.whiteSpace = "pre-wrap";

    // Highlight
    if (langMatch) {

        if (langMatch[1] === "python") {
            markdownPython(content);
        }

        else if (langMatch[1] === "html") {
            markdownHtml(content);
        }

        else if (langMatch[1] === "css") {
            markdownCss(content);
        }
    }

    // append everything
    container.appendChild(header);
    container.appendChild(content);
    box.appendChild(container);
    showLines();
}

export default markdown;