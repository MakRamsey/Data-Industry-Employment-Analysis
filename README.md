# Data-Industry-Employment-Analysis

### Project Overview and Purpose:

As every one of us in this class can agree, understanding the employment landscape of the Data Industry can be of vital importance when navigating prospects. For this project, our main aspiration was to analyze our dataset which consisted of anonymously sourced employment information for data professionals and provide some useful insight into the global Data marketplace.

What does the Data Professional Job landscape look like?
⁃	Which titles are the most popular?
⁃	Where are most Data Professionals employed globally?

What Salary Trends can we Identify?
⁃	What does the global salary distribution look like for this dataset?
⁃	How has salary changed over time within the Data Industry?
⁃	Title: Which titles have the highest average salary?
⁃	Company Size: Which company size provides the highest average salary and what does the salary distribution look like for each company size?
⁃	Company Location: Which company location reports the highest average salary and what does the salary distribution look like for each group? Taking into consideration the sample size discrepancies, what does salary distribution and summary statistics look like amongst the top 5 countries for employment?
⁃	Experience Level: Which experience level has the highest average salary and what does the salary distribution look like for each group?
⁃	Remote Ratio: Which remote ratio has the highest average salary and what does the salary distribution look like for each group?

Given the analysis, does this data provide any useful insight as we all navigate our entrance into the world of data?


### Data Source Reference / Ethical Considerations:

The chosen CC0: Public Domain dataset was identified on Kaggle from a page titled “AI/ML Salaries” posted by Cedric Aubin (https://www.kaggle.com/datasets/cedricaubin/ai-ml-salaries) and directly sourced from ai-jobs.net (https://aijobs.net/salaries/download/). The data represents the website’s global salary index and is “…based on internal data (survey submissions + jobs with open salaries). Salary data is in USD and recalculated at its average fx rate during the year for salaries entered in other currencies.” The data is updated weekly, contained 30,151 entries upon download for this project and was utilized as both .json and .csv filetypes. AI-jobs.net mentions the following regarding the ethical sourcing/considerations for this data, “We collect salary information anonymously from professionals and employers all over the world and make it publicly available for anyone to use, share and play around with. Our goal is to have open salary data for everyone. So newbies, experienced pros, hiring managers, recruiters and also startup founders or people wanting to switch careers can make better decisions.” It’s important to note that duplicates were specifically retained in the dataset to acknowledge the potential that repeat entries represented two distinct individuals with the same/similar employment.


### Database Creation, Hydration, Extraction & Cleaning / Transformation:

Both filetypes were read into separate Pandas DataFrames to confirm dataset integrity/congruency and the CSV file was ultimately used to create/hydrate a local NoSQL database using MongoDB. A number of commands were subsequently performed using the PyMongo library to interface with our MongoDB database including a document count and entire dataset extraction/DataFrame generation.

Cleaning was then performed on the dataset. Columns ‘_id’, ‘salary’, and ’salary_currency’ were dropped as the MongoDB unique identifier _id is no longer needed and the salary/salary_currency columns are redundant as the dataset includes a converted ‘salary_in_usd’ column. Conditional mapping was used to transform abbreviated values into their corresponding long-hand version for transparency - this included the:
⁃	‘experience_level’ column ('SE' = ‘Senior-level / Expert', 'EX' = ‘Executive-level / Director', 'MI' = ‘ Mid-level / Intermediate', 'EN' = 'Entry-level / Junior’)
⁃	‘employment_type’ column ('FT' =  'Full-time', 'PT' =  'Part-time', 'CT' =  'Contract', 'FL': = ‘Freelance’)
⁃	‘company_size’ column ('S' = 'Small (<50)', 'M' = ‘Medium (50-250)', 'L' = ‘Large (>250)’)
⁃	‘company_location’ & ‘employee_residence’ columns (Mapped from 2 letter abbreviations to corresponding ISO 3166 country code)

Final column renaming and rearranging of columns was executed and the resulting cleaned dataset CSV file was uploaded to the previously created local MongoDB database as a new collection named “salaries_cleaned”.


### Analysis / Visualizations:

**Python Components**

Analysis and visualization was then carried out with the use of Pandas, Requests/JSON, Hvplots, Matplotlib, Plotly, Seaborn, Panel, Geoapaify API, etc. Specific areas of interest include:
⁃	Global Salary Distribution and Growth Over Time
•	The average salary within the entire dataset was $156,645.65. The maximum and minimum salaries within the dataset were $800,000.00 and $15,000.00 respectively.
•	Average salary within the Data Industry has increased significantly from 2020 to 2024. From ~$103,000.00 to ~$160,000.00.

⁃	Average Salary vs. Position Title
•	The top ten job titles with highest average salaries are as follows: Analytics Engineering Manager, Data Science Tech Lead, Engineering Manager, Head of Machine Learning, AWS Data Architect, Head of AI, Machine Learning Model Engineer, Cloud Data Architect, AI Architect and Quantitative Researcher spanning from $399,880.00 to $225,000.00.
•	The bottom ten job titles with lowest average salaries are as follows: Insight Analyst, Sales Data Analyst, BI Data Engineer, AI Data Scientist, Research Associate, Quantitative Research Analyst, Compliance Data Analyst, CRM Data Analyst, Principal Data Architect, AI Software Development Engineer from $63,341.78 to $25,210.00.
•	During the Position Title analysis, our team noted that the ’Title’ metric, due to its inherently subjective nature across the industry from company to company, naturally carries less weight in regards to statistical analysis and drawing conclusions from such. As there are just shy of 200 different individual position titles (197) within the database, further normalization/grouping based on specifics of the title’s job description could prove to be useful for future analysis.

⁃	Average Salary & Salary Distribution vs. Company Size
•	Average salaries for each company size group were as follows: $157,615.81 for Medium sized companies with 50 to 250 employees, $146,031.15 for Large sized companies with more than 250 employees and $88,398.28 for Small sized companies with less than 50 employees.
•	A detailed histogram of salary distribution within each company size group is provided for further analysis.

⁃	Average Salary vs. Company Location
•	The top five countries in terms of average salary are as follows: Qatar ($300,000.00), Slovakia ($225,000.00), Venezuela ($192,500.00), Israel ($169,848.17) and Puerto Rico ($167,500.00).
•	The bottom five countries in terms of average salary are as follows: Ghana ($27,000.00), Thailand ($22,971.33), Honduras ($20,000.00), Moldova ($18,000.00) and Ecuador ($16,000.00).
•	It is of particular importance at this point during our analysis that we note a specific limitation within this dataset regarding a significant sample size discrepancy. Due to the current nature of the data, ~97% of all job entries (29,338 out of 30,151) included are attributed to a company location of United States, Great Britain, Canada, Spain or Germany. As such and although this is taken into consideration within the next two analysis segments, as the dataset continues to grow and contain more representative metrics for specific company locations, this average salary component vs company location will gain more meaning.

⁃	Number of Data Professionals vs. Company Location
•	As noted above due to sample size discrepancies, a total number of data professionals count was performed for each country contained within the company location column. The five most popular company locations within the dataset was The United States with 27,208 jobs, Great Britain with 991 jobs, Canada with 873 jobs, Spain with 137 jobs and Germany with 129 jobs. A subsequent count to determine the number of countries in the dataset that have less than 20 total data professionals revealed 63 of the 80 countries fall into this category. This confirms that the aggregate salary metrics for these countries must be interpreted with particular emphasis on the small sample size. Naturally as a country possesses more datapoints, the better the ability for analysis to glean significant/truly representative insights.
•	In order to represent this analysis graphically, Geoapifly API was utilized to return geocoordinates for each company location. An Hvplot visualization was then rendered on a global map tile with a colored dot overlay sized to indicate the number of data professionals within each company location country. 

⁃	Salary Distribution vs. Top 5 Company Locations for Number of Data Professionals
•	The dataset was filtered to only include job entries associated with the top 5 countries in terms of total number of data professionals and a subsequent interactive Seaborn plot was generated. This allows the respective salary distributions to be visualized within each distinct country.
•	Also contained within this analysis segment was a calculation and graphical representation of salary summary statistics for the top 5 countries for number of data professionals.
•	The United States has a mean salary of: $162,575.42, minimum salary of: $20,000 and a maximum salary of: $750,000
•	Canada has a mean salary of: $141,566.53, minimum salary of: $15,000.00 and a maximum salary of: $800,000.00
•	Germany has a mean salary of: $106,968.19, minimum salary of: $15,966.00 and a maximum salary of: $350,000.00
•	Great Britain has a mean salary of: $89,070.93, minimum salary of: $26,992.00 and a maximum salary of: $437,502.00
•	Spain has a mean salary of: $57,393.32 , minimum salary of: $21,593.00 and a maximum salary of: $253,750.00

⁃	Average Salary & Salary Distribution vs. Experience Level
•	Average salaries for each experience level group were as follows: $196,443.18 for Executive-level / Director, $170,665.32 for Senior-level / Expert, $139,159.15 for Mid-level / Intermediate and $102,768.91 for Entry-level / Junior.
•	A detailed histogram of salary distribution within each experience level group is provided for further analysis.

⁃	Average Salary & Salary Distribution vs Remote Ratio
•	Average salaries for each remote ratio group were as follows: $160,270.57 for 0% remote ratio (Fully On-Site), $148,237.01 for 100% remote ratio (Fully Remote) and $82,145.10 for 50% remote ratio (Hybrid).
•	A detailed histogram of salary distribution within each experience level group is provided for further analysis.

**JavaScript Dashboard Components**

Top 10 Popular Roles by Year
⁃	Description: This bar chart illustrates the top 10 job roles for a selected year based on their frequency in the dataset. It highlights which roles were most popular in any given year.
⁃	Functionality: You can use the dropdown menu to select a specific year. The chart will update to show how the popularity of different roles has evolved over time, allowing you to track trends and shifts in job market demands.
⁃	By analyzing these trends, we can identify shifts in job market demands and the rise of new roles. This helps in understanding how the job market evolves and what roles gain prominence over time.

Average Salary by Company Size and Experience Level
⁃	Description: This bar chart visualizes the average salary for various company sizes, segmented by experience level. It shows how salaries vary depending on the size of the company and the level of experience.
⁃	Functionality: Adjust the dropdown menu to filter data by year. This will update the chart to reflect changes in average salaries across different company sizes and experience levels, providing insights into how experience influences earnings within various company environments.
⁃	This information is valuable for understanding salary expectations based on company characteristics and professional experience.

Top 5 Preferred Roles for Entry-Level Candidates
⁃	Description: This bar chart displays the top 5 job roles based on frequency by entry-level candidates, including the average salary for each role. It reveals which positions are most popular among newcomers to the industry as well as the respective average salary for the role.
⁃	Functionality: The chart updates based on the selected year, offering a view of the most popular roles for entry-level professionals and the average compensation they can expect.
⁃	This visualization provides insights into what new professionals are targeting in their careers and what compensation they can expect as they start their professional journey.

Bubble Chart of Average Salaries for Job Titles by Specific Company Location
⁃	Description: This bubble chart visualizes average salaries across different job titles within specific company locations. The placement and color of each bubble represents the average salary for that title.
⁃	Functionality: Use the dropdown menu to select a company location to filter the data. Bubbles are sized uniformly for clarity, and job titles are displayed on the x-axis with average salaries on the y-axis. Hover over a bubble to view detailed information, including the job title & average salary.
⁃	By visualizing the size and average salary of job listings within specific company locations, this chart is particularly useful for professionals seeking the highest-paying roles within a chosen country.


### Interaction Instructions for Project Visualizations:

**Part 1 - JavaScript Dashboard**

⁃	Within the “Project 3 Javascript” directory of this repository is the four individual files required to generate the JavaScript Dashboard (“index.html”, “main.js”, “salaries.json”, “styles.css”). In order to run these files, please open a terminal window at the mentioned directory and run the following python server command: ‘python -m http.server 8000’. Subsequently, navigate to your Chrome browser and the address: ‘http://localhost:8000/', to generate the dashboard. The JavaScript Dashboard has two interactive components - The first of which is the year drop-down menu which filters all four visualizations by selected work year (2020 - 2024) while the second of which is  company location drop-drown menu that filters the fourth and final visualization reflecting the average salaries across individual job titles within different company locations.  

**Part 2 - Python Visuals**

⁃	Contained within the “Project 3 Python” directory of this repository is an executed Jupyter Notebook file titled “Project_3_AKKM.ipynb”. This file contains all executed Python code and can be opened for closer inspection and interactivity with a number of the salary distribution visualization. Please refer to the adjacent “Images” folder for .png and .html files representing all graphs - the .html files can be opened in a browser to allow interactivity as well.


### Limitations:

**Dataset Integrity**

⁃	As with any dataset, it is important to acknowledge take special consideration for the means by which the data was collected. As mentioned earlier, this salary dataset was sourced from ai-jobs.net and more specifically represents the combined entries from self-reported and publicly available means. Both self-reported and publicly available data collection will always have the potential for inaccurate/biased data entry due to a variety of variables.

**Sample Size Discrepancy**

⁃	Consistently noted throughout our analysis is the significant sample size discrepancy in regards to country specific data. The dataset utilized throughout this project contained 30,151 entries with more than 97% of those being attributed to only 5 countries (out of 80 countries represented). As such, special consideration  should be given when examining salary aggregates grouped by countries. For example, while Qatar does indeed have the highest average salary within the dataset, that aggregate is derived from the single job within the dataset belonging to Qatar that pays $300,000.00. As the database continues to grow/evolve over time and capture more country specific representative datapoints, the ability to glean impactful country specific insights will inevitably increase. In the future and with enough datapoints for each country, randomized sampling could be employed.
⁃	Overall, the world of data and the number of employment opportunities within the industry obviously far exceeds the 30,151 datapoints within the analyzed dataset. With more data and better representative data, more and better analysis is possible.

**Normalization**

⁃	One particular area that could benefit from normalization would be the position title category. As each individual company is going to have unique job titles that are completely different from the next, the title value inevitably looses some ability to extract meaningful insight. One potential idea would be to normalize job titles via a large-language-model that digests the textural data associated with each title’s description and subsequently sorts each entry into a predetermined title grouping for future analysis.

**Uncaptured Variables**

⁃	This initial dataset included the following metrics associated with each job entry: work_year, experience_level, experience_type, job_title, salary, salary_currency, salary_in_usd, employee_residence, remote_ratio, company_location & company_size. Naturally, there exists a plethora of other potential input variables associated with each job entry that could yield intriguing analysis. For example, employee age, education level, tenure in the data industry, etc. would be interesting to explore adding to the data capture process.


### Repository Structure:

- 'Project 3 Javascript' directory:
  - “index.html”: Webpage rendering of the Javascript dashboard leveraging both the .js ("main.js") and .css ("styles.css") code files
  - “main.js”: Primary javascript code file for the Javascript dashboard
  - “salaries.json”: JSON file of the salaries dataset utilized for the Javascript dashboard
  - “styles.css”: Cascading Style Sheet code for the Javascript dashboard

- 'Project 3 Python' directory:
  - 'Images' directory: Contains all Python generated visualizations as .png and .html files
  - 'Resources': Folder containing original "salaries.css", "salaries.json" and cleaned "salaries_cleaned.csv" files
  - “Project_3_AKKM.ipynb”: Executed Jupyter Notebook code file containing Python analysis & visualizations

- “Data Professionals Career Insights.pdf”: PDF file of opening slide deck for project presentation

