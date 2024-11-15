const _ = window._;
let originalData = [];
const margin = { top: 20, right: 10, bottom: 10, left: 10 },
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

let circularFilters = {
    Weight: { min: 1, max: 200 },
    Age: { min: 1, max: 100 },
    Sex: { male: true, female: true }
};

const gap = 2 * Math.PI / 180;

const segments = [
    {
        name: 'Weight',
        startAngle: 0 + gap,
        endAngle: Math.PI - gap,
        color: '#7a7a54',
        range: [1, 200]
    },
    {
        name: 'Age',
        startAngle: Math.PI + gap,
        endAngle: Math.PI * 3 / 2 - gap,
        color: '#62ab5d',
        range: [1, 100]
    },
    {
        name: 'Sex',
        startAngle: Math.PI * 3 / 2 + gap,
        endAngle: 2 * Math.PI - gap,
        color: '#5c9596',
        range: [0, 1]
    }
];

const circularSliderSVG = d3.select("#circular-slider")
    .attr("width", 300)
    .attr("height", 300)
    .attr("viewBox", "0 0 300 300")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(88, 150)`);

const sliderRadius = 65;
const sliderThickness = 20;
const minHandleDistance = 5;

function createSegmentGradient(id, color) {
    const defs = circularSliderSVG.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(color).brighter(1));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(color).darker(1));
}

segments.forEach(segment => {
    const gradientId = `gradient-${segment.name}`;
    createSegmentGradient(gradientId, segment.color);
    circularSliderSVG.append("path")
        .attr("class", "circular-slider-track")
        .attr("d", d3.arc()
            .innerRadius(sliderRadius)
            .outerRadius(sliderRadius + sliderThickness)
            .startAngle(segment.startAngle)
            .endAngle(segment.endAngle)()
        )
        .attr("fill", `url(#${gradientId})`);
});

segments.forEach(segment => {
    segment.selectionArc = circularSliderSVG.append("path")
        .attr("class", "circular-slider-selection")
        .attr("fill", `url(#gradient-${segment.name})`);
    updateSelectionArc(segment);
});

segments.forEach(segment => {
    if (segment.name !== 'Sex') {
        addHandle(segment, 'min');
        addHandle(segment, 'max');
    } else {
        addSexHandle(segment, 'male');
        addSexHandle(segment, 'female');
    }
});

function addHandle(segment, type) {
    const initialValue = type === 'min' ? segment.range[0] : segment.range[1];
    const angle = scaleValueToAngle(initialValue, segment);
    const x = sliderRadius * Math.cos(angle);
    const y = sliderRadius * Math.sin(angle);

    const handle = circularSliderSVG.append("circle")
        .attr("class", `circular-slider-handle ${segment.name.toLowerCase()}-${type}`)
        .attr("r", 8)
        .attr("cx", x)
        .attr("cy", y)
        .attr("fill", "#fff")
        .attr("stroke", segment.color)
        .attr("stroke-width", 2)
        .on("mouseover", function() { d3.select(this).attr("fill", "#f0f0f0"); })
        .on("mouseout", function() { d3.select(this).attr("fill", "#fff"); })
        .call(d3.drag()
            .on("drag", function(event) { handleDrag(event, segment, type, this); })
        );

    handle.append("title")
        .text(type === 'min' ? `${segment.name} Min` : `${segment.name} Max`);
}

function addSexHandle(segment, type) {
    const angle = type === 'male' ? segment.startAngle : segment.endAngle;
    const x = sliderRadius * Math.cos(angle);
    const y = sliderRadius * Math.sin(angle);

    const handle = circularSliderSVG.append("circle")
        .attr("class", `circular-slider-handle sex-handle ${type}`)
        .attr("r", 8)
        .attr("cx", x)
        .attr("cy", y)
        .attr("fill", circularFilters.Sex[type] ? (type === 'male' ? "#ffd1d1" : "#d1d1ff") : "#fff")
        .attr("stroke", segment.color)
        .attr("stroke-width", 2)
        .on("mouseover", function() {
            d3.select(this).attr("fill", circularFilters.Sex[type] ? (type === 'male' ? "#ffb3b3" : "#b3b3ff") : "#f0f0f0");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", circularFilters.Sex[type] ? (type === 'male' ? "#ffd1d1" : "#d1d1ff") : "#fff");
        })
        .call(d3.drag()
            .on("drag", function(event) { handleSexDrag(event, segment, type, this); })
        );

    handle.append("title")
        .text(type.charAt(0).toUpperCase() + type.slice(1));
}

function handleDrag(event, segment, type, handle) {
    const mouse = d3.pointer(event, circularSliderSVG.node());
    let angle = Math.atan2(mouse[1], mouse[0]);

    if (angle < 0) angle += 2 * Math.PI;

    if (angle < segment.startAngle) angle = segment.startAngle;
    if (angle > segment.endAngle) angle = segment.endAngle;

    const newValue = angleToValue(angle, segment);

    if (type === 'min') {
        circularFilters[segment.name].min = Math.min(newValue, circularFilters[segment.name].max - minHandleDistance);
    } else {
        circularFilters[segment.name].max = Math.max(newValue, circularFilters[segment.name].min + minHandleDistance);
    }

    updateHandlePosition(handle, segment, type);
    updateSelectionArc(segment);
    updateFilterDisplays();
    updateTreemap();
}

function handleSexDrag(event, segment, type, handle) {
    const mouse = d3.pointer(event, circularSliderSVG.node());
    let angle = Math.atan2(mouse[1], mouse[0]);

    if (angle < 0) angle += 2 * Math.PI;
    if (angle < segment.startAngle) angle = segment.startAngle;
    if (angle > segment.endAngle) angle = segment.endAngle;

    const midpointAngle = (segment.startAngle + segment.endAngle) / 2;
    const distanceFromStart = Math.abs(angle - segment.startAngle);
    const distanceFromEnd = Math.abs(angle - segment.endAngle);

    let isSelected = false;
    if (type === 'male') {
        isSelected = distanceFromStart < distanceFromEnd;
        circularFilters.Sex.male = isSelected;
    } else if (type === 'female') {
        isSelected = distanceFromEnd < distanceFromStart;
        circularFilters.Sex.female = isSelected;
    }

    d3.select(handle)
        .attr("fill", circularFilters.Sex[type] ? (type === 'male' ? "#ffd1d1" : "#d1d1ff") : "#fff");

    const x = sliderRadius * Math.cos(angle);
    const y = sliderRadius * Math.sin(angle);
    d3.select(handle)
        .attr("cx", x)
        .attr("cy", y);

    updateSelectionArc(segment);
    updateFilterDisplays();
    updateTreemap();
}

function updateHandlePosition(handle, segment, type) {
    const value = circularFilters[segment.name][type];
    const angle = scaleValueToAngle(value, segment);
    const x = sliderRadius * Math.cos(angle);
    const y = sliderRadius * Math.sin(angle);

    d3.select(handle)
        .attr("cx", x)
        .attr("cy", y);
}

function updateSelectionArc(segment) {
    if (segment.name === 'Sex') {
        const deltaAngle = 0.1;

        let pathD = '';

        if (circularFilters.Sex.male) {
            pathD += d3.arc()
                .innerRadius(sliderRadius)
                .outerRadius(sliderRadius + sliderThickness)
                .startAngle(segment.startAngle)
                .endAngle(segment.startAngle + deltaAngle)();
        }

        if (circularFilters.Sex.female) {
            pathD += d3.arc()
                .innerRadius(sliderRadius)
                .outerRadius(sliderRadius + sliderThickness)
                .startAngle(segment.endAngle - deltaAngle)
                .endAngle(segment.endAngle)();
        }

        segment.selectionArc.attr("d", pathD);
    } else {
        const startValue = circularFilters[segment.name].min;
        const endValue = circularFilters[segment.name].max;

        const startAngle = scaleValueToAngle(startValue, segment);
        const endAngle = scaleValueToAngle(endValue, segment);

        segment.selectionArc.attr("d", d3.arc()
            .innerRadius(sliderRadius)
            .outerRadius(sliderRadius + sliderThickness)
            .startAngle(startAngle)
            .endAngle(endAngle)()
        ).attr("fill", `url(#gradient-${segment.name})`);
    }
}

function scaleValueToAngle(value, segment) {
    const ratio = (value - segment.range[0]) / (segment.range[1] - segment.range[0]);
    return segment.startAngle + ratio * (segment.endAngle - segment.startAngle);
}

function angleToValue(angle, segment) {
    const ratio = (angle - segment.startAngle) / (segment.endAngle - segment.startAngle);
    return Math.round(ratio * (segment.range[1] - segment.range[0]) + segment.range[0]);
}

function updateFilterDisplays() {
    d3.select("#age-value-display").text(`${circularFilters.Age.min} - ${circularFilters.Age.max} yrs`);
    d3.select("#weight-value-display").text(`${circularFilters.Weight.min} - ${circularFilters.Weight.max} kg`);
    
    const sexSelection = [];
    if (circularFilters.Sex.male) sexSelection.push("Male");
    if (circularFilters.Sex.female) sexSelection.push("Female");
    d3.select("#sex-value-display").text(sexSelection.length === 0 ? "None" : sexSelection.join(" & "));
}

updateFilterDisplays();

function updateWeightDisplay() {
    weightValue.textContent = `${weightFilterMin} - ${weightFilterMax}`;
}

function splitBySemicolon(value) {
    return value ? value.split(";").map(v => v.trim()).filter(Boolean) : [];
}

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

d3.csv("data.csv", function (d, i) {
    d.StartDate = parseDateString(d.StartDate);
    d.EndDate = parseDateString(d.EndDate);
    d.id = i;

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
}).then(function (data) {

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
    drawLegend();
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

        if (!(startDateValid && endDateValid)) return false;

        if (circularFilters.Age.min > 1 || circularFilters.Age.max < 100) {
            if (report.PatientAge === 'unknown') return false;
            const age = parseInt(report.PatientAge, 10);
            if (isNaN(age) || age < circularFilters.Age.min || age > circularFilters.Age.max) return false;
        }

        if (circularFilters.Weight.min > 0 || circularFilters.Weight.max < 200) {
            if (report.PatientWeight === 'unknown') return false;
            const weight = parseFloat(report.PatientWeight);
            if (isNaN(weight) || weight < circularFilters.Weight.min || weight > circularFilters.Weight.max) return false;
        }

        if (!(circularFilters.Sex.min === 0 && circularFilters.Sex.max === 1)) {
            if (report.PatientSex === 'unknown') return false;
            if (circularFilters.Sex.min === 0 && circularFilters.Sex.max === 0 && report.PatientSex !== 'male') return false;
            if (circularFilters.Sex.min === 1 && circularFilters.Sex.max === 1 && report.PatientSex !== 'female') return false;
            if (circularFilters.Sex.min === 0 && circularFilters.Sex.max === 1) {
            }
        }

        return true;
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
            if (newLeft < leftHandleLeft + activeHandle.offsetWidth) {
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
        .attr("dy", "0")
        .text(function(d) {
            return d.data.key;
        })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none");
    

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
        .on("click", function(event, d) {
            stopAllBeating();
            triggerBeatingForProduct([d.data.key]);
            showProductInfo(d.data);
        });

    products.each(function(d) {
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
                    .attr("class", "report-rect")
                    .attr("x", 0)
                    .attr("y", i * reportHeight)
                    .attr("width", productWidth)
                    .attr("height", reportHeight)
                    .attr("fill", outcomeColors[report.Outcome] || "#ccc")
                    .attr("stroke", outcomeColors[report.Outcome] || "#ccc")
                    .attr("stroke-width", 2)
                    .on("mouseover", function (event) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        tooltip.html(`Medicinal Product: ${d.data.key}`)
                            .style("left", `${event.pageX + 5}px`)
                            .style("top", `${event.pageY - 28}px`);
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style("opacity", 0);
                    })
                    .on("click", function (event) {
                        event.stopPropagation();
                        stopAllBeating();
                        triggerBeatingForProduct([d.data.key]);
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
}

function drawLegend() {
    const legendSvg = d3.select("#legend-container")
        .append("svg")
        .attr("width", outerWidth + margin.left + margin.right)
        .attr("height", 35)
        .style("margin-bottom", "0px");

    const legendGroup = legendSvg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${outerWidth/4}, 20)`);

    legendGroup.append("circle")
        .attr("cx", -200)
        .attr("cy", 0)
        .attr("r", 10)
        .attr("fill", "green");

    legendGroup.append("text")
        .attr("x", -180)
        .attr("y", 5)
        .text("Generic Names")
        .style("font-size", "12px")
        .attr("text-anchor", "start");

    legendGroup.append("circle")
        .attr("cx", -75)
        .attr("cy", 0)
        .attr("r", 10)
        .attr("fill", "blue");

    legendGroup.append("text")
        .attr("x", -60)
        .attr("y", 5)
        .text("Brand Names")
        .style("font-size", "12px")
        .attr("text-anchor", "start");

    const outcomeLegendGroup = legendGroup.append("g")
        .attr("class", "outcome-legend")
        .attr("transform", `translate(90, 0)`);

    let legendX = 0;

    Object.keys(outcomeColors).forEach(outcome => {
        outcomeLegendGroup.append("rect")
            .attr("x", legendX)
            .attr("y", -10)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", outcomeColors[outcome]);

        outcomeLegendGroup.append("text")
            .attr("x", legendX + 25)
            .attr("y", 5)
            .text(outcome)
            .style("font-size", "12px")
            .attr("text-anchor", "start");

        legendX += 120;
    });
}

function stopAllBeating() {
    d3.selectAll(".beating").classed("beating", false);
}

function triggerBeatingForProduct(products) {
    stopAllBeating();
    d3.selectAll(".product-outer").filter(function (d) {
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
    const sankeyWidth = 1450;
    const sankeyHeight = 1000;

    const sankeySvg = d3.select("#sankey-container")
        .append("svg")
        .attr("width", sankeyWidth)
        .attr("height", sankeyHeight)
        .append("g");

    const sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(20)
        .extent([[1, 1], [sankeyWidth - 1, sankeyHeight - 6]])
        .nodeAlign(d3.sankeyCenter)
        .nodeSort(null);

    let graph = {
        nodes: nodesData.map(d => Object.assign({}, d)),
        links: linksData.map(d => Object.assign({}, d))
    };

    drawSankeyGraph(graph);

    function drawSankeyGraph(graph) {
        sankeySvg.selectAll("*").remove();

        const idToNode = new Map(graph.nodes.map(d => [d.id, d]));

        graph.links.forEach(link => {
            link.source = idToNode.get(link.source.id || link.source);
            link.target = idToNode.get(link.target.id || link.target);
        });

        assignNodeLayers(graph.nodes);

        sankey(graph);

        adjustNegativeLayers(graph.nodes, sankeyWidth);

        const diagramWidth = d3.max(graph.nodes, d => d.x1) - d3.min(graph.nodes, d => d.x0);
        const translateX = (sankeyWidth - diagramWidth) / 2;

        const diagramGroup = sankeySvg.append("g")
            .attr("transform", `translate(${translateX},0)`);

        drawSankeyElements(diagramGroup, graph);

        diagramGroup.selectAll("rect")
            .on("click", function (event, d) {
                if (d.type === "indication" || d.type === "reaction") {
                    if (!d.clickedOnce) {
                        stopAllBeating();
                        d3.select(this).classed("beating", true);
                        d.clickedOnce = true;
                        handleNodeClick(d);
                    } else if (!d.reportsAdded) {
                        d3.select(this).classed("beating", true);
                        d.reportsAdded = true;
                        addReportsToSankey(d, graph);
                    }
                } else if (d.type === 'report_detail') {
                    showReportDetails(event, d);
                }
            })
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html(`${d.name}`)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    function assignNodeLayers(nodes) {
        nodes.forEach(node => {
            if (node.type === "indication") {
                node.layer = -2;
            } else if (node.type === "product") {
                node.layer = 0;
            } else if (node.type === "reaction") {
                node.layer = 2;
            } else if (node.type === "report_detail") {
                if (node.associatedType === "indication") {
                    node.layer = -3;
                } else if (node.associatedType === "reaction") {
                    node.layer = 3;
                }
            }
        });
    }

    function adjustNegativeLayers(nodes, sankeyWidth) {
        const maxLayer = Math.max(...nodes.map(d => d.layer));
        const minLayer = Math.min(...nodes.map(d => d.layer));
        const totalLayers = maxLayer - minLayer + 1;
        const layerWidth = (sankeyWidth - 20) / totalLayers;

        nodes.forEach(node => {
            node.x0 = (node.layer - minLayer) * layerWidth;
            node.x1 = node.x0 + sankey.nodeWidth();
        });
    }

    function drawSankeyElements(sankeySvg, graph) {
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        sankeySvg.append("g")
            .selectAll("path")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("fill", "none")
            .attr("stroke", d => {
                if (d.source.type === "indication" || d.target.type === "indication") {
                    return "darkgreen";
                } else if (d.source.type === "reaction" || d.target.type === "reaction") {
                    return "darkred";
                } else {
                    return "#888";
                }
            })
            .attr("stroke-width", d => Math.max(2, d.width))
            .attr("opacity", 0.5)
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`${d.value} reports`)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", function () {
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
                if (d.type === "report_detail") {
                    if (d.report && d.report.Outcome && outcomeColors[d.report.Outcome]) {
                        return outcomeColors[d.report.Outcome];
                    } else {
                        return "#87ceeb";
                    }
                }
                return colorScale(d.name);
            })
            .attr("stroke", d => {
                if (d.type === "indication") return "darkgreen";
                if (d.type === "reaction") return "darkred";
                if (d.type === "report_detail") return "#4682b4";
                return "#000";
            })
            .attr("stroke-width", 1);
    }

    function addReportsToSankey(nodeData, graph) {
        const reports = getReportsByNode(nodeData);

        const reportNodes = [];
        const reportLinks = [];

        reports.forEach(report => {
            const reportId = report.id;
            const reportDetailNodes = [];
            const safetyReportNodeId = `safety_${reportId}`;
            reportDetailNodes.push({
                id: safetyReportNodeId,
                name: `Report ID: ${reportId}`,
                type: 'report_detail',
                associatedType: nodeData.type,
                reportId: reportId,
                report: report
            });

            if (report.PatientSex && report.PatientSex !== 'unknown') {
                const sexNodeId = `sex_${reportId}`;
                const sex = report.PatientSex.charAt(0).toUpperCase() + report.PatientSex.slice(1);
                reportDetailNodes.push({
                    id: sexNodeId,
                    name: `Sex: ${sex}`,
                    type: 'report_detail',
                    associatedType: nodeData.type,
                    reportId: reportId,
                    report: report
                });
            }

            if (report.PatientAge && report.PatientAge !== 'unknown') {
                const ageNodeId = `age_${reportId}`;
                reportDetailNodes.push({
                    id: ageNodeId,
                    name: `Age: ${report.PatientAge} years`,
                    type: 'report_detail',
                    associatedType: nodeData.type,
                    reportId: reportId,
                    report: report
                });
            }

            if (report.PatientWeight && report.PatientWeight !== 'unknown') {
                const weightNodeId = `weight_${reportId}`;
                reportDetailNodes.push({
                    id: weightNodeId,
                    name: `Weight: ${report.PatientWeight} kg`,
                    type: 'report_detail',
                    associatedType: nodeData.type,
                    reportId: reportId,
                    report: report
                });
            }

            reportDetailNodes.forEach(detailNode => {
                reportLinks.push({
                    source: nodeData.type === 'indication' ? detailNode.id : nodeData.id,
                    target: nodeData.type === 'indication' ? nodeData.id : detailNode.id,
                    value: 1
                });
            });

            reportNodes.push(...reportDetailNodes);
        });

        graph.nodes.push(...reportNodes);
        graph.links.push(...reportLinks);
        graph.nodes = Array.from(new Map(graph.nodes.map(node => [node.id, node])).values());

        const linkSet = new Set();
        graph.links = graph.links.filter(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            const key = `${sourceId}->${targetId}`;
            if (linkSet.has(key)) {
                return false;
            } else {
                linkSet.add(key);
                return true;
            }
        });

        drawSankeyGraph(graph);
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

    function getReportsByNode(nodeData) {
        return originalData.filter(report => {
            if (nodeData.type === 'indication') {
                return splitBySemicolon(report.DrugIndication).includes(nodeData.name);
            } else if (nodeData.type === 'reaction') {
                return splitBySemicolon(report.Reactions).includes(nodeData.name);
            }
            return false;
        });
    }
}

function showReportDetails(event, d) {
    d3.selectAll(".detail-box").remove();
    const x = event.pageX + 20;
    const y = event.pageY - 20;
    const detailBox = d3.select("body")
        .append("div")
        .attr("class", "detail-box")
        .style("position", "absolute")
        .style("left", `${x}px`)
        .style("top", `${y}px`)
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("pointer-events", "auto")
        .style("z-index", "1000");

    let message = "Patient Details:<br>";
    const report = d.report;
    const fields = [];

    if (report.id) {
        fields.push(`<strong>Safety Report ID:</strong> ${report.id}`);
    }
    if (report.PatientAge && report.PatientAge !== 'unknown') {
        fields.push(`<strong>Age:</strong> ${report.PatientAge} years`);
    }
    if (report.PatientSex && report.PatientSex !== 'unknown') {
        fields.push(`<strong>Sex:</strong> ${report.PatientSex}`);
    }
    if (report.PatientWeight && report.PatientWeight !== 'unknown') {
        fields.push(`<strong>Weight:</strong> ${report.PatientWeight} kg`);
    }

    message += fields.join("<br>");

    detailBox.html(message);

    d3.select("body").on("click.detailBox", function(evt) {
        const isClickInside = detailBox.node().contains(evt.target);
        if (!isClickInside) {
            detailBox.remove();
            d3.select("body").on("click.detailBox", null);
        }
    });
    detailBox.on("click", function(event) {
        event.stopPropagation();
    });
}