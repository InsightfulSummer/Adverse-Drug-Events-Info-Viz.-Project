const _ = window._;
let originalData = [];
const margin = { top: 10, right: 10, bottom: 10, left: 10 },
    outerWidth = document.getElementById("treemap").clientWidth - margin.left - margin.right,
    outerHeight = document.getElementById("treemap").clientHeight - margin.top - margin.bottom,
    countryMargin = 0,
    productMargin = 4,
    countryPadding = 4;

let groupedData = [];
let totalReports = 0;
let minDate, maxDate;
let selectedStartDate, selectedEndDate;
let currentEnlargedElement = null;
let currentReports = [];

const svg = d3.select("#treemap")
    .append("svg")
    .attr("width", outerWidth + margin.left + margin.right)
    .attr("height", outerHeight + margin.top + margin.bottom)
    .style("border", "4px solid black")
    .attr("class", "world-svg");

const zoomGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
    });

svg.call(zoom);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const outcomeColors = {
    "Death": "#ff6a6a",
    "Life-Threatening": "#ff8534",
    "Disabling": "#ffb27f",
    "Hospitalization": "#ffed92",
    "Not Serious": "#b3ff55",
    "Other": "#9ffff5"
};

function createGradient(id, color) {
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(color).brighter(1));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(color).darker(1));
}

Object.keys(outcomeColors).forEach(outcome => {
    createGradient(outcome + "-gradient", outcomeColors[outcome]);
});

const reportSlider = document.getElementById("report-slider");
const reportCount = document.getElementById("report-count");

reportSlider.addEventListener("input", function () {
    const value = parseInt(reportSlider.value, 10);
    reportCount.textContent = `${value} reports`;
    updateTreemap();
});

function updateTreemap() {
    const selectedReports = parseInt(reportSlider.value, 10);
    const filteredData = filterDataByReportLimitAndDateRange(originalData, selectedReports, selectedStartDate, selectedEndDate);
    drawTreemap(filteredData);
}

function parseDateString(dateString) {
    if (!dateString || dateString.length !== 8) return null;
    var year = parseInt(dateString.substring(0, 4), 10);
    var month = parseInt(dateString.substring(4, 6), 10);
    var day = parseInt(dateString.substring(6, 8), 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    var date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
}

d3.csv("data.csv", function(d) {
    d.StartDate = parseDateString(d.StartDate);
    d.EndDate = parseDateString(d.EndDate);

    if (d.PatientSex === '1') {
        d.PatientSex = 'male';
    } else if (d.PatientSex === '2') {
        d.PatientSex = 'female';
    } else {
        d.PatientSex = 'unknown';
    }
    d.PatientAge = d.PatientAge || 'unknown';
    d.PatientWeight = d.PatientWeight || 'unknown';

    d.Outcome = d.Outcome.trim();
    if (!outcomeColors.hasOwnProperty(d.Outcome)) {
        d.Outcome = "Other";
    }

    return d;
}).then(function(data) {

    originalData = data;
    const allStartDates = data.map(d => d.StartDate).filter(d => d != null);
    const allEndDates = data.map(d => d.EndDate).filter(d => d != null);
    minDate = d3.min(allStartDates);
    maxDate = d3.max(allEndDates);

    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(23, 59, 59, 999);

    selectedStartDate = minDate;
    selectedEndDate = maxDate;

    groupedData = groupDataByCountryAndProduct(data);
    totalReports = data.length;

    initializeSlider(totalReports);
    initializeDateRangeSlider();
    updateTreemap();

    document.getElementById('search-bar').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        stopAllBeating();

        d3.selectAll(".product-outer").classed("highlight", false).classed("beating", false);

        if (query) {
            d3.selectAll(".product").each(function (d) {
                const productName = d.data.key.toLowerCase();
                const countryName = d.parent.data.key.toLowerCase();

                if (productName.includes(query) || countryName.includes(query)) {
                    const productRect = d3.select(this).select(".product-outer");
                    productRect.classed("highlight", true).classed("beating", true);
                }
            });
        }
    });
});

function filterDataByReportLimitAndDateRange(data, reportLimit, selectedStartDate, selectedEndDate) {
    const limitedReports = data.slice(0, reportLimit);
    const filteredReports = limitedReports.filter(report => {
        const reportStartDate = report.StartDate;
        const reportEndDate = report.EndDate;
        const startDateValid = !reportStartDate || reportStartDate >= selectedStartDate;
        const endDateValid = !reportEndDate || reportEndDate <= selectedEndDate;

        return startDateValid && endDateValid;
    });
    const groupedData = groupDataByCountryAndProduct(filteredReports);
    return groupedData;
}

function formatDate(date) {
    if (!(date instanceof Date)) return '';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function initializeDateRangeSlider() {
    const timelineBar = document.getElementById('timeline-bar');
    const leftHandle = document.createElement('div');
    const rightHandle = document.createElement('div');
    const selectedRange = document.createElement('div');
    const leftDateDisplay = document.createElement('div');
    const rightDateDisplay = document.createElement('div');

    leftHandle.id = 'left-handle';
    rightHandle.id = 'right-handle';
    selectedRange.id = 'selected-range';
    leftDateDisplay.id = 'left-date-display';
    rightDateDisplay.id = 'right-date-display';

    leftHandle.className = 'handle';
    rightHandle.className = 'handle';
    leftDateDisplay.className = 'date-display';
    rightDateDisplay.className = 'date-display';

    timelineBar.appendChild(selectedRange);
    timelineBar.appendChild(leftHandle);
    timelineBar.appendChild(rightHandle);
    timelineBar.appendChild(leftDateDisplay);
    timelineBar.appendChild(rightDateDisplay);

    const timelineWidth = timelineBar.offsetWidth;
    leftHandle.style.left = '0px';
    rightHandle.style.left = (timelineWidth - rightHandle.offsetWidth) + 'px';

    updateSelectedRange();

    let activeHandle = null;
    let startX = 0;
    let handleStartX = 0;

    leftHandle.addEventListener('mousedown', (e) => {
        activeHandle = leftHandle;
        startX = e.clientX;
        handleStartX = parseInt(leftHandle.style.left);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    rightHandle.addEventListener('mousedown', (e) => {
        activeHandle = rightHandle;
        startX = e.clientX;
        handleStartX = parseInt(rightHandle.style.left);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    function handleMouseMove(e) {
        if (!activeHandle) return;
        const deltaX = e.clientX - startX;
        let newLeft = handleStartX + deltaX;

        if (newLeft < 0) newLeft = 0;
        if (newLeft > timelineWidth - activeHandle.offsetWidth) newLeft = timelineWidth - activeHandle.offsetWidth;

        if (activeHandle === leftHandle) {
            const rightHandleLeft = parseInt(rightHandle.style.left);
            if (newLeft > rightHandleLeft - activeHandle.offsetWidth) {
                newLeft = rightHandleLeft - activeHandle.offsetWidth;
            }
        } else if (activeHandle === rightHandle) {
            const leftHandleLeft = parseInt(leftHandle.style.left);
            if (newLeft < leftHandleLeft + leftHandle.offsetWidth) {
                newLeft = leftHandleLeft + activeHandle.offsetWidth;
            }
        }

        activeHandle.style.left = newLeft + 'px';

        updateSelectedRange();
    }

    function handleMouseUp(e) {
        activeHandle = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        updateTreemap();
    }

    function updateSelectedRange() {
        const leftHandleLeft = parseInt(leftHandle.style.left);
        const rightHandleLeft = parseInt(rightHandle.style.left);

        const rangeLeft = leftHandleLeft + leftHandle.offsetWidth / 2;
        const rangeWidth = rightHandleLeft + rightHandle.offsetWidth / 2 - rangeLeft;

        selectedRange.style.left = rangeLeft + 'px';
        selectedRange.style.width = rangeWidth + 'px';

        const startDate = calculateDateFromX(rangeLeft);
        const endDate = calculateDateFromX(rangeLeft + rangeWidth);

        leftDateDisplay.textContent = formatDate(startDate);
        rightDateDisplay.textContent = formatDate(endDate);

        leftDateDisplay.style.left = (rangeLeft - leftDateDisplay.offsetWidth / 2) + 'px';
        rightDateDisplay.style.left = (rangeLeft + rangeWidth - rightDateDisplay.offsetWidth / 2) + 'px';

        selectedStartDate = startDate;
        selectedEndDate = endDate;

        selectedStartDate.setHours(0, 0, 0, 0);
        selectedEndDate.setHours(0, 0, 0, 0);
    }

    function calculateDateFromX(x) {
        const percentage = x / timelineWidth;
        const timeDiff = maxDate - minDate;
        const date = new Date(minDate.getTime() + percentage * timeDiff);
        date.setHours(0, 0, 0, 0);
        return date;
    }
}

function groupDataByCountryAndProduct(data) {
    return Array.from(d3.group(data, d => d.ReportCountry), ([key, values]) => ({
        key,
        values: Array.from(d3.group(values, d => d.Medicinalproduct), ([key, values]) => ({
            key,
            value: values.length,
            reports: values
        })).sort((a, b) => d3.ascending(a.key, b.key))
    })).sort((a, b) => d3.ascending(a.key, b.key));
}

function initializeSlider(maxReports) {
    const roundedMaxReports = Math.ceil(maxReports / 100) * 100;

    const reportSlider = document.getElementById("report-slider");
    reportSlider.max = roundedMaxReports;
    reportSlider.value = roundedMaxReports;
    reportSlider.step = 100;
    document.getElementById("report-count").textContent = `${roundedMaxReports} reports`;
}

function drawTreemap(data) {
    zoomGroup.selectAll("*").remove();

    if (!data || data.length === 0) return;

    const root = d3.hierarchy({ key: "World", values: data }, d => d.values)
        .sum(d => d.value)
        .sort((a, b) => d3.ascending(a.data.key, b.data.key));

    const treemap = d3.treemap()
        .size([outerWidth, outerHeight])
        .paddingOuter(countryPadding)
        .paddingInner(productMargin)
        .round(true);

    treemap(root);

    const countries = zoomGroup.selectAll(".country")
        .data(root.children)
        .enter()
        .append("g")
        .attr("class", "country")
        .attr("transform", d => `translate(${d.x0 + countryMargin},${d.y0 + countryMargin})`);

    countries.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", "#ffffff")
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(`${d.data.key}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    countries.append("text")
        .attr("x", function(d) {
            return (d.x1 - d.x0) / 2;
        })
        .attr("y", -5)
        .text(function(d) {
            return d.data.key;
        })
        .attr("font-size", "8px")
        .attr("text-anchor", "middle");

    const products = countries.selectAll(".product")
        .data(d => d.children)
        .enter()
        .append("g")
        .attr("class", "product")
        .attr("transform", d => `translate(${d.x0 - d.parent.x0},${d.y0 - d.parent.y0})`);

    products.append("rect")
        .attr("class", "product-outer")
        .attr("width", d => Math.max(0, d.x1 - d.x0))
        .attr("height", d => Math.max(0, d.y1 - d.y0))
        .attr("fill", "#ffffff")
        .attr("stroke", "#000000")
        .attr("stroke-width", 0)
        .on("click", function (event, d) {
            stopAllBeating();
            triggerBeatingForProduct(d.data.key);
            showProductInfo(d.data);
        });

    products.each(function (d) {
        const productG = d3.select(this);
        const productRect = productG.select(".product-outer");
        const productHeight = d.y1 - d.y0;
        const productWidth = d.x1 - d.x0;
        const numReports = d.data.reports.length;

        if (numReports > 0) {
            const maxReportsToShow = Math.min(numReports, 5);
            const reportHeight = productHeight / maxReportsToShow;

            d.data.reports.slice(0, maxReportsToShow).forEach((report, i) => {
                productG.append("rect")
                    .attr("x", 0)
                    .attr("y", i * reportHeight)
                    .attr("width", productWidth)
                    .attr("height", reportHeight)
                    .attr("fill", outcomeColors[report.Outcome] || "#ccc")
                    .attr("stroke", outcomeColors[report.Outcome] || "#ccc")
                    .attr("stroke-width", 2)
                    .on("mouseover", function(event) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.html(`${d.data.key} - ${report.Outcome}`)
                            .style("left", `${event.pageX + 5}px`)
                            .style("top", `${event.pageY - 28}px`);
                    })
                    .on("mouseout", function() {
                        tooltip.transition().duration(500).style("opacity", 0);
                    })
                    .on("click", function() {
                        stopAllBeating();
                        triggerBeatingForProduct(d.data.key);
                        showProductInfo(d.data);
                    });
            });
        }

        const allGenericNames = new Set();
        const allBrandNames = new Set();

        d.data.reports.forEach(report => {
            splitBySemicolon(report.GenericName).forEach(name => allGenericNames.add(name));
            splitBySemicolon(report.BrandName).forEach(name => allBrandNames.add(name));
        });

        const dotGroup = productG.append("g").attr("class", "dot-group");

        const dotSize = Math.min(productHeight, productWidth) / 10;
        const centerX = productWidth / 2;
        const centerY = productHeight / 2;

        let angle = 0;
        let radius = dotSize * 2.5;

        const placeDotsRadially = (names, color) => {
            names.forEach((name, i) => {
                if (name) {
                    const nextX = centerX + radius * Math.cos(angle);
                    const nextY = centerY + radius * Math.sin(angle);

                    if (nextX - dotSize > 0 && nextX + dotSize < productWidth &&
                        nextY - dotSize > 0 && nextY + dotSize < productHeight) {
                        dotGroup.append("circle")
                            .attr("cx", nextX)
                            .attr("cy", nextY)
                            .attr("r", dotSize)
                            .style("fill", color)
                            .on("mouseover", (event) => {
                                tooltip.transition()
                                    .duration(200)
                                    .style("opacity", 1);
                                tooltip.html(`${name}`)
                                    .style("left", `${event.pageX + 5}px`)
                                    .style("top", `${event.pageY - 28}px`);
                            })
                            .on("mouseout", () => {
                                tooltip.transition().duration(500).style("opacity", 0);
                            });

                        angle += Math.PI / 2;
                        if (angle >= Math.PI * 2) {
                            angle = 0;
                            radius += dotSize * 2.5;
                        }
                    }
                }
            });
        };

        placeDotsRadially(Array.from(allGenericNames), "green");
        placeDotsRadially(Array.from(allBrandNames), "blue");
    });

    svg.selectAll(".legend").remove();

    const legendGroup = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${outerWidth / 2}, -50)`);

    legendGroup.append("circle")
        .attr("cx", -80)
        .attr("cy", 0)
        .attr("r", 10)
        .attr("fill", "green");

    legendGroup.append("text")
        .attr("x", -60)
        .attr("y", 5)
        .text("Generic Names")
        .style("font-size", "12px");

    legendGroup.append("circle")
        .attr("cx", 80)
        .attr("cy", 0)
        .attr("r", 10)
        .attr("fill", "blue");

    legendGroup.append("text")
        .attr("x", 100)
        .attr("y", 5)
        .text("Brand Names")
        .style("font-size", "12px");

    const outcomeLegendGroup = svg.append("g")
        .attr("class", "outcome-legend")
        .attr("transform", `translate(10, ${outerHeight + 30})`);

    let legendX = 0;

    Object.keys(outcomeColors).forEach(outcome => {
        outcomeLegendGroup.append("rect")
            .attr("x", legendX)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", outcomeColors[outcome]);

        outcomeLegendGroup.append("text")
            .attr("x", legendX + 25)
            .attr("y", 15)
            .text(outcome)
            .style("font-size", "12px");

        legendX += 100;
    });
}


function stopAllBeating() {
    d3.selectAll(".beating").classed("beating", false);
}

function triggerBeatingForProduct(products) {
    stopAllBeating();
    d3.selectAll(".product-outer").filter(function(d) {
        return products.includes(d.data.key);
    }).classed("beating", true);
}


function showProductInfo(productData) {
    d3.select("#sankey-container").html("");

    const indicationCounts = {};
    const reactionCounts = {};

    if (productData && productData.reports) {
        productData.reports.forEach(report => {
            splitBySemicolon(report.DrugIndication).forEach(indication => {
                if (indication) {
                    indicationCounts[indication] = (indicationCounts[indication] || 0) + 1;
                }
            });
            splitBySemicolon(report.Reactions).forEach(reaction => {
                if (reaction) {
                    reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
                }
            });
        });
    }

    const indications = Object.keys(indicationCounts).sort();
    const reactions = Object.keys(reactionCounts).sort();

    const nodes = [
        ...indications.map(name => ({ id: `ind_${name}`, name, type: 'indication' })),
        { id: `prod_${productData.key}`, name: productData.key, type: 'product' },
        ...reactions.map(name => ({ id: `reac_${name}`, name, type: 'reaction' })),
    ];

    const links = [
        ...indications.map(name => ({
            source: `ind_${name}`,
            target: `prod_${productData.key}`,
            value: indicationCounts[name],
        })),
        ...reactions.map(name => ({
            source: `prod_${productData.key}`,
            target: `reac_${name}`,
            value: reactionCounts[name],
        })),
    ];

    drawSankeyDiagram(nodes, links);
}

function drawSankeyDiagram(nodesData, linksData) {
    const sankeyWidth = 900;
    const sankeyHeight = 600;

    const sankeySvg = d3.select("#sankey-container")
        .append("svg")
        .attr("width", sankeyWidth)
        .attr("height", sankeyHeight)
        .call(d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => {
            sankeySvg.attr("transform", event.transform);
        }))
        .append("g");

    const sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(20)
        .extent([[1, 1], [sankeyWidth - 1, sankeyHeight - 6]])
        .nodeAlign(d3.sankeyCenter)
        .nodeSort(null);

    const graph = {
        nodes: nodesData.map(d => Object.assign({}, d)),
        links: linksData.map(d => Object.assign({}, d))
    };

    const idToNode = new Map(graph.nodes.map(d => [d.id, d]));

    // Update links to use node objects
    graph.links.forEach(link => {
        link.source = idToNode.get(link.source);
        link.target = idToNode.get(link.target);
    });

    graph.nodes.forEach(node => {
        if (node.type === "indication") {
            node.layer = 0;
        } else if (node.type === "product") {
            node.layer = 1;
        } else if (node.type === "reaction") {
            node.layer = 2;
        }
    });

    sankey(graph);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    sankeySvg.append("g")
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("fill", "none")
        .attr("stroke", d => {
            return d.source.type === "indication" ? "darkgreen" : "darkred";
        })
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("opacity", 0.5)
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`${d.value} reports`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    const node = sankeySvg.append("g")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("data-node-id", d => d.id);

    node.append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => {
            if (d.type === "indication") return "lightgreen";
            if (d.type === "reaction") return "lightcoral";
            return colorScale(d.name);
        })
        .attr("stroke", d => {
            if (d.type === "indication") return "darkgreen";
            if (d.type === "reaction") return "darkred";
            return "#000";
        })
        .attr("stroke-width", 1)
        .on("click", function(event, d) {
            stopAllBeating();
            d3.select(this).classed("beating", true);
            if (d.type === "indication" || d.type === "reaction") {
                handleNodeClick(d);
            }
        })
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`${d.name}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });
}

function handleNodeClick(nodeData) {
    const type = nodeData.type;
    const name = nodeData.name;

    const associatedProducts = findProductsByReactionOrIndication(type, name);
    triggerBeatingForProduct(associatedProducts);

    d3.select(`[data-node-id='${nodeData.id}'] rect`).classed("beating", true);
}

function findProductsByReactionOrIndication(type, name) {
    const products = [];

    originalData.forEach(report => {
        const productName = report.Medicinalproduct;

        if (type === "indication") {
            const indications = splitBySemicolon(report.DrugIndication);
            if (indications.includes(name)) {
                products.push(productName);
            }
        } else if (type === "reaction") {
            const reactions = splitBySemicolon(report.Reactions);
            if (reactions.includes(name)) {
                products.push(productName);
            }
        }
    });

    return [...new Set(products)];
}


function linkSourceIndex(source) {
    return typeof source === "object" ? source.index : source;
}

function splitBySemicolon(value) {
    return value.split(";").map(v => v.trim()).filter(Boolean);
}
