// Load the data
d3.json("salaries.json").then(function(data) {
    let years = [...new Set(data.map(d => d.work_year))];
    let locations = [...new Set(data.map(d => d.company_location))];

    populateDropdowns(years, locations);
    
    createTopRolesChart(data.filter(d => d.work_year === years[0]));
    createSalaryByCompanySizeChart(data.filter(d => d.work_year === years[0]));
    createTopRolesEntryLevelChart(years[0]);

    // Event listeners for dropdowns
    d3.select("#year-dropdown").on("change", function() {
        const selectedYear = d3.select(this).property("value");
        createTopRolesChart(data.filter(d => d.work_year === selectedYear));
        createSalaryByCompanySizeChart(data.filter(d => d.work_year === selectedYear));
        createTopRolesEntryLevelChart(selectedYear);
    });

    d3.select("#location-dropdown").on("change", function() {
        const selectedLocation = d3.select(this).property("value");
        createBubbleChart(data.filter(d => d.company_location === selectedLocation));
    });

}).catch(function(error) {
    console.error("Error fetching the JSON data:", error);
});

function populateDropdowns(years, locations) {
    const yearDropdown = d3.select("#year-dropdown");
    const locationDropdown = d3.select("#location-dropdown");

    if (yearDropdown.empty() || locationDropdown.empty()) {
        console.error("Dropdown elements not found.");
        return;
    }

    yearDropdown.selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    locationDropdown.selectAll("option")
        .data(locations)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
}

function createTopRolesChart(data) {
    const margin = { top: 20, right: 20, bottom: 150, left: 100 }; // Increased left margin for y-axis title
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select("#top-roles-chart").selectAll("*").remove();

    const svg = d3.select("#top-roles-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0]);

    const topRoles = Array.from(d3.rollup(data, v => v.length, d => d.job_title))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(d => ({ key: d[0], value: d[1] }));

    x.domain(topRoles.map(d => d.key));
    y.domain([0, d3.max(topRoles, d => d.value)]);

    svg.selectAll(".bar")
        .data(topRoles)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .style("fill", d => d3.schemeCategory10[topRoles.indexOf(d) % 10]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
        .selectAll("text")
        .style("font-size", "14px")
        .attr("transform", "rotate(-45)") // Tilt x-axis labels
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px");

    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Job Title");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20) // Added space for y-axis title
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Count");
}

function createSalaryByCompanySizeChart(data) {
    const margin = { top: 20, right: 20, bottom: 50, left: 100 }; // Increased left margin for y-axis title
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select("#salary-chart").selectAll("*").remove();

    const svg = d3.select("#salary-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0]);

    const avgSalaries = Array.from(d3.rollup(data, v => d3.mean(v, d => +d.salary_in_usd), d => d.company_size, d => d.experience_level))
        .flatMap(([size, levels]) => 
            Array.from(levels.entries(), ([level, salary]) => ({ size, level, avg_salary: salary }))
        );

    x.domain(avgSalaries.map(d => d.size));
    y.domain([0, d3.max(avgSalaries, d => d.avg_salary)]);

    svg.selectAll(".bar")
        .data(avgSalaries)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.size))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.avg_salary))
        .attr("height", d => height - y(d.avg_salary))
        .style("fill", d => d3.schemeCategory10[avgSalaries.indexOf(d) % 10]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
        .selectAll("text")
        .style("font-size", "14px");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px");

    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Company Size");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20) // Added space for y-axis title
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Average Salary (USD)");
}


function createTopRolesEntryLevelChart(year) {
    d3.json("salaries.json").then(function(data){
        let sampleData = data.filter(item => item.work_year == year);

        let en_data = sampleData.filter(item => item.experience_level === "EN");
        let count_occurrences = en_data.reduce((acc, item) => {
            let salary = parseFloat(item.salary_in_usd);
            if (!acc[item.job_title]) {
                acc[item.job_title] = { count: 0, totalSalary: 0 };
            }
            acc[item.job_title].count += 1;
            acc[item.job_title].totalSalary += salary;
            return acc;
        }, {});

        let jobs_mean_salary = Object.entries(count_occurrences);
        let salary_avg = jobs_mean_salary.map(([job_title, stats]) => ({
            job: job_title,
            count: stats.count,
            avgSalary: (stats.totalSalary / stats.count).toFixed(2)
        }));
        const sorted_data = salary_avg.sort((a, b) => b.count - a.count).slice(0, 5);

        const job_titles = sorted_data.map(item => item.job);
        const salary_avgs = sorted_data.map(item => item.avgSalary);

        let final_data = [{
            x: job_titles,
            y: salary_avgs,
            type: "bar",
            marker: { color: d3.schemeCategory10 }
        }];
        Plotly.newPlot("entry-level-chart", final_data, {
            title: 'Top 5 Preferred Roles for Entry-Level Candidates',
            xaxis: { title: 'Job Title' },
            yaxis: { title: 'Average Salary (USD)' }
        });

        let bubble_data = [{
            x: salary_avg.map(item => item.job), // x-axis is job title
            y: salary_avg.map(item => item.avgSalary), // y-axis is average salary
            mode: "markers",
            marker: {
                size: salary_avg.map(item => 10), // Set a constant size for all bubbles
                color: salary_avg.map(item => item.avgSalary),
                colorscale: "Viridis",
                showscale: true
            },
            text: salary_avg.map(item => `Title: ${item.job}<br>Avg Salary: ${item.avgSalary}<br>Count: ${item.count}`)
        }];
        let layout = {
            title: 'Bubble Chart of Entry-Level Salaries by Job Title',
            xaxis: { 
                title: 'Job Title',
                tickangle: 45 // Tilt x-axis labels
            },
            yaxis: { title: 'Average Salary (USD)' },
            margin: { l: 200, r: 20, t: 50, b: 150 } // Adjust margins for better spacing
        };
        Plotly.newPlot("bubble-chart", bubble_data, layout);
    });
}

function createBubbleChart(data) {
    // Filter and prepare data for bubble chart
    let jobTitles = Array.from(new Set(data.map(d => d.job_title)));
    let avgSalaries = jobTitles.map(job => {
        let salaries = data.filter(d => d.job_title === job).map(d => +d.salary_in_usd);
        let avgSalary = d3.mean(salaries);
        return { job, avgSalary };
    });

    let bubble_data = [{
        x: avgSalaries.map(item => item.job), // x-axis is job title
        y: avgSalaries.map(item => item.avgSalary), // y-axis is average salary
        mode: "markers",
        marker: {
            size: avgSalaries.map(item => 10), // Set a constant size for all bubbles
            color: avgSalaries.map(item => item.avgSalary),
            colorscale: "Viridis",
            showscale: true
        },
        text: avgSalaries.map(item => `Title: ${item.job}<br>Avg Salary: ${item.avgSalary}`)
    }];

    let layout = {
        title: 'Bubble Chart of Salaries by Job Title',
        xaxis: { 
            title: 'Job Title',
            tickangle: 45 // Tilt x-axis labels
        },
        yaxis: { title: 'Average Salary (USD)' },
        margin: { l: 200, r: 20, t: 50, b: 150 } // Adjust margins for better spacing
    };

    Plotly.newPlot("bubble-chart", bubble_data, layout);
}
