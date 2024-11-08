<<<<<<< HEAD
<<<<<<< HEAD
const _ = window._;
let originalData = [];
<<<<<<< HEAD
const margin = { top: 5, right: 10, bottom: 10, left: 10 },
=======
=======
const _ = window._;
>>>>>>> d2da13c (Report Slider Working)
=======

>>>>>>> 337e668 (Timeline Slider Updated)
const margin = { top: 10, right: 10, bottom: 10, left: 10 },
>>>>>>> d85a6ad (Adding project files)
    outerWidth = document.getElementById("treemap").clientWidth - margin.left - margin.right,
    outerHeight = document.getElementById("treemap").clientHeight - margin.top - margin.bottom,
    countryMargin = 0,
    productMargin = 4,
    countryPadding = 4;

<<<<<<< HEAD
let selectedOutcome = null;

let isCountryFilterActive = false;
let currentCountry = null;
let toggleCountryFilterBtn;
let countryFilterMessage;

let groupedData = [];
let totalReports = 0;
let minDate, maxDate;
let selectedStartDate, selectedEndDate;
let currentEnlargedElement = null;
let currentReports = [];
let reactionColorScale;
let indicationColorScale;
let beatingProducts = [];

const timelineBar = d3.select('#timeline-bar');
let weeklyReportCounts = [];
let densitySvg;
let timelineWidthGlobal = 0;

let sankeyState = {
    expandedNode: null
};

let sankeyPaginationState = {
    indications: {
        currentPage: 0,
        pageSize: 10,
        totalPages: 0,
    },
    reactions: {
        currentPage: 0,
        pageSize: 10,
        totalPages: 0,
    },
    reports: {
        currentPage: 0,
        pageSize: 10,
        totalPages: 0,
    }
};

let currentProductData = null;
=======
let groupedData = [];
let totalReports = 0;
let currentEnlargedElement = null;
let minDate, maxDate;

>>>>>>> d85a6ad (Adding project files)
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
<<<<<<< HEAD
    "Congenital Anomali": "#ffc0cb",
=======
>>>>>>> d85a6ad (Adding project files)
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

<<<<<<< HEAD
=======
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

<<<<<<< HEAD

>>>>>>> d85a6ad (Adding project files)
=======
>>>>>>> 337e668 (Timeline Slider Updated)
const reportSlider = document.getElementById("report-slider");
const reportCount = document.getElementById("report-count");

reportSlider.addEventListener("input", function () {
<<<<<<< HEAD
<<<<<<< HEAD
    const value = parseInt(reportSlider.value, 10);
    reportCount.textContent = `${value} reports`;
    updateTreemap();
});

const searchBar = document.getElementById('search-bar');
searchBar.setAttribute('autocomplete', 'off');

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
    .attr("transform", `translate(88, 120)`);

circularSliderSVG.append("text")
    .attr("class", "age-text")
    .attr("x", 0)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .text("");

circularSliderSVG.append("text")
    .attr("class", "weight-text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .text("");

circularSliderSVG.append("text")
    .attr("class", "sex-text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .text("");

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
=======
    const value = parseInt(reportSlider.value, 10);
    reportCount.textContent = `${value} reports`;
    updateTreemap();
});

function updateTreemap() {
    console.log('Selected Start Date:', selectedStartDate);
    console.log('Selected End Date:', selectedEndDate);

<<<<<<< HEAD
    drawTreemap(limitedData);
}
>>>>>>> d2da13c (Report Slider Working)

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
    d3.select(".age-text")
        .text(`${circularFilters.Age.min} - ${circularFilters.Age.max} yrs`);

    d3.select(".weight-text")
        .text(`${circularFilters.Weight.min} - ${circularFilters.Weight.max} kg`);

    const sexSelection = [];
    if (circularFilters.Sex.male) sexSelection.push("Male");
    if (circularFilters.Sex.female) sexSelection.push("Female");
    d3.select(".sex-text")
        .text(sexSelection.length === 0 ? "None" : sexSelection.join(" & "));
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
    if (!dateString || dateString.length < 8) return null;
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10);
    const day = parseInt(dateString.substring(6, 8), 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return null;
    
    date.setHours(0, 0, 0, 0);
    return date;
}

d3.csv("data.csv", function (d, i) {
    d.StartDate = parseDateString(d.StartDate);
    d.EndDate = parseDateString(d.EndDate);
    d.id = d.SafetyreportID;

    if (d.PatientSex === '1') {
        d.PatientSex = 'male';
    } else if (d.PatientSex === '2') {
        d.PatientSex = 'female';
    } else {
        d.PatientSex = 'unknown';
=======
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
>>>>>>> 337e668 (Timeline Slider Updated)
    }
    d.PatientAge = d.PatientAge || 'unknown';
    d.PatientWeight = d.PatientWeight || 'unknown';

<<<<<<< HEAD
    d.Outcome = d.Outcome.trim();
    if (!outcomeColors.hasOwnProperty(d.Outcome)) {
        d.Outcome = "Other";
    }
    d.ReportCountry = d.ReportCountry || 'Unknown Country';

    return d;
}).then(function (data) {

    console.log("Fields in data[0]:", Object.keys(data[0]));

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
=======
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

    function formatDate(date) {
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
>>>>>>> 337e668 (Timeline Slider Updated)

    weeklyReportCounts = computeWeeklyReportCounts(originalData, minDate, maxDate);

<<<<<<< HEAD
    const densityColorScaleLocal = createColorScale(weeklyReportCounts);
    densityColorScale = densityColorScaleLocal;
=======
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
>>>>>>> d2da13c (Report Slider Working)

    densitySvg = timelineBar.append("svg")
        .attr("width", "100%")
        .attr("height", "40")
        .style("position", "absolute")
        .style("top", "0px")
        .style("left", "0px")
        .style("pointer-events", "none");

    timelineWidthGlobal = timelineBar.node().getBoundingClientRect().width;

    drawDensityGradient(
        weeklyReportCounts,
        densityColorScale,
        densitySvg,
        timelineWidthGlobal,
        40
    );

    drawDensityGradientResponsive();

    window.addEventListener('resize', drawDensityGradientResponsive);

    function splitAndTrim(value) {
        return value ? value.split(";").map(v => v.trim()).filter(Boolean) : [];
    }

    const reactionCounts = {};
    originalData.forEach(report => {
        splitAndTrim(report.Reactions).forEach(reaction => {
            if (reaction) {
                reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
            }
        });
    });

    const indicationCounts = {};
    originalData.forEach(report => {
        splitAndTrim(report.DrugIndication).forEach(indication => {
            if (indication) {
                indicationCounts[indication] = (indicationCounts[indication] || 0) + 1;
            }
        });
    });

    window.totalReactionCounts = reactionCounts;
    window.totalIndicationCounts = indicationCounts;

    const reactionMaxCount = d3.max(Object.values(window.totalReactionCounts)) || 1;
    const indicationMaxCount = d3.max(Object.values(window.totalIndicationCounts)) || 1;

    reactionColorScale = d3.scaleLinear()
        .domain([0, reactionMaxCount / 2, reactionMaxCount])
        .range(["#ffcccc", "#ff0000", "#8B0000"])
        .interpolate(d3.interpolateHcl);

    indicationColorScale = d3.scaleLinear()
        .domain([0, indicationMaxCount / 2, indicationMaxCount])
        .range(["#ccffcc", "#00cc00", "#006400"])
        .interpolate(d3.interpolateHcl);

        document.getElementById('search-bar').addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            stopAllBeating();
        
            d3.selectAll(".product-outer").classed("highlight", false).classed("beating", false);
        
            const dropdown = d3.select("#search-dropdown");
        
            if (query) {
                let totalMatches = 0;
                let productMatches = 0;
                let countryMatches = 0;
                let reactionMatches = 0;
                let indicationMatches = 0;
                let genericNameMatches = 0;
                let brandNameMatches = 0;
        
                const matchedProducts = new Set();
                const matchedCountries = new Set();
                const matchedReactions = new Set();
                const matchedIndications = new Set();
                const matchedGenericNames = new Set();
                const matchedBrandNames = new Set();
        
                d3.selectAll(".product").each(function (d) {
                    const productName = d.data.key.toLowerCase();
                    const countryName = d.parent.data.key.toLowerCase();
        
                    let isMatch = false;
        
                    if (productName.includes(query)) {
                        matchedProducts.add(d.data.key);
                        isMatch = true;
                    }
        
                    if (countryName.includes(query)) {
                        matchedCountries.add(d.parent.data.key);
                        isMatch = true;
                    }
        
                    const genericNames = d.data.reports
                        .map(report => splitBySemicolon(report.GenericName))
                        .flat()
                        .map(name => name.toLowerCase());
        
                    genericNames.forEach(genericName => {
                        if (genericName.includes(query)) {
                            matchedGenericNames.add(genericName);
                            matchedProducts.add(d.data.key);
                        }
                    });
        
                    const brandNames = d.data.reports
                        .map(report => splitBySemicolon(report.BrandName))
                        .flat()
                        .map(name => name.toLowerCase());
        
                    brandNames.forEach(brandName => {
                        if (brandName.includes(query)) {
                            matchedBrandNames.add(brandName);
                            matchedProducts.add(d.data.key);
                        }
                    });
        
                    if (isMatch) {
                        const productRect = d3.select(this).select(".product-outer");
                        productRect.classed("highlight", true).classed("beating", true);
                    }
                });
        
                originalData.forEach(report => {
                    const reactions = splitBySemicolon(report.Reactions).map(r => r.toLowerCase());
                    reactions.forEach(reaction => {
                        if (reaction.includes(query)) {
                            matchedReactions.add(reaction);
                            matchedProducts.add(report.Medicinalproduct);
                        }
                    });
        
                    const indications = splitBySemicolon(report.DrugIndication).map(i => i.toLowerCase());
                    indications.forEach(indication => {
                        if (indication.includes(query)) {
                            matchedIndications.add(indication);
                            matchedProducts.add(report.Medicinalproduct);
                        }
                    });
                });
        
                productMatches = matchedProducts.size;
                countryMatches = matchedCountries.size;
                reactionMatches = matchedReactions.size;
                indicationMatches = matchedIndications.size;
                genericNameMatches = matchedGenericNames.size;
                brandNameMatches = matchedBrandNames.size;
                totalMatches = productMatches + countryMatches + reactionMatches + indicationMatches + genericNameMatches + brandNameMatches;
        
                matchedProducts.forEach(product => {
                    d3.selectAll(".product-outer")
                        .filter(function (d) { return d.data.key === product; })
                        .classed("beating", true);
                });
        
                let dropdownContent = `<strong>${totalMatches} match${totalMatches !== 1 ? 'es' : ''} found</strong><br/>`;
        
                if (productMatches > 0) {
                    dropdownContent += `${productMatches} Medicinal Product${productMatches !== 1 ? 's' : ''}<br/>`;
                }
                if (countryMatches > 0) {
                    dropdownContent += `${countryMatches} ${countryMatches !== 1 ? 'Countries' : 'Country'}<br/>`;
                }
                if (reactionMatches > 0) {
                    dropdownContent += `${reactionMatches} Reaction${reactionMatches !== 1 ? 's' : ''}<br/>`;
                }
                if (indicationMatches > 0) {
                    dropdownContent += `${indicationMatches} Indication${indicationMatches !== 1 ? 's' : ''}<br/>`;
                }
                if (genericNameMatches > 0) {
                    dropdownContent += `${genericNameMatches} Generic Name${genericNameMatches !== 1 ? 's' : ''}<br/>`;
                }
                if (brandNameMatches > 0) {
                    dropdownContent += `${brandNameMatches} Brand Name${brandNameMatches !== 1 ? 's' : ''}<br/>`;
                }
        
                dropdown.html(dropdownContent)
                    .style("display", "block")
                    .style("background", "#fff")
                    .style("border", "1px solid #ccc")
                    .style("padding", "10px")
                    .style("position", "absolute")
                    .style("width", "160px")
                    .style("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.1)")
                    .style("z-index", "1000")
                    .style("top", (document.getElementById("search-bar").offsetTop + document.getElementById("search-bar").offsetHeight + 5) + "px")
                    .style("left", document.getElementById("search-bar").offsetLeft + "px");
            } else {
                d3.select("#search-dropdown").style("display", "none");
            }
        });
        

    document.addEventListener('click', function(event) {
        const searchBar = document.getElementById('search-bar');
        const dropdown = document.getElementById('search-dropdown');
        if (!searchBar.contains(event.target) && !dropdown.contains(event.target)) {
            d3.select("#search-dropdown").style("display", "none");
        }
    });
});

function filterDataByReportLimitAndDateRange(data, reportLimit, selectedStartDate, selectedEndDate) {
    console.log(`Total reports before filtering: ${data.length}`);

    const filteredReports = data.filter(report => {
        const reportEndDate = report.EndDate;
        const dateValid = (!reportEndDate || (reportEndDate >= selectedStartDate && reportEndDate <= selectedEndDate));

        if (!dateValid) return false;

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

        const sexFilter = circularFilters.Sex;
        const sexSelected = [];
        if (sexFilter.male) sexSelected.push('male');
        if (sexFilter.female) sexSelected.push('female');

        if (sexSelected.length === 0) {
        } else if (sexSelected.length === 2) {
        } else {
            if (report.PatientSex === 'unknown' || report.PatientSex !== sexSelected[0]) return false;
        }

        if (selectedOutcome) {
            if (report.Outcome !== selectedOutcome) {
                return false;
            }
        }

        return true;
    });
    console.log(`Total reports after filtering: ${filteredReports.length}`);

    const limitedReports = filteredReports.slice(0, reportLimit);
    console.log(`Total reports after limiting: ${limitedReports.length}`);
    const groupedData = groupDataByCountryAndProduct(limitedReports);
    console.log(`Grouped Data:`, groupedData);

    return groupedData;
}

function computeWeeklyReportCounts(data, minDate, maxDate) {
    const weeks = d3.timeMonday.range(minDate, d3.timeMonday.offset(maxDate, 1));

    const weekCounts = weeks.map(weekStart => {
        const weekEnd = d3.timeSunday.offset(weekStart, 1);
        const count = data.filter(report => {
            return report.EndDate && report.EndDate >= weekStart && report.EndDate < weekEnd;
        }).length;
        return { weekStart, count };
    });

    return weekCounts;
}

function createColorScale(weekCounts) {
    const maxCount = d3.max(weekCounts, d => d.count) || 1;
    
    const colorScale = d3.scaleLinear()
        .domain([0, maxCount / 2, maxCount])
        .range(["#e0f7fa", "#26c6da", "#01579b"])
        .interpolate(d3.interpolateHcl);

    return colorScale;
}

function drawDensityGradient(weekCounts, colorScale, svg, width, height) {
    svg.select("defs").remove();
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "density-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    const totalDuration = maxDate - minDate;

    weekCounts.forEach((d) => {
        const offset = ((d.weekStart - minDate) / totalDuration) * 100;
        gradient.append("stop")
            .attr("offset", `${offset}%`)
            .attr("stop-color", colorScale(d.count));
    });

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#density-gradient)");
}

function drawDensityGradientResponsive() {
    timelineWidthGlobal = timelineBar.node().getBoundingClientRect().width;
    const densityHeight = 18;

    densitySvg.attr("width", timelineWidthGlobal)
              .attr("height", densityHeight);

    drawDensityGradient(
        weeklyReportCounts,
        densityColorScale,
        densitySvg,
        timelineWidthGlobal,
        densityHeight
    );
}

function formatDate(date) {
    if (!(date instanceof Date)) return '';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function initializeDateRangeSlider() {
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

    timelineBar.node().appendChild(selectedRange);
    timelineBar.node().appendChild(leftHandle);
    timelineBar.node().appendChild(rightHandle);
    timelineBar.node().appendChild(leftDateDisplay);
    timelineBar.node().appendChild(rightDateDisplay);

    leftHandle.setAttribute('title', 'Start Date Slider');
    rightHandle.setAttribute('title', 'End Date Slider');

    timelineWidthGlobal = timelineBar.node().getBoundingClientRect().width;

    leftHandle.style.left = '4px';
    rightHandle.style.left = `${timelineWidthGlobal - 6}px`;

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
        if (newLeft > timelineWidthGlobal - 16) newLeft = timelineWidthGlobal - 16;

        if (activeHandle === leftHandle) {
            const rightHandleLeft = parseInt(rightHandle.style.left);
            if (newLeft > rightHandleLeft - 16) {
                newLeft = rightHandleLeft - 16;
            }
        } else if (activeHandle === rightHandle) {
            const leftHandleLeft = parseInt(leftHandle.style.left);
            if (newLeft < leftHandleLeft + 16) {
                newLeft = leftHandleLeft + 16;
            }
        }

        activeHandle.style.left = `${newLeft}px`;

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
    
        selectedStartDate = calculateDateFromX(leftHandleLeft + 8);
        selectedEndDate = calculateDateFromX(rightHandleLeft + 8);
    
        selectedStartDate.setHours(0, 0, 0, 0);
        selectedEndDate.setHours(0, 0, 0, 0);
    
        const rangeLeft = leftHandleLeft + 8;
        const rangeWidth = (rightHandleLeft + 8) - rangeLeft;
    
        selectedRange.style.left = `${rangeLeft}px`;
        selectedRange.style.width = `${rangeWidth}px`;
    
        leftDateDisplay.textContent = formatDate(selectedStartDate);
        rightDateDisplay.textContent = formatDate(selectedEndDate);
    
        leftDateDisplay.style.left = `${leftHandleLeft + 40}px`;
        leftDateDisplay.style.top = `${0}px`;
        rightDateDisplay.style.left = `${rightHandleLeft - 40}px`;
        rightDateDisplay.style.top = `${0}px`;
    }
    

    function calculateDateFromX(x) {
        const percentage = x / timelineWidthGlobal;
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
        })).sort((a, b) => d3.descending(a.value, b.value))
    })).sort((a, b) => d3.ascending(a.key, b.key));
}

function initializeSlider(maxReports) {
    const roundedMaxReports = Math.ceil(maxReports / 100) * 100;

    const reportSlider = document.getElementById("report-slider");
    reportSlider.max = roundedMaxReports;
    reportSlider.value = roundedMaxReports;
    reportSlider.step = 100;
    document.getElementById("report-count").textContent = `${roundedMaxReports} reports`;

    // function if I upload the larger data file -
    // const maxReportss = 5000; // Set to a reasonable limit
    // reportSlider.max = maxReportss;
    // reportSlider.value = maxReportss;
    // reportSlider.step = 100;
    // document.getElementById("report-count").textContent = `${maxReportss} reports`;

}

function drawTreemap(data) {
    zoomGroup.selectAll("*").remove();

    if (!data || data.length === 0) return;
    // function for arranging the nodes alphabetically according to their names.
    // const root = d3.hierarchy({ key: "World", values: data }, d => d.values)
    //     .sum(d => d.value)
    //     .sort((a, b) => d3.ascending(a.data.key, b.data.key));

    let totalReportsShown = 0;
    data.forEach(country => {
        country.values.forEach(product => {
            totalReportsShown += product.reports.length;
        });
    });
    console.log(`Total reports being shown in treemap: ${totalReportsShown}`);

    const root = d3.hierarchy({ key: "World", values: data }, d => d.values)
    .sum(d => Math.max(d.value, 0.1))
    .sort(function(a, b) {
        if (a.depth === b.depth && a.depth === 1) {
            return d3.ascending(a.data.key, b.data.key);
        } else if (a.depth === b.depth && a.depth === 2) {
            return d3.descending(a.value, b.value) || d3.ascending(a.data.key, b.data.key);
        } else {
            return 0;
        }
    });

    const countryPadding = 2;
    const topPadding = 14;

    const treemap = d3.treemap()
    .size([outerWidth, outerHeight])
    .paddingOuter(countryPadding)
    .paddingInner(function(d) {
        const height = d.y1 - d.y0;
        return height < 50 ? 1 : 3;
    })
    .paddingTop(function(d) {
        const height = d.y1 - d.y0;
        return Math.min(topPadding, height * 1);
    })
    .tile(d3.treemapBinary)
    .round(true);

    treemap(root);

    const countries = zoomGroup.selectAll(".country")
=======
    const value = reportSlider.value;
    reportCount.textContent = `${value} reports`;

    updateTreemapBasedOnReports(value);
});

function updateTreemapBasedOnReports(reportCount) {
    console.log(`Update treemap for ${reportCount} reports.`);
}





const timelineBar = document.getElementById('timeline-bar');
const selectionRectangle = document.getElementById('selection-rectangle');
const timeSpanDisplay = document.getElementById('time-span-display');
const leftDateDisplay = document.createElement('div');
const rightDateDisplay = document.createElement('div');

leftDateDisplay.className = 'date-display';
rightDateDisplay.className = 'date-display';
timelineBar.appendChild(leftDateDisplay);
timelineBar.appendChild(rightDateDisplay);

let isDragging = false;
let isDraggingSelection = false;
let startX = 0;
let currentX = 0;
let selectionStartX = 0;
let selectionWidth = 0;
const timelineStart = new Date('1987-01-01');
const timelineEnd = new Date('2021-12-31');
const timelineWidth = timelineBar.offsetWidth;
const verticalLinesCount = 30;

function calculateMonths(start, end) {
    const diffTime = Math.abs(end - start);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
}

function calculateDateFromX(x) {
    const totalMonths = calculateMonths(timelineStart, timelineEnd);
    const percentage = x / timelineWidth;
    const selectedMonth = Math.floor(percentage * totalMonths);
    const date = new Date(timelineStart);
    date.setMonth(date.getMonth() + selectedMonth);
    return date;
}

function formatDate(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function generateEquallySpacedDates() {
    const dates = [];
    const totalMonths = calculateMonths(timelineStart, timelineEnd);
    const monthsPerLine = Math.floor(totalMonths / verticalLinesCount);
    
    for (let i = 0; i < verticalLinesCount; i++) {
        const newDate = new Date(timelineStart);
        newDate.setMonth(newDate.getMonth() + monthsPerLine * i);
        dates.push(newDate);
    }

    return dates;
}

function drawVerticalLines(dates) {
    dates.forEach(date => {
        const x = calculateXFromDate(date);
        const line = document.createElement('div');
        line.className = 'vertical-line';
        line.style.left = `${x}px`;
        timelineBar.appendChild(line);
    });
}

function calculateXFromDate(date) {
    const totalMonths = calculateMonths(timelineStart, timelineEnd);
    const dateMonths = calculateMonths(timelineStart, date);
    const percentage = dateMonths / totalMonths;
    return Math.floor(percentage * timelineWidth);
}

timelineBar.addEventListener('mousedown', (e) => {
    if (isDraggingSelection) return;

    isDragging = true;
    startX = e.offsetX;

    selectionRectangle.style.display = 'block';
    selectionRectangle.style.left = `${startX}px`;
    selectionRectangle.style.width = '0px';

    leftDateDisplay.style.display = 'block';
    rightDateDisplay.style.display = 'block';
});

timelineBar.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    currentX = e.offsetX;
    const width = Math.abs(currentX - startX);
    selectionRectangle.style.width = `${width}px`;
    selectionRectangle.style.left = `${Math.min(startX, currentX)}px`;

    const startDate = calculateDateFromX(Math.min(startX, currentX));
    const endDate = calculateDateFromX(Math.max(startX, currentX));

    leftDateDisplay.textContent = formatDate(startDate);
    rightDateDisplay.textContent = formatDate(endDate);

    const rectX = Math.min(startX, currentX);
    const rectWidth = width;

    leftDateDisplay.style.left = `${rectX}px`;
    rightDateDisplay.style.left = `${rectX + rectWidth - rightDateDisplay.offsetWidth}px`;

    leftDateDisplay.style.top = `${selectionRectangle.offsetTop - 30}px`;
    rightDateDisplay.style.top = `${selectionRectangle.offsetTop - 30}px`;
});

timelineBar.addEventListener('mouseup', () => {
    isDragging = false;
    selectionWidth = selectionRectangle.offsetWidth;
    selectionStartX = parseInt(selectionRectangle.style.left);

    selectionRectangle.style.cursor = 'move';
    isDraggingSelection = false;
});

selectionRectangle.addEventListener('mousedown', (e) => {
    isDraggingSelection = true;
    startX = e.clientX;
});

window.addEventListener('mousemove', (e) => {
    if (!isDraggingSelection) return;

    const deltaX = e.clientX - startX;
    let newLeft = selectionStartX + deltaX;

    if (newLeft < 0) {
        newLeft = 0;
    }
    if (newLeft + selectionWidth > timelineWidth) {
        newLeft = timelineWidth - selectionWidth;
    }

    selectionRectangle.style.left = `${newLeft}px`;

    const startDate = calculateDateFromX(newLeft);
    const endDate = calculateDateFromX(newLeft + selectionWidth);

    leftDateDisplay.textContent = formatDate(startDate);
    rightDateDisplay.textContent = formatDate(endDate);

    leftDateDisplay.style.left = `${newLeft}px`;
    rightDateDisplay.style.left = `${newLeft + selectionWidth - rightDateDisplay.offsetWidth}px`;

    leftDateDisplay.style.top = `${selectionRectangle.offsetTop - 30}px`;
    rightDateDisplay.style.top = `${selectionRectangle.offsetTop - 30}px`;
});

window.addEventListener('mouseup', () => {
    if (isDraggingSelection) {
        isDraggingSelection = false;
        selectionStartX = parseInt(selectionRectangle.style.left);
    }
});

const equallySpacedDates = generateEquallySpacedDates();
drawVerticalLines(equallySpacedDates);


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

function updateVisualizations() {
    drawTreemap(groupedData);
}

function togglePatientInfoIcons(shapeElement) {
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

        const totalIcons = predefinedPatientData.length * 3;
        const angleStep = (Math.PI * 2) / totalIcons;

        predefinedPatientData.forEach((patient, i) => {
            const icons = [
                { type: "Sex", file: "male.png", value: patient.sex },
                { type: "Age", file: "age.png", value: patient.age },
                { type: "Weight", file: "weight.png", value: patient.weight }
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

                document.body.appendChild(img);
            });
        });

        shapeElement.classed("icons-visible", true);
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
            .style("width", "200px")
            .style("height", "200px")
            .style("border-radius", "50%")
            .style("border", "3px solid black")
            .style("background-color", "rgba(255, 255, 255, 0.566)")
            .style("cursor", "move")
            .style("z-index", "1000")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style("color", "black")
            .style("font-size", "17px");

        magicLens.call(makeDraggable);

        magicLens.html("Hover over an icon to see dosage information");

        checkOverlapWithIcons(magicLens);

        magicLens.on("mouseup", () => {
            magicLens.html("Hover over an icon to see dosage information");
        });
    }
}

function checkOverlapWithIcons(magicLens) {
    const checkOverlap = () => {
        let isOverIcon = false;

        d3.selectAll('.patient-info-icon').each(function() {
            const iconElement = this;
            const lensCenter = getLensCenter(magicLens);
            const iconCenter = getIconCenter(iconElement);

            const tolerance = 15;
            if (Math.abs(lensCenter.x - iconCenter.x) < tolerance && 
                Math.abs(lensCenter.y - iconCenter.y) < tolerance) {
                const dosageInfo = "This patient took ibuprofen with 500mg dosage for 50 days from 01/11/2010 to 02/02/2011, resulting in a Not Serious outcome.";
                magicLens.html(dosageInfo);
                isOverIcon = true;
            }
        });

        if (!isOverIcon) {
            magicLens.html("Hover over an icon to see dosage information");
        }
        
        requestAnimationFrame(checkOverlap);
    };

    requestAnimationFrame(checkOverlap);
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
            isDragging = true;
            offsetX = event.clientX - parseInt(d3.select(this).style("left"));
            offsetY = event.clientY - parseInt(d3.select(this).style("top"));
        })
        .on("mousemove", function (event) {
            if (isDragging) {
                d3.select(this)
                    .style("left", `${event.clientX - offsetX}px`)
                    .style("top", `${event.clientY - offsetY}px`);
            }
        })
        .on("mouseup", function () {
            isDragging = false;
        })
        .on("mouseleave", function () {
            isDragging = false;
        });
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
        console.log(`Reports for Reaction: ${d.data.key}`, reports);
        if (reports.length > 0) {
            toggleBounceAndEnlarge(d3.select(this), reports);
        } else {
            console.error("No valid reports found for this shape.");
        }
    });

    d3.selectAll(".indication-group rect").on("click", function (event, d) {
        const reports = getReportsForShape("DrugIndication", d.data.key, groupedData);
        console.log(`Reports for Indication: ${d.data.key}`, reports);
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

function getReportsForShape(field, value, data) {
    const matchingReports = [];

    data.forEach(country => {
        country.values.forEach(product => {
            product.reports.forEach(report => {
                const fieldValues = splitBySemicolon(report[field]);
                if (fieldValues.includes(value)) {
                    matchingReports.push(report);
                }
            });
        });
    });

    console.log(`Found ${matchingReports.length} matching reports for ${field}: ${value}`);
    return matchingReports;
}

function toggleBounceAndEnlarge(element) {
    const isBouncing = element.classed("bouncing");
    const isEnlarged = element.classed("enlarged");

    if (isBouncing && !isEnlarged) {
        element.classed("bouncing", false).classed("enlarged", true);
        enlargeShapeInPlace(element);
        fadeBackground();
        togglePatientInfoIcons(element);
        createMagicLens();
        currentEnlargedElement = element;

    } else if (isEnlarged) {
        restoreBackground();
        element.classed("enlarged", false).attr("transform", null);
        togglePatientInfoIcons(element);
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

    const indications = new Set();
    const reactions = new Set();

    if (productData && productData.reports) {
        productData.reports.forEach(report => {
            splitBySemicolon(report.DrugIndication).forEach(indication => indications.add(indication));
            splitBySemicolon(report.Reactions).forEach(reaction => reactions.add(reaction));
        });
    }

    const sortedIndications = Array.from(indications).sort();
    const sortedReactions = Array.from(reactions).sort();

    const linkedShapes = [];
    const indicationGroup = infoSvg.append("g").attr("class", "indication-group");
    const reactionGroup = infoSvg.append("g").attr("class", "reaction-group");

    const indicationXOffset = halfWidth / 2 - 220;
    const reactionXOffset = halfWidth + halfWidth / 2 - 200;

    drawAlphabeticalShapes(sortedIndications, indicationGroup, indicationXOffset, "Indication", linkedShapes, productData);

    drawAlphabeticalShapes(sortedReactions, reactionGroup, reactionXOffset, "Reaction", linkedShapes, productData);
}

function drawAlphabeticalShapes(items, group, xOffset, type, linkedShapes, productData) {
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

            if (type === "Indication") {
                const indicationShape = group.append("rect")
                    .attr("x", xOffset + rowX * shapeSize + rowX * 10)
                    .attr("y", rowY)
                    .attr("width", shapeSize)
                    .attr("height", shapeSize)
                    .attr("fill", "#a9ff92")
                    .attr("stroke", "darkgreen")
                    .attr("stroke-width", 4)
                    .attr("class", "fadeable")
                    .on("mouseover", (event) => showTooltip(event, item))
                    .on("mouseout", hideTooltip)
                    .on("click", function () {
                        onShapeClick(item, "DrugIndication", productData, indicationShape.node());
                    });

                linkedShapes.push([indicationShape.node()]);
            } else if (type === "Reaction") {
                const reactionShape = group.append("polygon")
                    .attr("points", hexagonPoints(xOffset + rowX * shapeSize + rowX * 10, rowY + 20, 20))
                    .attr("fill", "#ff7e7e")
                    .attr("stroke", "darkred")
                    .attr("stroke-width", 4)
                    .attr("class", "fadeable")
                    .on("mouseover", (event) => showTooltip(event, item))
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

function showTooltip(event, item) {
    tooltip.transition()
        .duration(200)
        .style("opacity", 1);
    tooltip.html(`${item}`)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
}

function hideTooltip() {
    tooltip.transition().duration(500).style("opacity", 0);
}

function onShapeClick(item, field, productData, element) {
    const reports = getReportsForShape(field, item, productData);
    if (reports.length > 0) {
        toggleBounceAndEnlarge(d3.select(element), reports);
        highlightProductsByReactionOrIndication(item, field);
        updateInfoPanelForShapes();
        
    }
}

function getReportsForShape(field, value, productData) {
    const matchingReports = [];

    productData.reports.forEach(report => {
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
<<<<<<< HEAD
    const groupedData = groupDataByCountryAndProduct(data);

    const root = d3.hierarchy({ key: "World", values: groupedData }, d => d.values)
        .sum(d => d.value);

    const treemap = d3.treemap()
        .size([outerWidth, outerHeight])
        .paddingOuter(countryPadding)
        .paddingInner(productMargin)
        .round(true);

    treemap(root);

    countries = zoomGroup.selectAll(".country")
>>>>>>> d85a6ad (Adding project files)
        .data(root.children)
        .enter()
        .append("g")
        .attr("class", "country")
<<<<<<< HEAD
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    countries.append("rect")
=======
        .attr("transform", d => `translate(${d.x0 + countryMargin},${d.y0 + countryMargin})`);

        countries.append("rect")
>>>>>>> d85a6ad (Adding project files)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", "#ffffff")
        .attr("stroke", "#000000")
<<<<<<< HEAD
        .attr("stroke-width", 0.1)
        .append("title")
        .text(function(d) { return d.data.key; })
        .on("mouseover", function() { d3.select(this).attr("fill", "#f0f0f0"); })
        .on("mouseout", function() { d3.select(this).attr("fill", "#fff"); });

        countries.append("text")
        .attr("x", function(d) {
            return (d.x1 - d.x0) / 2;
        })
        .attr("y", function(d) {
            const height = d.y1 - d.y0;
            const paddingTop = Math.min(topPadding, height * 0.05);
            return Math.max(paddingTop / 50, 6);
        })
        .attr("dy", "0.35em")
        .text(function(d) {
            const width = d.x1 - d.x0;
            const approxCharWidth = 4;
            const maxChars = Math.floor(width / approxCharWidth);
            let text = d.data.key;
            if (text.length > maxChars) {
                text = text.slice(0, maxChars - 3) + '...';
            }
            return text;
        })
        .attr("font-size", function(d) {
            const width = d.x1 - d.x0;
            const height = d.y1 - d.y0;
            let fontSize = Math.min((width / d.data.key.length) * 1.5, 8);
            fontSize = Math.max(fontSize, 5);
            return fontSize + "px";
        })
        .attr("text-anchor", "middle")
        .append("title")
        .text(function(d) { return d.data.key; });    

        const products = countries.selectAll(".product")
=======
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
>>>>>>> d85a6ad (Adding project files)
        .data(d => d.children)
        .enter()
        .append("g")
        .attr("class", "product")
<<<<<<< HEAD
        .attr("transform", d => `translate(${d.x0 - d.parent.x0},${d.y0 - d.parent.y0})`)
        .on("click", function(event, d) {
            try {
                stopAllBeating();
                triggerBeatingForProduct([d.data.key]);
                console.log("Treemap click handler executed.");
                console.log("d.data:", d.data);
                console.log("d.data.reports:", d.data.reports);

                if (d.data.reports && d.data.reports.length > 0) {
                    const firstReport = d.data.reports[0];
                    console.log("First report:", firstReport);
                    console.log("Available fields in first report:", Object.keys(firstReport));
                    console.log("ReportCountry:", firstReport.ReportCountry);
                    currentCountry = firstReport.ReportCountry || 'Unknown Country';
                } else {
                    currentCountry = 'Unknown Country';
                }

                console.log("Clicked medicinal product:", d.data.key);
                console.log("Product reports:", d.data.reports);
                console.log("Current country:", currentCountry);
                showProductInfo(d.data);
            } catch (error) {
                console.error("Error in treemap click handler:", error);
            }
        });

        products.append("rect")
        .datum(d => d)
        .attr("class", "product-outer")
        .attr("width", d => Math.max(0, d.x1 - d.x0))
        .attr("height", d => Math.max(0, d.y1 - d.y0))
        .attr("fill", "#ffffff")
        .attr("stroke", "#000000")
        .attr("stroke-width", 0);

    products.each(function(d) {
=======
        .attr("transform", d => `translate(${d.x0 - d.parent.x0},${d.y0 - d.parent.y0})`);

    products.append("rect")
        .attr("class", "product-outer")
        .attr("width", d => Math.max(0, d.x1 - d.x0))
        .attr("height", d => Math.max(0, d.y1 - d.y0))
        .attr("fill", ".product-outer ")
        .attr("stroke", ".product-outer ")
        .attr("stroke-width", ".product-outer");

    products.each(function (d) {
>>>>>>> d85a6ad (Adding project files)
        const productG = d3.select(this);
        const productRect = productG.select(".product-outer");
        const productHeight = d.y1 - d.y0;
        const productWidth = d.x1 - d.x0;
        const numReports = d.data.reports.length;

        if (numReports > 0) {
<<<<<<< HEAD
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
                        tooltip.html(`Med Prd: ${d.data.key}`)
                            .style("left", `${event.pageX + 5}px`)
                            .style("top", `${event.pageY - 28}px`);
                    })
                    .on("mouseout", function () {
                        tooltip.transition().duration(500).style("opacity", 0);
                    })
                    
            });
        }

=======

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
        triggerBeatingForProduct(productRect);
    });

    });

    d3.selectAll(".reaction-group polygon").on("click", function (event, d) {
        const reports = getReportsForShape("Reactions", d.data.key, groupedData);
        console.log(`Reports for Reaction: ${d.data.key}`, reports);
        if (reports.length > 0) {
            toggleBounceAndEnlarge(d3.select(this), reports);
        } else {
            console.error("No valid reports found for this shape.");
        }
    });

    d3.selectAll(".indication-group rect").on("click", function (event, d) {
        const reports = getReportsForShape("DrugIndication", d.data.key, groupedData);
        console.log(`Reports for Indication: ${d.data.key}`, reports);
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

>>>>>>> d85a6ad (Adding project files)
        const allGenericNames = new Set();
        const allBrandNames = new Set();

        d.data.reports.forEach(report => {
            splitBySemicolon(report.GenericName).forEach(name => allGenericNames.add(name));
            splitBySemicolon(report.BrandName).forEach(name => allBrandNames.add(name));
        });

        const dotGroup = productG.append("g").attr("class", "dot-group");

<<<<<<< HEAD
        const dotSize = Math.min(productHeight, productWidth) / 10;
        const centerX = productWidth / 2;
        const centerY = productHeight / 2;

        let angle = 0;
        let radius = dotSize * 2.5;
=======
        const dotSize = Math.min(availableHeight, availableWidth) / 10;
        const centerX = availableWidth / 2;
        const centerY = availableHeight / 2;

        let dotX = centerX, dotY = centerY;
        let angle = 0, radius = dotSize * 2.5;
>>>>>>> d85a6ad (Adding project files)

        const placeDotsRadially = (names, color) => {
            names.forEach((name, i) => {
                if (name) {
<<<<<<< HEAD
                    const nextX = centerX + radius * Math.cos(angle);
                    const nextY = centerY + radius * Math.sin(angle);

                    if (nextX - dotSize > 0 && nextX + dotSize < productWidth &&
                        nextY - dotSize > 0 && nextY + dotSize < productHeight) {
=======
                    const nextX = dotX + radius * Math.cos(angle);
                    const nextY = dotY + radius * Math.sin(angle);

                    if (nextX - dotSize > 0 && nextX + dotSize < availableWidth &&
                        nextY - dotSize > 0 && nextY + dotSize < availableHeight) {
>>>>>>> d85a6ad (Adding project files)
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
<<<<<<< HEAD
                        if (angle >= Math.PI * 2) {
=======
                        if (angle > Math.PI * 2) {
>>>>>>> d85a6ad (Adding project files)
                            angle = 0;
                            radius += dotSize * 2.5;
                        }
                    }
                }
            });
        };

<<<<<<< HEAD
        placeDotsRadially(Array.from(allGenericNames), "green");
        placeDotsRadially(Array.from(allBrandNames), "blue");
    });
}

function drawLegend() {
    d3.select("#legend-container").selectAll("*").remove();

    const legendSvg = d3.select("#legend-container")
        .append("svg")
        .attr("width", outerWidth + margin.left + margin.right)
        .attr("height", 35)
        .style("margin-bottom", "0px");

    const legendGroup = legendSvg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${outerWidth / 4}, 20)`);

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

    const legendItems = outcomeLegendGroup.selectAll(".legend-item")
        .data(Object.keys(outcomeColors))
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * 135}, 0)`)
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            if (selectedOutcome === d) {
                selectedOutcome = null;
            } else {
                selectedOutcome = d;
            }
            updateTreemap();
            drawLegend();
        });

    legendItems.append("rect")
        .attr("x", 0)
        .attr("y", -10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => outcomeColors[d])
        .attr("stroke", d => (selectedOutcome === d ? "#000" : "none"))
        .attr("stroke-width", d => (selectedOutcome === d ? 2 : 0));

    legendItems.append("text")
        .attr("x", 25)
        .attr("y", 5)
        .text(d => d)
        .style("font-size", "12px")
        .attr("text-anchor", "start");
}


function stopAllBeating() {
    d3.selectAll(".beating").classed("beating", false);
}

function triggerBeatingForProduct(products) {
    stopAllBeating();
    const normalizedProducts = products.map(p => p.trim().toLowerCase());

    d3.selectAll(".product-outer").filter(function (d) {
        const productKey = d.data.key.trim().toLowerCase();
        return normalizedProducts.includes(productKey);
    }).classed("beating", true);
}

function normalizeName(name) {
    return name.trim();
}

function showProductInfo(productData) {
    currentProductData = productData;
    console.log("In showProductInfo, currentCountry is:", currentCountry);
    d3.select("#sankey-container").html("");

    let reportsToUse;
    if (!isCountryFilterActive) {
        reportsToUse = productData.reports;
    } else {
        const targetProductName = productData.key.trim().toLowerCase();
        reportsToUse = originalData.filter(report => report.Medicinalproduct.trim().toLowerCase() === targetProductName);

    }

    window.currentReportsToUse = reportsToUse;

    const indicationCounts = {};
    const reactionCounts = {};

    if (reportsToUse && reportsToUse.length > 0) {
        reportsToUse.forEach(report => {
            splitBySemicolon(report.DrugIndication).forEach(indication => {
                if (indication) {
                    const normalizedIndication = indication.trim();
                    indicationCounts[normalizedIndication] = (indicationCounts[normalizedIndication] || 0) + 1;
                }
            });
            splitBySemicolon(report.Reactions).forEach(reaction => {
                if (reaction) {
                    const normalizedReaction = reaction.trim();
                    reactionCounts[normalizedReaction] = (reactionCounts[normalizedReaction] || 0) + 1;
                }
            });
        });
    }

    const allIndications = Object.keys(indicationCounts).sort();
    const allReactions = Object.keys(reactionCounts).sort();

    const nodes = [
        ...allIndications.map(name => ({ id: `ind_${name}`, name, type: 'indication' })),
        { id: `prod_${productData.key}`, name: productData.key, type: 'product', clickedOnce: false },
        ...allReactions.map(name => ({ id: `reac_${name}`, name, type: 'reaction' })),
    ];

    const links = [
        ...allIndications.map(name => ({
            source: `ind_${name}`,
            target: `prod_${productData.key}`,
            value: indicationCounts[name],
            originalValue: indicationCounts[name],
        })),
        ...allReactions.map(name => ({
            source: `prod_${productData.key}`,
            target: `reac_${name}`,
            value: reactionCounts[name],
            originalValue: reactionCounts[name],
        })),
    ];

    drawSankeyDiagram(nodes, links);

    if (isCountryFilterActive) {
        countryFilterMessage.textContent = 'Showing reports all over the world';
    } else {
        countryFilterMessage.textContent = `Showing reports for ${currentCountry}`;
    }
}

const internalMargin = { left: 10, right: 100 };

function drawSankeyDiagram(nodesData, linksData) {
    const sankeyWidth = 1300;
    const sankeyHeight = Math.max(2000, nodesData.length * 50);

    const sankeySvg = d3.select("#sankey-container")
        .append("svg")
        .attr("width", sankeyWidth)
        .attr("height", sankeyHeight)
        .append("g");

    const sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(20)
        .extent([[internalMargin.left, 1], [sankeyWidth - internalMargin.right, sankeyHeight - 6]])
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
        adjustLayers(graph.nodes, sankeyWidth);
    
        const nodeWidth = 20;
        const minNodeHeight = 20;
        const maxNodeHeight = 800;
        const nodePadding = 15;
    
        const numberOfNodes = graph.nodes.length;
    
        let sankeyHeight = numberOfNodes * (minNodeHeight + nodePadding) + 80;
    
        const sankey = d3.sankey()
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .extent([[internalMargin.left, 1], [sankeyWidth - internalMargin.right, sankeyHeight - 1]])
            .nodeAlign(d3.sankeyCenter)
            .nodeSort(null);
    
        sankey(graph);
    
        let nodeHeights = graph.nodes.map(d => d.y1 - d.y0);
        let minActualNodeHeight = d3.min(nodeHeights);
        let maxActualNodeHeight = d3.max(nodeHeights);
    
        let valueScalingFactor = 1;
    
        if (minActualNodeHeight < minNodeHeight) {
            const minHeightScalingFactor = minNodeHeight / minActualNodeHeight;
            valueScalingFactor = Math.max(valueScalingFactor, minHeightScalingFactor);
        }
    
        if (maxActualNodeHeight > maxNodeHeight) {
            const maxHeightScalingFactor = maxNodeHeight / maxActualNodeHeight;
            valueScalingFactor = Math.min(valueScalingFactor, maxHeightScalingFactor);
        }
    
        if (valueScalingFactor !== 1) {
            graph.links.forEach(link => {
                link.value *= valueScalingFactor;
            });
            graph.nodes.forEach(node => {
                node.value = 0;
            });
            graph.links.forEach(link => {
                link.source.value += link.value;
                link.target.value += link.value;
            });
        
            sankey(graph);
            nodeHeights = graph.nodes.map(d => d.y1 - d.y0);
            minActualNodeHeight = d3.min(nodeHeights);
            maxActualNodeHeight = d3.max(nodeHeights);
        }
    
        if (minActualNodeHeight < minNodeHeight) {
            const heightScalingFactor = minNodeHeight / minActualNodeHeight;
            sankeyHeight *= heightScalingFactor;
            sankey.extent([[internalMargin.left, 1], [sankeyWidth - internalMargin.right, sankeyHeight - 1]]);
            sankey(graph);
        }
        sankeySvg
            .attr("height", sankeyHeight);
    
        const diagramWidth = d3.max(graph.nodes, d => d.x1) - d3.min(graph.nodes, d => d.x0);
        const translateX = (sankeyWidth - diagramWidth) / 2;
    
        const diagramGroup = sankeySvg.append("g")
            .attr("transform", `translate(${translateX},0)`);
    
        drawSankeyElements(diagramGroup, graph);
    }
    
    
    function assignNodeLayers(nodes) {
        nodes.forEach(node => {
            if (node.type === "report_detail") {
                if (node.associatedType === "indication") {
                    node.layer = 0;
                } else if (node.associatedType === "reaction") {
                    node.layer = 4;
                }
            } else if (node.type === "indication") {
                node.layer = 1;
            } else if (node.type === "product") {
                node.layer = 2;
            } else if (node.type === "reaction") {
                node.layer = 3;
            }
        });
    }

    function adjustLayers(nodes, sankeyWidth) {
        const totalLayers = 5;
        const maxLayerWidth = 200;
        const layerWidth = Math.min((sankeyWidth - 40) / totalLayers, maxLayerWidth);
    
        const centerX = sankeyWidth / 2 - 20 / 2;
    
        nodes.forEach(node => {
            node.x0 = centerX + (node.layer - 2) * layerWidth;
            node.x1 = node.x0 + 20;
        });
    }
    
    function toggleNodeExpansion(nodeData, graph) {
        if (nodeData.clickedOnce) {
            collapseNode(nodeData, graph);
            nodeData.clickedOnce = false;
        } else {
            graph.nodes.forEach(n => {
                if (n.type === "indication" || n.type === "reaction") {
                    n.clickedOnce = false;
                }
            });
            expandNode(nodeData, graph);
            nodeData.clickedOnce = true;
        }
    }

    function expandNode(nodeData, graph) {
        sankeyState.expandedNode = nodeData.id;
    
        const reports = getReportsByNode(nodeData);
    
        reports.forEach(report => {
            const reportId = report.SafetyreportID;
    
            const reportDetailNode = {
                id: `detail_${reportId}`,
                name: `${reportId}`,
                type: 'report_detail',
                associatedType: nodeData.type,
                reportId: reportId,
                report: report
            };
    
            if (!graph.nodes.find(n => n.id === reportDetailNode.id)) {
                graph.nodes.push(reportDetailNode);
            }
    
            if (nodeData.type === "indication") {
                graph.links.push({
                    source: reportDetailNode.id,
                    target: nodeData.id,
                    value: 1,
                    report: report
                });
            } else if (nodeData.type === "reaction") {
                graph.links.push({
                    source: nodeData.id,
                    target: reportDetailNode.id,
                    value: 1,
                    report: report
                });
            }
        });
    
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
    
    function collapseNode(nodeData, graph) {
        sankeyState.expandedNode = null;

        graph.nodes = graph.nodes.filter(node => 
            !node.id.startsWith('detail_')
        );

        graph.links = graph.links.filter(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return !(sourceId.startsWith('detail_') || targetId.startsWith('detail_'));
        });

        drawSankeyGraph(graph);
    }

    function drawSankeyElements(diagramGroup, graph) {
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const maxReportCount = d3.max(graph.links, d => d.value) || 1;
    

    const indicationColorScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(window.totalIndicationCounts)) / 2, d3.max(Object.values(window.totalIndicationCounts))])
        .range(["#ccffcc", "#00cc00", "#006400"])
        .interpolate(d3.interpolateHcl);

    const reactionColorScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(window.totalReactionCounts)) / 2, d3.max(Object.values(window.totalReactionCounts))])
        .range(["#ffcccc", "#ff0000", "#8B0000"])
        .interpolate(d3.interpolateHcl);

    const link = diagramGroup.append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("fill", "none")
        .attr("stroke", d => {
            if ((d.source.type === "report_detail" && (d.target.type === "indication" || d.target.type === "reaction")) ||
                ((d.source.type === "indication" || d.source.type === "reaction") && d.target.type === "report_detail")) {
                const report = d.source.type === "report_detail" ? d.source.report : d.target.report;
                const outcome = report.Outcome;
                return outcomeColors[outcome] || "#87ceeb";
            } else if (d.source.type === "indication" || d.target.type === "indication") {
                const indicationName = d.source.type === "indication" ? d.source.name : d.target.name;
                const count = window.totalIndicationCounts[indicationName] || 0;
                return indicationColorScale(count);
            } else if (d.source.type === "reaction" || d.target.type === "reaction") {
                const reactionName = d.source.type === "reaction" ? d.source.name : d.target.name;
                const count = window.totalReactionCounts[reactionName] || 0;
                return reactionColorScale(count);
            } else {
                return "#888";
            }
        })
        
        .attr("stroke-width", d => d.width)
        .attr("opacity", 0.8)
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            const reportCount = d.originalValue;
            tooltip.html(`${reportCount} report${reportCount !== 1 ? 's' : ''}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    const defs = diagramGroup.append("defs");

    defs.selectAll("path.link-label-path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link-label-path")
        .attr("id", d => `link-label-path-${d.source.id}-${d.target.id}`)
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("fill", "none")
        .attr("stroke", "none");

    const linkLabels = diagramGroup.append("g")
        .attr("class", "link-labels")
        .selectAll("text.link-label")
        .data(graph.links)
        .enter()
        .append("text")
        .attr("class", "link-label")
        .attr("dy", "0.35em")
        .attr("fill", "#000")
        .attr("pointer-events", "none")
        .style("font-size", d => {
            const minFont = 8;
            const maxFont = 12;
            const scaledSize = Math.min(d.width / 2, maxFont);
            return `${Math.max(scaledSize, minFont)}px`;
        })
        .append("textPath")
        .attr("href", d => `#link-label-path-${d.source.id}-${d.target.id}`)
        .attr("startOffset", d => {
            if (d.source.type === "report_detail" && (d.target.type === "indication" || d.target.type === "reaction")) {
                return "5%";
            } else if ((d.source.type === "indication" || d.source.type === "reaction") && d.target.type === "report_detail") {
                return "95%";
            } else if (d.source.type === "indication" && d.target.type === "product") {
                return "5%";
            } else if (d.source.type === "product" && d.target.type === "reaction") {
                return "95%";
            }
            return "50%";
        })
        .attr("text-anchor", d => {
            if (d.source.type === "report_detail" && (d.target.type === "indication" || d.target.type === "reaction")) {
                return "start";
            } else if ((d.source.type === "indication" || d.source.type === "reaction") && d.target.type === "report_detail") {
                return "end";
            } else if (d.source.type === "indication" && d.target.type === "product") {
                return "start";
            } else if (d.source.type === "product" && d.target.type === "reaction") {
                return "end";
            }
            return "middle";
        })
        .text(d => {
            if ((d.source.type === "report_detail" && (d.target.type === "indication" || d.target.type === "reaction")) ||
                ((d.source.type === "indication" || d.source.type === "reaction") && d.target.type === "report_detail")) {
                const report = d.source.type === "report_detail" ? d.source.report : d.target.report;
                return getPatientDetails(report);
            } else if (d.source.type === "indication" && d.target.type === "product") {
                return d.source.name;
            } else if (d.source.type === "product" && d.target.type === "reaction") {
                return d.target.name;
            }
            return "";
        });

    linkLabels.selectAll("textPath")
        .attr("dominant-baseline", "middle")
        .style("pointer-events", "none");
    
        const nodeGroup = diagramGroup.append("g")
            .selectAll("g")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("data-node-id", d => d.id);
    
        nodeGroup.append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => {
                if (d.type === "product") {
                    return "#d3d3d3";
                }
                if (d.type === "indication") {
                    const count = window.totalIndicationCounts[d.name] || 0;
                    return indicationColorScale(count);
                }
                if (d.type === "reaction") {
                    const count = window.totalReactionCounts[d.name] || 0;
                    return reactionColorScale(count);
                }
                if (d.type === "report_detail") {
                    return outcomeColors[d.report.Outcome] || "#87ceeb";
                }
                return colorScale(d.name);
            })
            .attr("stroke", d => {
                if (d.type === "indication") return "darkgreen";
                if (d.type === "reaction") return "darkred";
                if (d.type === "report_detail") return "#4682b4";
                return "#000";
            })
            .attr("stroke-width", 1)
            .on("click", function (event, d) {
                if (d.type === "indication" || d.type === "reaction") {
                    if (!d3.select(this).classed("beating")) {
                        const associatedProducts = findProductsByReactionOrIndication(d.type, d.name);
                        beatingProducts = associatedProducts;
                        triggerBeatingForProduct(associatedProducts);
                        d3.select(this).classed("beating", true);
                    } else {
                        toggleNodeExpansion(d, graph);
                    }
                } else if (d.type === 'report_detail') {
                    event.stopPropagation();
                    stopAllBeating();
                    d3.selectAll(".report_detail").classed("beating", false);
                    d3.select(this).classed("beating", true);
                    showReportDetails(event, d);
                }
            })
            .on("mouseover", function (event, d) {
                if (d.type === 'report_detail') {
                }
            })
            .on("mouseout", function(event, d) {
                if (d.type === 'report_detail') {
                    tooltip.transition().duration(500).style("opacity", 0);
                }
            });
            nodeGroup.filter(d => d.type === 'product').append("text")
            .attr("x", d => (d.x0 + d.x1) / 2)
            .attr("y", d => d.y0 + 30)
            .attr("text-anchor", "middle")
            .style("font-size", d => {
                const nodeHeight = d.y1 - d.y0;
                const maxFontSize = 14;
                const fontSize = Math.min(nodeHeight / d.name.length, maxFontSize);
                return `${fontSize}px`;
            })
            .each(function(nodeData) {
                const textElem = d3.select(this);
                const letters = nodeData.name.split("");
                letters.forEach((letter, i) => {
                    textElem.append("tspan")
                        .attr("x", (nodeData.x0 + nodeData.x1) / 2)
                        .attr("dy", i === 0 ? "0em" : "1.5em")
                        .text(letter);
                });
            })
            .style("fill", "#000")
            .style("pointer-events", "none");

    }

    function getPatientDetails(report) {
        const details = [];
        if (report.SafetyreportID) {
            details.push(`Report ID: ${report.SafetyreportID}`);
        }
        if (report.PatientSex && report.PatientSex !== 'unknown') {
            details.push(`${capitalize(report.PatientSex)}`);
        }
        if (report.PatientAge && report.PatientAge !== 'unknown') {
            details.push(`${report.PatientAge} years`);
        }
        if (report.PatientWeight && report.PatientWeight !== 'unknown') {
            details.push(`${report.PatientWeight} kg`);
        }
        return details.join(' | ');
    }


    function findProductsByReactionOrIndication(type, name) {
        const products = [];
        const targetName = name.trim().toLowerCase();
    
        originalData.forEach(report => {
            const productName = report.Medicinalproduct.trim();
            const normalizedProductName = productName.toLowerCase();
    
            if (type === "indication") {
                const indications = splitBySemicolon(report.DrugIndication).map(s => s.trim().toLowerCase());
                if (indications.includes(targetName)) {
                    products.push(normalizedProductName);
                }
            } else if (type === "reaction") {
                const reactions = splitBySemicolon(report.Reactions).map(s => s.trim().toLowerCase());
                if (reactions.includes(targetName)) {
                    products.push(normalizedProductName);
                }
            }
        });
    
        return [...new Set(products)];
    }
       

    function getReportsByNode(nodeData) {
        const nodeName = nodeData.name.trim().toLowerCase();
        return window.currentReportsToUse.filter(report => {
            if (nodeData.type === 'indication') {
                const indications = splitBySemicolon(report.DrugIndication).map(s => s.trim().toLowerCase());
                return indications.includes(nodeName);
            } else if (nodeData.type === 'reaction') {
                const reactions = splitBySemicolon(report.Reactions).map(s => s.trim().toLowerCase());
                return reactions.includes(nodeName);
            }
            return false;
        });
    }       

    function capitalize(str) {
        if (typeof str !== 'string') return '';
        if (str.length === 0) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function showReportDetails(event, d) {
        d3.selectAll(".detail-box").remove();
        d3.select("body").on("click.detailBox", null);
    
        const margin = 20;
        const boxWidth = 300;
        const boxHeight = 200;
        const xSpace = 20;
        const ySpace = 20;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
    
        let x = event.clientX + xSpace;
        let y = event.clientY + ySpace;
    
        if (x + boxWidth > viewportWidth) {
            x = event.clientX - boxWidth - xSpace;
        }
    
        if (y + boxHeight > viewportHeight) {
            y = event.clientY - boxHeight - ySpace;
        }
    
        if (x < margin) x = margin;
        if (y < margin) y = margin;
    
        const detailBox = d3.select("body")
            .append("div")
            .attr("class", "detail-box")
            .style("position", "fixed")
            .style("left", `${x}px`)
            .style("top", `${y}px`)
            .style("pointer-events", "auto")
            .style("width", `${boxWidth}px`)
            .style("max-height", `${boxHeight}px`)
            .style("overflow-y", "auto")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "10px")
            .style("box-shadow", "0 4px 8px rgba(0,0,0,0.2)")
            .style("z-index", 1000)
            .html("");
    
        const report = d.report;
        const medicinalProduct = report.Medicinalproduct || null;
        const dosage = report.DosageText && report.DosageText !== 'unknown' ? report.DosageText : null;
        const treatmentDuration = report.TreatmentDuration && report.TreatmentDuration !== 'unknown' ? report.TreatmentDuration : null;
        const startDate = report.StartDate && report.StartDate !== 'unknown' ? formatDate(report.StartDate) : null;
        const endDate = report.EndDate && report.EndDate !== 'unknown' ? formatDate(report.EndDate) : null;
        const indications = splitBySemicolon(report.DrugIndication);
        const reactions = splitBySemicolon(report.Reactions);
    
        let message = "The patient";
    
        if (medicinalProduct) {
            message += ` took <span class="medical-product">${medicinalProduct}</span>`;
        } else {
            message += ` did not report a specific medicinal product`;
        }
    
        if (dosage) {
            message += ` with a dosage of <span class="dosage">${dosage}</span>`;
        }
    
        if (treatmentDuration) {
            message += ` for a treatment duration of <span class="treatment-duration">${treatmentDuration}</span> days`;
        }
    
        if (startDate && endDate) {
            message += ` from <span class="start-date">${startDate}</span> to <span class="end-date">${endDate}</span>`;
        } else if (startDate && !endDate) {
            message += ` starting on <span class="start-date">${startDate}</span>`;
        } else if (!startDate && endDate) {
            message += ` until <span class="end-date">${endDate}</span>`;
        }
    
        if (indications.length > 0) {
            message += ` for <span class="indications">${indications.join(", ")}</span> Indications`;
        }
    
        if (reactions.length > 0) {
            message += ` and got <span class="reactions">${reactions.join(", ")}</span> reactions.`;
        } else {
            message += ` without any reported reactions.`;
        }
    
        if (indications.length === 0 && reactions.length === 0) {
            message = message.replace(/ and got .* reactions\./, ".");
        }
        if (!message.endsWith(".")) {
            message += ".";
        }
        detailBox.html(message);
    
        d3.select("body").on("click.detailBox", function(evt) {
            if (!detailBox.node().contains(evt.target)) {
                detailBox.remove();
                d3.select("body").on("click.detailBox", null);
                stopAllBeating();
            }
        });
    
        detailBox.on("click", function(event) {
            event.stopPropagation();
        });
    }
    
}

function showTooltip(element, text) {
    const tooltip = d3.select("body").append("div")
        .attr("class", "pagination-tooltip")
        .style("position", "absolute")
        .style("background", "#333")
        .style("color", "#fff")
        .style("padding", "5px 10px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0.8)
        .text(text);

    const rect = element.getBoundingClientRect();
    tooltip.style("left", `${rect.left + window.scrollX}px`)
        .style("top", `${rect.top + window.scrollY - 30}px`);
}

function capitalize(str) {
    if (typeof str !== 'string') return '';
    if (str.length === 0) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}


document.addEventListener("DOMContentLoaded", function() {

    toggleCountryFilterBtn = document.getElementById('toggle-country-filter-btn');
    countryFilterMessage = document.getElementById('country-filter-message');

    toggleCountryFilterBtn.textContent = 'See Global Data';
    countryFilterMessage.textContent = 'Please select a medicinal product to see reports.'

    toggleCountryFilterBtn.addEventListener('click', function() {
        if (!currentProductData) {
            alert('Please select a medicinal product first.');
            return;
        }
        isCountryFilterActive = !isCountryFilterActive;
        if (isCountryFilterActive) {
            toggleCountryFilterBtn.textContent = 'See Country Specific';
            countryFilterMessage.textContent = 'Showing reports all over the world';
        } else {
            toggleCountryFilterBtn.textContent = 'See Global Data';
            countryFilterMessage.textContent = `Showing reports for ${currentCountry}`;
        }
        showProductInfo(currentProductData);
    });    

    const toggleViewBtn = document.getElementById('toggle-view-btn');
    const contentContainer = document.getElementById('content-container');
    let isToggled = false;

    toggleViewBtn.addEventListener('click', function() {
        isToggled = !isToggled;
        if (isToggled) {
            contentContainer.classList.add('toggled-view');
            resizeSVGsForToggledView();
        } else {
            contentContainer.classList.remove('toggled-view');
            resetSVGsToDefault();
        }
    });

    function resizeSVGsForToggledView() {
        d3.select("#treemap svg")
            .attr("width", document.getElementById("treemap").clientWidth)
            .attr("height", outerHeight);

        d3.select("#sankey-container svg")
            .attr("width", document.getElementById("sankey-container").clientWidth)
            .attr("height", outerHeight)
            .style("overflow", "scroll");
    }

    function resetSVGsToDefault() {
        d3.select("#treemap svg")
            .attr("width", outerWidth + margin.left + margin.right)
            .attr("height", outerHeight + margin.top + margin.bottom);

        d3.select("#sankey-container svg")
            .attr("width", document.getElementById("sankey-container").clientWidth)
            .attr("height", 800)
            .style("overflow-y", "visible");
    }

    const toggleBtn = document.getElementById('toggle-structure-btn');
    const structureBox = document.getElementById('structure-box');

    function toggleStructureBox(event) {
        event.stopPropagation();
        structureBox.classList.toggle('visible');
    }

    toggleBtn.addEventListener('click', toggleStructureBox);

    document.addEventListener('click', function(event) {
        const target = event.target;
        if (!structureBox.contains(target) && target !== toggleBtn) {
            structureBox.classList.remove('visible');
        }
    });

    structureBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });

        const data = {
            name: "Country",
            children: [
                {
                    name: "Medicinal Products",
                    children: [
                        { name: "Generic Name" },
                        { name: "Brand Name" },
                        {
                            name: "Patient Details",
                            children: [
                                { name: "Report Id" },
                                { name: "Sex" },
                                { name: "Weight" },
                                { name: "Age" },
                                { name: "Dosage" },
                                { name: "Start Date" },
                                { name: "End Date" },
                                { name: "Treatment Duration" }
                            ]
                        },
                        { name: "Indications" },
                        { name: "Reactions" },
                        { name: "Outcomes" }
                    ]
                }
            ]
        };

        const svg = d3.select("#data-structure-svg");

        function setLabelWidth(node) {
            const avgCharWidth = 7;
            const padding = 15;

            node.data.labelWidth = node.data.name.length * avgCharWidth + padding;

            if (node.children) {
                node.children.forEach(child => setLabelWidth(child));
            }
        }

        function renderTree() {
            svg.selectAll("*").remove();

            const boundingBox = svg.node().getBoundingClientRect();
            const width = boundingBox.width;
            const height = boundingBox.height;

            const root = d3.hierarchy(data);

            setLabelWidth(root);

            const treeLayout = d3.tree()
                .size([height, width - 160])
                .separation(function(a, b) {
                    return (a.parent === b.parent ? 1 : 1.5) / a.depth;
                });

            treeLayout(root);

            const nodes = root.descendants();
            const links = root.links();
            const adjustedLinks = links.map(link => ({
                source: { x: link.source.x, y: link.source.y + link.source.data.labelWidth },
                target: { x: link.target.x, y: link.target.y }
            }));

            const g = svg.append("g")
                .attr("transform", "translate(5,2)");
            const linkGenerator = d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x);

            g.selectAll(".link")
                .data(adjustedLinks)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", linkGenerator)
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-width", 1.5);

            const nodeRadius = 4;
            const fontSize = 10;

            g.selectAll(".node")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("cx", d => d.y)
                .attr("cy", d => d.x)
                .attr("r", nodeRadius)
                .attr("fill", "#555")
                .on("mouseover", function(event, d) {
                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip.html(d.data.name)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                    d3.select(this).attr("fill", "#ff0");
                })
                .on("mouseout", function() {
                    tooltip.transition().duration(500).style("opacity", 0);
                    d3.select(this).attr("fill", "#555");
                });

            const labels = g.selectAll(".label")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "label-group")
                .attr("transform", d => `translate(${d.y}, ${d.x})`);

            labels.each(function(d) {
                const text = d.data.name;

                const labelBox = d3.select(this).append("rect")
                    .attr("class", "label-box")
                    .attr("x", 0)
                    .attr("y", -7)
                    .attr("width", d.data.labelWidth)
                    .attr("height", 14)
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("fill", "white")
                    .attr("stroke", "#ccc");

                d3.select(this).append("circle")
                    .attr("class", "node")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", nodeRadius)
                    .attr("fill", "#555");

                d3.select(this).append("text")
                    .attr("class", "label-text")
                    .attr("x", 5)
                    .attr("y", 3.5)
                    .attr("font-size", fontSize)
                    .attr("fill", "#333")
                    .text(text);
            });

            g.selectAll(".label-group").selectAll(".label-box")
                .lower();
        }
        renderTree();
        window.addEventListener("resize", function() {
            renderTree();
        });
=======
        placeDotsRadially(allGenericNames, "green");
        placeDotsRadially(allBrandNames, "blue");
    });
=======
    groupedData = groupDataByCountryAndProduct(data);
    totalReports = data.length;

    initializeSlider(totalReports);
<<<<<<< HEAD
    drawTreemap(groupedData);
>>>>>>> d2da13c (Report Slider Working)
=======
    updateTreemap();

>>>>>>> 337e668 (Timeline Slider Updated)

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


<<<<<<< HEAD
groupedData = groupDataByCountryAndProduct(data);
drawTreemap(groupedData);
updateVisualizations();
>>>>>>> d85a6ad (Adding project files)
=======
>>>>>>> d2da13c (Report Slider Working)
});