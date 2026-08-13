// markdown of languages
async function markdownPython(tag) {
    let functions = [];
    let bools = ['True', 'False', 'None'];

    try {
        const response = await fetch("assets/python.txt");
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
        const response = await fetch("assets/html_tags.txt");
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

    // Get original code
    const code = tag.textContent;

    // Escape HTML
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

    // Find complete HTML tags
    const tagRegex = new RegExp(
        `<\\/?(?:${tagNames})(?:\\s+[^<>]*?)?\\s*\\/?>`,
        "g"
    );

    let result = "";
    let lastIndex = 0;

    for (const match of code.matchAll(tagRegex)) {
        const index = match.index;
        const originalTag = match[0];

        // Normal text before the tag
        result += escapeHtml(
            code.slice(lastIndex, index)
        );

        // -------------------------
        // Process HTML tag
        // -------------------------

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

        // Everything after tag name
        let attributes = originalTag.slice(
            nameMatch[0].length
        );

        // Escape attributes
        attributes = escapeHtml(attributes);

        // Highlight attributes
        attributes = attributes.replace(
            /\b([a-zA-Z_:][\w:.-]*)(?=\s*=)/g,
            `<span style="color: #9cdcfe;">$1</span>`
        );

        // Highlight attribute values
        attributes = attributes.replace(
            /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
            `<span style="color: #ce9178;">$1</span>`
        );

        // Build final tag
        result += isClosing
            ? `&lt;/<span style="color: #569cd6;">${tagName}</span>${attributes}`
            : `&lt;<span style="color: #569cd6;">${tagName}</span>${attributes}`;

        lastIndex = index + originalTag.length;
    }

    // Remaining text
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
    content.style.margin = "0";
    
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

        displayContent = markdownContent.replace(/```\w+\n/, "");
        displayContent = displayContent.replaceAll("```", "");
    } else {
        displayContent = markdownContent.replaceAll("```", "");
    }

    // add content to the content area
    content.innerText = displayContent;

    // highlight Python
    if (langMatch && langMatch[1] === "python") {
        markdownPython(content);
    }
    else if (langMatch && langMatch[1] === "html") {
        markdownHtml(content);
    }

    // append everything
    container.appendChild(header);
    container.appendChild(content);
    box.appendChild(container);
}

export default markdown;