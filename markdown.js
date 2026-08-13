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
    image.onclick = function() { copyText(box.innerText.replace("Code Preview", "")); };
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

    // add content to the content area (not the container)
    content.innerText = markdownContent.replace(/```/g, "");

    // append everything
    container.appendChild(header);
    container.appendChild(content);
    box.appendChild(container);
}

export default markdown;