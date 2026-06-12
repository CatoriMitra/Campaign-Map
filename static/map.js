const canvas =
    document.getElementById(
        "mapCanvas"
    );

const ctx =
    canvas.getContext("2d");

const HEX_SIZE = 20;

const hexes = [];

let selectedHex = null;

let showRegionOverlay = false;

const mapImage = new Image();
mapImage.src = "/static/map.jpg";

const regionImage = new Image();
regionImage.src = "/static/regions.png";

mapImage.onload = () => {

    canvas.width =
        mapImage.width;

    canvas.height =
        mapImage.height;

    drawMap();

};

function drawMap() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Base map

    ctx.drawImage(
        mapImage,
        0,
        0
    );

    // Region overlay

    if (showRegionOverlay) {

        ctx.drawImage(
            regionImage,
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

    drawHexGrid();

    if (selectedHex) {

        drawHex(
            selectedHex.x,
            selectedHex.y,
            HEX_SIZE,
            "red",
            3
        );

    }

}

function drawHex(
    centerX,
    centerY,
    size,
    color = "rgba(0,0,0,0.4)",
    lineWidth = 1
) {

    ctx.beginPath();

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const angle =
            (Math.PI / 180)
            * (60 * i - 30);

        const x =
            centerX +
            size *
            Math.cos(angle);

        const y =
            centerY +
            size *
            Math.sin(angle);

        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        }
        else {

            ctx.lineTo(
                x,
                y
            );

        }

    }

    ctx.closePath();

    ctx.strokeStyle =
        color;

    ctx.lineWidth =
        lineWidth;

    ctx.stroke();

}

function drawHexGrid() {

    hexes.length = 0;

    const hexWidth =
        Math.sqrt(3)
        * HEX_SIZE;

    const hexHeight =
        HEX_SIZE * 2;

    const verticalSpacing =
        hexHeight * 0.75;

const cols = Math.ceil(canvas.width / hexWidth) + 2;
const rows = Math.ceil(canvas.height / verticalSpacing) + 2;

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const x =
                col *
                hexWidth +
                (
                    row % 2
                    ? hexWidth / 2
                    : 0
                );

            const y =
                row *
                verticalSpacing;

            const hexId =
                `H${row
                    .toString()
                    .padStart(
                        3,
                        "0"
                    )}${col
                    .toString()
                    .padStart(
                        3,
                        "0"
                    )}`;

            drawHex(
                x,
                y,
                HEX_SIZE
            );

            hexes.push({
                id: hexId,
                row: row,
                col: col,
                x: x,
                y: y
            });

        }

    }

}


canvas.addEventListener(
    "click",
    handleClick
);

function handleClick(
    event
) {

    const rect =
        canvas
        .getBoundingClientRect();

    const mouseX =
        event.clientX
        - rect.left;

    const mouseY =
        event.clientY
        - rect.top;

    let nearest =
        null;

    let nearestDistance =
        Infinity;

    for (
        const hex
        of hexes
    ) {

        const dx =
            mouseX
            - hex.x;

        const dy =
            mouseY
            - hex.y;

        const distance =
            Math.sqrt(
                dx * dx
                + dy * dy
            );

        if (
            distance <
            nearestDistance
        ) {

            nearestDistance =
                distance;

            nearest =
                hex;

        }

    }

    selectedHex =
        nearest;

    drawMap();

    document
        .getElementById(
            "hexInfo"
        )
        .innerHTML = `
        <b>Selected Hex</b><br>
        ID: ${nearest.id}<br>
        Row: ${nearest.row}<br>
        Column: ${nearest.col}<br>
        X: ${Math.round(nearest.x)}<br>
        Y: ${Math.round(nearest.y)}
    `;

}

// Admin button

const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");

adminBtn.addEventListener("click", () => {

    if (adminPanel.style.display === "none" || adminPanel.style.display === "") {
        adminPanel.style.display = "block";
    } else {
        adminPanel.style.display = "none";
    }

});

async function loginAdmin() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const res = await fetch("/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    if (res.ok) {
        alert("Admin access granted");
        enableAdminMode();
    } else {
        alert("Invalid login");
    }
}

let adminMode = false;

function enableAdminMode() {
    adminMode = true;

    document.getElementById("adminPanel").style.display = "none";

    alert("Admin mode enabled");
}

canvas.addEventListener("click", (event) => {

    if (!adminMode) {
        handleNormalClick(event);
        return;
    }

    handleAdminClick(event);
});

function handleAdminClick(event) {

    const name = prompt("Settlement name?");
    const type = prompt("Type?");
    const house = prompt("House?");
    const population = prompt("Population?");

    fetch("/admin/update_settlement", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            update: {
                type,
                house,
                population
            }
        })
    });

}

// Region Overlay button

document
.getElementById(
    "toggleRegions"
)
.addEventListener(
    "click",
    () => {

        showRegionOverlay =
            !showRegionOverlay;

        drawMap();

    }
);