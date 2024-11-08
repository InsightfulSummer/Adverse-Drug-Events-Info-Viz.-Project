<<<<<<< HEAD
=======
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
let currentEnlargedElement = null;
let minDate, maxDate;
//sufy csuyd
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

let globalIndicationCounts = {};
let globalReactionCounts = {};

function calculateGlobalCounts(data) {
    data.forEach(report => {
        splitBySemicolon(report.DrugIndication).forEach(indication => {
            if (indication) {
                globalIndicationCounts[indication] = (globalIndicationCounts[indication] || 0) + 1;
            }
        });
        splitBySemicolon(report.Reactions).forEach(reaction => {
            if (reaction) {
                globalReactionCounts[reaction] = (globalReactionCounts[reaction] || 0) + 1;
            }
        });
    });
}

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

const predefinedPatientData = [
    { sex: "male", age: 23, weight: 89 },
    { sex: "female", age: 56, weight: 44 },
    { sex: "unknown", age: "not mentioned", weight: "not mentioned" }
];

const iconContainer = d3.select("body").append("div")
    .attr("class", "icon-container")
    .style("position", "fixed")
    .style("top", "0px")
    .style("left", "0px")
    .style("pointer-events", "none");

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
    const totalFilteredReports = filteredData.reduce((sum, country) => {
        return sum + country.values.reduce((countrySum, product) => countrySum + product.value, 0);
    }, 0);

    console.log('Total Number of Reports after Filtering:', totalFilteredReports);

    drawTreemap(filteredData);
}

let selectedStartDate, selectedEndDate;

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

    return d;
}).then(function(data) {

    originalData = data;
    calculateGlobalCounts(data);
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
        }))
    }));
}

function initializeSlider(maxReports) {
    const roundedMaxReports = Math.ceil(maxReports / 100) * 100;

    const reportSlider = document.getElementById("report-slider");
    reportSlider.max = roundedMaxReports;
    reportSlider.value = roundedMaxReports;
    reportSlider.step = 100;
    document.getElementById("report-count").textContent = `${roundedMaxReports} reports`;
}

function updateVisualizations() {
    updateTreemap();

}

function togglePatientInfoIcons(shapeElement, reports) {
    const isIconVisible = shapeElement.classed("icons-visible");

    if (isIconVisible) {
        d3.selectAll(".patient-info-icon").remove();
        shapeElement.classed("icons-visible", false);
        restoreBackground();
        shapeElement.classed("enlarged", false).attr("transform", null);
        currentEnlargedElement = null;
    } else {
        d3.selectAll(".patient-info-icon").remove();

        const bbox = shapeElement.node().getBoundingClientRect();
        const centerX = bbox.left + bbox.width / 2;
        const centerY = bbox.top + bbox.height / 2;
        const iconRadius = Math.max(bbox.width, bbox.height) / 2 + 100;
        const maxReportsToShow = 20;
        const reportsToShow = reports.slice(0, maxReportsToShow);
        currentReports = reportsToShow;
        const totalIcons = reportsToShow.length * 3;
        const angleStep = (Math.PI * 2) / totalIcons;

        reportsToShow.forEach((report, i) => {
            const patientInfo = {
                sex: report.PatientSex || 'unknown',
                age: report.PatientAge || 'unknown',
                weight: report.PatientWeight || 'unknown'
            };

            const icons = [
                { type: "Sex", file: getIconFileForSex(patientInfo.sex), value: patientInfo.sex, report },
                { type: "Age", file: getIconFileForAge(patientInfo.age), value: patientInfo.age, report },
                { type: "Weight", file: getIconFileForWeight(patientInfo.weight), value: patientInfo.weight, report }
            ];

            icons.forEach((icon, j) => {
                const angle = angleStep * (i * 3 + j);
                const x = centerX + iconRadius * Math.cos(angle);
                const y = centerY + iconRadius * Math.sin(angle);

                const img = document.createElement('img');
                img.src = icon.file;
                img.className = 'patient-info-icon';
                img.style.position = 'fixed';
                img.style.left = `${x - 15}px`;
                img.style.top = `${y - 15}px`;
                img.style.width = '30px';
                img.style.height = '30px';
                img.style.zIndex = 10;

                img.dataset.reportIndex = i;
                img.addEventListener('mouseover', function(event) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html(`${icon.type}: ${icon.value}`)
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY - 28}px`);
                });

                img.addEventListener('mouseout', function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                });

                document.body.appendChild(img);
            });
        });

        shapeElement.classed("icons-visible", true);
    }
}

function getIconFileForSex(sex) {
    if (sex.toLowerCase() === 'male') {
        return 'male.png';
    } else if (sex.toLowerCase() === 'female') {
        return 'female.png';
    } else {
        return 'unknown.png';
    }
}

function getIconFileForAge(age) {
    if (age !== 'unknown' && age.trim() !== '') {
        return 'age.png';
    } else {
        return 'unknown.png';
    }
}

function getIconFileForWeight(weight) {
    if (weight !== 'unknown' && weight.trim() !== '') {
        return 'weight.png';
    } else {
        return 'unknown.png';
    }
}
let magicLensActive = false;
let magicLens = null;

function createMagicLens() {
    if (d3.select(".magic-lens").empty()) {
        const magicLens = d3.select("body")
            .append("div")
            .attr("class", "magic-lens")
            .style("position", "fixed")
            .style("left", "20px")
            .style("bottom", "20px")
            .style("cursor", "move")
            .style("z-index", "1000");

        magicLens.call(makeDraggable);
        magicLens.html("");
        magicLens.append("img")
            .attr("src", "search.png")
            .style("width", "50px")
            .style("height", "50px");

        const dosageTooltip = magicLens.append("div")
            .attr("class", "dosage-tooltip")
            .style("position", "absolute")
            .style("top", "50%")
            .style("left", "50%")
            .style("transform", "translateX(-50%)")
            .style("opacity", 0)
            .style("pointer-events", "none");

        checkOverlapWithIcons(magicLens, dosageTooltip);
    }
}

function checkOverlapWithIcons(magicLens, dosageTooltip) {
    const checkOverlap = () => {
        let isOverIcon = false;

        d3.selectAll('.patient-info-icon').each(function() {
            const iconElement = this;
            const lensRect = magicLens.node().getBoundingClientRect();
            const iconRect = iconElement.getBoundingClientRect();

            const lensCenterX = lensRect.left + lensRect.width / 2;
            const lensCenterY = lensRect.top + lensRect.height / 2;
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;

            const distance = Math.hypot(lensCenterX - iconCenterX, lensCenterY - iconCenterY);

            const tolerance = 50;

            if (distance < tolerance) {
                const reportIndex = parseInt(iconElement.dataset.reportIndex, 10);
                const report = currentReports[reportIndex];


                const dosageInfo = formatDosageInfo(report);

                dosageTooltip.html(dosageInfo)
                    .style("opacity", 1);

                isOverIcon = true;
            }
        });

        if (!isOverIcon) {
            dosageTooltip.style("opacity", 0);
        }

        requestAnimationFrame(checkOverlap);
    };

    requestAnimationFrame(checkOverlap);
}

function formatDosageInfo(report) {
    let text = "The patient";
    const productName = report.Medicinalproduct || '';
    if (productName) {
        text += ` took ${productName}`;
    } else {
        text += ` took a medicinal product`;
    }
    const dosage = report.DosageText || '';
    if (dosage) {
        text += ` with ${dosage}`;
    }

    const treatmentDuration = report.TreatmentDuration || '';
    if (treatmentDuration) {
        text += ` for ${treatmentDuration} days`;
    }

    const startDate = report.StartDate ? formatDate(report.StartDate) : '';
    const endDate = report.EndDate ? formatDate(report.EndDate) : '';

    if (startDate && endDate) {
        text += ` from ${startDate} to ${endDate}`;
    } else if (startDate) {
        text += ` starting from ${startDate}`;
    } else if (endDate) {
        text += ` until ${endDate}`;
    }

    text += '.';

    return text;
}

function getIconCenter(iconElement) {
    const rect = iconElement.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function getLensCenter(magicLens) {
    const rect = magicLens.node().getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function makeDraggable(selection) {
    let isDragging = false;
    let offsetX, offsetY;

    selection
        .on("mousedown", function (event) {
            event.preventDefault();
            isDragging = true;
            offsetX = event.clientX - parseInt(d3.select(this).style("left"));
            offsetY = event.clientY - parseInt(d3.select(this).style("top"));
            d3.select(window)
                .on("mousemove.drag", mousemove)
                .on("mouseup.drag", mouseup);
        });

    function mousemove(event) {
        if (isDragging) {
            selection
                .style("left", `${event.clientX - offsetX}px`)
                .style("top", `${event.clientY - offsetY}px`);
        }
    }

    function mouseup() {
        isDragging = false;
        d3.select(window)
            .on("mousemove.drag", null)
            .on("mouseup.drag", null);
    }
}

function resetLensAndVisualization() {
    d3.select(".magic-lens").remove();
}

function triggerBeatingForProduct(medicinalProductKey) {
    stopAllBeating();

    d3.selectAll(".product").each(function(d) {
        if (d.data.key === medicinalProductKey) {
            const productRect = d3.select(this).select(".product-outer");
            productRect.classed("beating", true);
        }
    });
}

function drawTreemap(data) {
    zoomGroup.selectAll("*").remove();

    if (!data || data.length === 0) return;

    const root = d3.hierarchy({ key: "World", values: data }, d => d.values)
        .sum(d => d.value);


    const treemap = d3.treemap()
        .size([outerWidth, outerHeight])
        .paddingOuter(countryPadding)
        .paddingInner(productMargin)
        .round(true);

    treemap(root);

    countries = zoomGroup.selectAll(".country")
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
        .attr("stroke-width", 1)
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

    products = countries.selectAll(".product")
        .data(d => d.children)
        .enter()
        .append("g")
        .attr("class", "product")
        .attr("transform", d => `translate(${d.x0 - d.parent.x0},${d.y0 - d.parent.y0})`);

    products.append("rect")
        .attr("class", "product-outer")
        .attr("width", d => Math.max(0, d.x1 - d.x0))
        .attr("height", d => Math.max(0, d.y1 - d.y0))
        .attr("fill", ".product-outer ")
        .attr("stroke", ".product-outer ")
        .attr("stroke-width", ".product-outer");

    products.each(function (d) {
        const productG = d3.select(this);
        const productRect = productG.select(".product-outer");
        const productHeight = d.y1 - d.y0;
        const productWidth = d.x1 - d.x0;
        const numReports = d.data.reports.length;

        if (numReports > 0) {

            const reportMargin = 0;
            const availableHeight = Math.max(productHeight - 2 * reportMargin, 0);
            const availableWidth = Math.max(productWidth - 2 * reportMargin, 0);

            d.data.reports.forEach((report, i) => {
                const reportG = productG.append("g")
                    .attr("class", "report");

                const reportX = reportMargin;
                const reportY = reportMargin + i * (availableHeight / numReports);

                reportG.append("rect")
                    .attr("x", reportX)
                    .attr("y", reportY)
                    .attr("width", availableWidth)
                    .attr("height", availableHeight / numReports)
                    .attr("fill", outcomeColors[report.Outcome])
                    .attr("stroke", outcomeColors[report.Outcome])
                    .on("mouseover", (event) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.html(`${d.data.key}<br/>${d.value} reports`)
                            .style("left", `${event.pageX + 5}px`)
                            .style("top", `${event.pageY - 28}px`);
                    })
                    .on("mouseout", () => {
                        tooltip.transition().duration(500).style("opacity", 0);
                    })
                    .on("click", function () {
                        triggerBeatingForProduct(d.data.key);
                        d3.select(this).select("rect.product-outer").classed("highlight", true);
                        showOutcomeColors(d);
                        showProductInfo(d.data);
                    });
            });
        }

        productRect.on("click", function () {
        triggerBeatingForProduct(d.data.key);
    });

    });

    d3.selectAll(".reaction-group polygon").on("click", function (event, d) {
        const reports = getReportsForShape("Reactions", d.data.key, groupedData);
        if (reports.length > 0) {
            toggleBounceAndEnlarge(d3.select(this), reports);
        } else {
            console.error("No valid reports found for this shape.");
        }
    });

    d3.selectAll(".indication-group rect").on("click", function (event, d) {
        const reports = getReportsForShape("DrugIndication", d.data.key, groupedData);
        if (reports.length > 0) {
            toggleBounceAndEnlarge(d3.select(this), reports);
        } else {
            console.error("No valid reports found for this shape.");
        }
    });

    products.each(function (d) {
        const productG = d3.select(this);
        const availableWidth = d.x1 - d.x0;
        const availableHeight = d.y1 - d.y0;

        const allGenericNames = new Set();
        const allBrandNames = new Set();

        d.data.reports.forEach(report => {
            splitBySemicolon(report.GenericName).forEach(name => allGenericNames.add(name));
            splitBySemicolon(report.BrandName).forEach(name => allBrandNames.add(name));
        });

        const dotGroup = productG.append("g").attr("class", "dot-group");

        const dotSize = Math.min(availableHeight, availableWidth) / 10;
        const centerX = availableWidth / 2;
        const centerY = availableHeight / 2;

        let dotX = centerX, dotY = centerY;
        let angle = 0, radius = dotSize * 2.5;

        const placeDotsRadially = (names, color) => {
            names.forEach((name, i) => {
                if (name) {
                    const nextX = dotX + radius * Math.cos(angle);
                    const nextY = dotY + radius * Math.sin(angle);

                    if (nextX - dotSize > 0 && nextX + dotSize < availableWidth &&
                        nextY - dotSize > 0 && nextY + dotSize < availableHeight) {
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
                        if (angle > Math.PI * 2) {
                            angle = 0;
                            radius += dotSize * 2.5;
                        }
                    }
                }
            });
        };

        placeDotsRadially(allGenericNames, "green");
        placeDotsRadially(allBrandNames, "blue");
    });
}

function updateReactionsAndIndications(data) {
    d3.select("#info-svg").selectAll("*").remove();

    const infoWidth = document.getElementById("info-svg").clientWidth;
    const infoHeight = document.getElementById("info-svg").clientHeight;
    const halfWidth = infoWidth / 2;
    const marginBetweenRectangles = 10;

    const indications = new Set();
    const reactions = new Set();

    data.forEach(country => {
        country.values.forEach(product => {
            product.reports.forEach(report => {
                splitBySemicolon(report.DrugIndication).forEach(indication => indications.add(indication));
                splitBySemicolon(report.Reactions).forEach(reaction => reactions.add(reaction));
            });
        });
    });

    const linkedShapes = [];
    const indicationGroup = d3.select("#info-svg").append("g").attr("class", "indication-group");
    const reactionGroup = d3.select("#info-svg").append("g").attr("class", "reaction-group");
    const indicationXOffset = halfWidth / 2 - 220;
    const reactionXOffset = halfWidth + halfWidth / 2 - 200;

    let i = 0;
    let j = 0;
}

function splitBySemicolon(value) {
    return value.split(";").map(v => v.trim()).filter(Boolean);
}

function showOutcomeColors(d) {
    const outcomeContainer = document.getElementById('outcome-colors');
    outcomeContainer.innerHTML = '';

    
    outcomeContainer.style.display = 'flex';
    outcomeContainer.style.flexDirection = 'row';
    outcomeContainer.style.justifyContent = 'flex-start';

    Object.keys(outcomeColors).forEach(outcome => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';

        const colorSquare = document.createElement('div');
        colorSquare.className = 'color-square';
        colorSquare.style.marginLeft = '45px';
        colorSquare.style.backgroundColor = outcomeColors[outcome];
        colorSquare.style.width = '20px';
        colorSquare.style.height = '20px';
        colorSquare.style.marginRight = '0px';

        const span = document.createElement('span');
        span.textContent = outcome;

        div.appendChild(colorSquare);
        div.appendChild(span);
        outcomeContainer.appendChild(div);
    });

    const legendDiv = document.createElement('div');
    legendDiv.style.display = 'flex';
    legendDiv.style.alignItems = 'center';

    const greenCircle = document.createElement('div');
    greenCircle.style.backgroundColor = 'green';
    greenCircle.style.width = '20px';
    greenCircle.style.height = '20px';
    greenCircle.style.borderRadius = '50%';
    greenCircle.style.marginLeft = '30px';

    const greenLabel = document.createElement('span');
    greenLabel.textContent = 'Generic Names';

    const blueCircle = document.createElement('div');
    blueCircle.style.backgroundColor = 'blue';
    blueCircle.style.width = '20px';
    blueCircle.style.height = '20px';
    blueCircle.style.borderRadius = '50%';
    blueCircle.style.marginLeft = '30px';

    const blueLabel = document.createElement('span');
    blueLabel.textContent = 'Brand Names';

    legendDiv.appendChild(greenCircle);
    legendDiv.appendChild(greenLabel);
    legendDiv.appendChild(blueCircle);
    legendDiv.appendChild(blueLabel);

    outcomeContainer.appendChild(legendDiv);
}

function updateInfoPanelForShapes() {
    const outcomeContainer = document.getElementById('outcome-colors');
    outcomeContainer.innerHTML = '';

    const reactionDiv = document.createElement('div');
    reactionDiv.style.display = 'flex';
    reactionDiv.style.alignItems = 'center';

    const reactionSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    reactionSvg.setAttribute("width", "40");
    reactionSvg.setAttribute("height", "40");

    const redHexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    redHexagon.setAttribute("points", hexagonPoints(20, 20, 20));
    redHexagon.setAttribute("fill", "#ff7e7e");
    redHexagon.setAttribute("stroke", "darkred");
    redHexagon.setAttribute("stroke-width", "2");
    

    reactionSvg.appendChild(redHexagon);

    const reactionLabel = document.createElement('span');
    reactionLabel.textContent = 'Reactions';
    reactionLabel.style.marginLeft = '8px';

    reactionDiv.appendChild(reactionSvg);
    reactionDiv.appendChild(reactionLabel);
    outcomeContainer.appendChild(reactionDiv);

    const indicationDiv = document.createElement('div');
    indicationDiv.style.display = 'flex';
    indicationDiv.style.alignItems = 'center';

    const greenSquare = document.createElement('div');
    greenSquare.className = 'color-square';
    greenSquare.style.width = '40px';
    greenSquare.style.height = '40px';
    greenSquare.style.backgroundColor = '#a9ff92';
    greenSquare.style.marginLeft = '30px';

    const indicationLabel = document.createElement('span');
    indicationLabel.textContent = 'Indications';

    indicationDiv.appendChild(greenSquare);
    indicationDiv.appendChild(indicationLabel);
    outcomeContainer.appendChild(indicationDiv);
}

function toggleBounceAndEnlarge(element, reports) {
    const isBouncing = element.classed("bouncing");
    const isEnlarged = element.classed("enlarged");

    if (isBouncing && !isEnlarged) {
        element.classed("bouncing", false).classed("enlarged", true);
        enlargeShapeInPlace(element);
        fadeBackground();
        togglePatientInfoIcons(element, reports);
        createMagicLens();
        currentEnlargedElement = element;

    } else if (isEnlarged) {
        restoreBackground();
        element.classed("enlarged", false).attr("transform", null);
        togglePatientInfoIcons(element, reports);
        resetLensAndVisualization();
        currentEnlargedElement = null;

    } else {
        stopAllBouncing();
        element.classed("bouncing", true);
    }
}

function stopAllBeating() {
    d3.selectAll(".product-outer").classed("highlight", false).classed("beating", false);
}

function stopAllBouncing() {
    d3.selectAll(".bouncing").classed("bouncing", false);
    d3.selectAll(".highlighted").classed("highlighted", false);
    d3.selectAll(".enlarged").classed("enlarged", false).attr("transform", null);
    restoreBackground();
}

function enlargeShapeInPlace(element, scaleFactor = 2) {
    const bbox = element.node().getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    element.attr("transform", `translate(${centerX},${centerY}) scale(${scaleFactor}) translate(${-centerX},${-centerY})`);
}

function highlightProductsByReactionOrIndication(clickedValue, field) {
    stopAllBeating();
    d3.selectAll(".product").each(function (d) {
        const matchingReports = d.data.reports.filter(report => splitBySemicolon(report[field]).includes(clickedValue));
        if (matchingReports.length > 0) {
            d3.select(this).select(".product-outer").classed("highlight", true).classed("beating", true);
            setTimeout(() => {
                d3.select(this).select(".product-outer").classed("beating", false);
            }, 20000);
        }
    });
}

function hexagonPoints(x, y, radius) {
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        points.push(`${px},${py}`);
    }
    return points.join(" ");
}

function showProductInfo(productData) {
    const infoSvg = d3.select("#info-svg");
    infoSvg.selectAll("*").remove();
    const infoWidth = document.getElementById("info-svg").clientWidth;
    const infoHeight = document.getElementById("info-svg").clientHeight;
    const halfWidth = infoWidth / 2;
    const marginBetweenRectangles = 10;

    infoSvg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", halfWidth - marginBetweenRectangles / 2)
        .attr("height", infoHeight)
        .attr("fill", "#ffffff")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 3);

    infoSvg.append("rect")
        .attr("x", halfWidth + marginBetweenRectangles / 2)
        .attr("y", 0)
        .attr("width", halfWidth - marginBetweenRectangles / 2)
        .attr("height", infoHeight)
        .attr("fill", "#ffffff")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 3);

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

    const sortedIndications = Object.keys(indicationCounts).sort();
    const sortedReactions = Object.keys(reactionCounts).sort();

    const linkedShapes = [];
    const indicationGroup = infoSvg.append("g").attr("class", "indication-group");
    const reactionGroup = infoSvg.append("g").attr("class", "reaction-group");

    const indicationXOffset = halfWidth / 2 - 220;
    const reactionXOffset = halfWidth + halfWidth / 2 - 200;

    const globalIndicationCountValues = Object.values(globalIndicationCounts);
    const globalReactionCountValues = Object.values(globalReactionCounts);

    const minIndicationCount = d3.min(globalIndicationCountValues);
    const maxIndicationCount = d3.max(globalIndicationCountValues);

    const minReactionCount = d3.min(globalReactionCountValues);
    const maxReactionCount = d3.max(globalReactionCountValues);

    const indicationColorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([minIndicationCount, maxIndicationCount]);

    const reactionColorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([minReactionCount, maxReactionCount]);

    drawAlphabeticalShapes(
        sortedIndications,
        indicationGroup,
        indicationXOffset,
        "Indication",
        linkedShapes,
        productData,
        indicationCounts,
        indicationColorScale,
        globalIndicationCounts
    );

    drawAlphabeticalShapes(
        sortedReactions,
        reactionGroup,
        reactionXOffset,
        "Reaction",
        linkedShapes,
        productData,
        reactionCounts,
        reactionColorScale,
        globalReactionCounts
    );
}

function drawAlphabeticalShapes(
    items,
    group,
    xOffset,
    type,
    linkedShapes,
    productData,
    counts,
    colorScale,
    globalCounts
) {
    const rowHeight = 50;
    const maxShapesPerRow = 5;
    const shapeSize = 40;
    let rowY = 50;
    const itemsGroupedByLetter = d3.group(items, d => d.charAt(0).toUpperCase());
    itemsGroupedByLetter.forEach((itemsForLetter, letter) => {
        let rowX = 0;
        let shapesInCurrentRow = 0;

        itemsForLetter.forEach((item, index) => {
            if (shapesInCurrentRow >= maxShapesPerRow) {
                rowY += rowHeight;
                rowX = 0;
                shapesInCurrentRow = 0;
            }
            const globalCount = globalCounts[item] || 0;
            const productCount = counts[item] || 0;
            const color = colorScale(globalCount);

            if (type === "Indication") {
                const indicationShape = group.append("rect")
                    .attr("x", xOffset + rowX * shapeSize + rowX * 10)
                    .attr("y", rowY)
                    .attr("width", shapeSize)
                    .attr("height", shapeSize)
                    .attr("fill", color)
                    .attr("stroke", "darkgreen")
                    .attr("stroke-width", 4)
                    .attr("class", "fadeable")
                    .on("mouseover", (event) => showTooltip(event, item, productCount, globalCount))
                    .on("mouseout", hideTooltip)
                    .on("click", function () {
                        onShapeClick(item, "DrugIndication", productData, indicationShape.node());
                    });

                linkedShapes.push([indicationShape.node()]);
            } else if (type === "Reaction") {
                const reactionShape = group.append("polygon")
                    .attr("points", hexagonPoints(xOffset + rowX * shapeSize + rowX * 10, rowY + 20, 20))
                    .attr("fill", color)
                    .attr("stroke", "darkred")
                    .attr("stroke-width", 4)
                    .attr("class", "fadeable")
                    .on("mouseover", (event) => showTooltip(event, item, productCount, globalCount))
                    .on("mouseout", hideTooltip)
                    .on("click", function () {
                        onShapeClick(item, "Reactions", productData, reactionShape.node());
                    });

                linkedShapes.push([reactionShape.node()]);
            }

            rowX++;
            shapesInCurrentRow++;
        });

        rowY += rowHeight;
    });
}

function showTooltip(event, item, productCount, globalCount) {
    tooltip.transition()
        .duration(200)
        .style("opacity", 1);
    tooltip.html(`${item}<br/>Product Reports: ${productCount}<br/>Total Reports: ${globalCount}`)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
}

function hideTooltip() {
    tooltip.transition().duration(500).style("opacity", 0);
}

function onShapeClick(item, field, productData, element) {
    const reports = getReportsForShape(field, item, originalData);
    if (reports.length > 0) {
        toggleBounceAndEnlarge(d3.select(element), reports);
        highlightProductsByReactionOrIndication(item, field);
        updateInfoPanelForShapes();
    }
}

function getReportsForShape(field, value, data) {
    const matchingReports = [];

    data.forEach(report => {
        const fieldValues = splitBySemicolon(report[field]);
        if (fieldValues.includes(value)) {
            matchingReports.push(report);
        }
    });

    return matchingReports;
}
function fadeBackground() {
    d3.selectAll("rect, polygon, circle").classed("faded", true);
    d3.selectAll(".enlarged").classed("faded", false);
}

function restoreBackground() {
    d3.selectAll(".faded").classed("faded", false);
}
document.getElementById("close-panel").addEventListener("click", function () {
    const infoPanel = document.getElementById("info-panel");
    infoPanel.style.display = "none";
    if (currentEnlargedElement) {
        currentEnlargedElement.classed("enlarged", false).attr("transform", null);
        currentEnlargedElement = null;
    }
    restoreBackground();
});

d3.csv("data.csv").then((data) => {
    groupedData = groupDataByCountryAndProduct(data);
    totalReports = data.length;

    initializeSlider(totalReports);
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

svg.append("circle")
    .attr("cx", outerWidth / 2 - 50)
    .attr("cy", -40)
    .attr("r", 10)
    .attr("fill", "green");

svg.append("text")
    .attr("x", outerWidth / 2 - 30)
    .attr("y", -35)
    .text("Generic Names")
    .style("font-size", "12px");

svg.append("circle")
    .attr("cx", outerWidth / 2 + 50)
    .attr("cy", -40)
    .attr("r", 10)
    .attr("fill", "blue");

svg.append("text")
    .attr("x", outerWidth / 2 + 70)
    .attr("y", -35)
    .text("Brand Names")
    .style("font-size", "12px");
});
>>>>>>> cc76c11 (test commit)
