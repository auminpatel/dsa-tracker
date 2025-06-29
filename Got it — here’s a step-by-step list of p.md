Got it — here’s a step-by-step list of prompts you can use to give to Claude (or any LLM) to refine your HTML tracker file section by section. These prompts are carefully structured and scoped so Claude can handle each update one at a time.

🧩 PROMPT SET — TRACKER IMPROVEMENT VIA CLAUDE
🛠️ 1. Add Notes Column to Each Problem Row
Prompt:

pgsql
Copy
Edit
Please update the problems table in each week section to add a new column at the end labeled "Notes".  
This column should contain a `<textarea>` or `<input type="text">` where I can manually enter notes for each problem.  
Make sure each input is styled minimally and has a unique data-problem ID so I can save it later using localStorage.
🛠️ 2. Add Difficulty Filter Dropdown at the Top
Prompt:

pgsql
Copy
Edit
Please add a dropdown filter at the top of the tracker to filter problems by difficulty — Easy, Medium, Hard.  
When a difficulty is selected, only problems of that difficulty should remain visible.  
Add a reset option to show all problems again.
🛠️ 3. Add Weekly Revision Checkboxes (2 Rounds)
Prompt:

vbnet
Copy
Edit
Add two additional revision checkboxes in each week's progress section under "Revision":  
- Revision Round 1  
- Revision Round 2  
Each checkbox should be unique per week, and changes should persist in localStorage.
🛠️ 4. Add Star Column for Favorite Problems
Prompt:

pgsql
Copy
Edit
Please add a star column in each problem row that allows me to mark a problem as a favorite using a ⭐ emoji or icon.  
Toggling the star should visually update the row and persist in localStorage.  
Also add a toggle button at the top to "Show Only Starred Problems".
🛠️ 5. Add Search by Pattern or Company
Prompt:

vbnet
Copy
Edit
Currently there's a general search input.  
Please enhance it so it also highlights and filters by patterns or company tags — e.g., "Sliding Window" or "Amazon" — across the table rows.  
Make matching cells stand out using background highlight.
🛠️ 6. Add a New Section: “Week 25: Mock Test Set 1”
Prompt:

pgsql
Copy
Edit
Please add a new section titled “Week 25: Mock Test Set 1” with the same structure as other weeks.  
Include 6 mixed-difficulty problems with patterns like DP, Graphs, Sliding Window.  
Use sample problems from LeetCode.  
This section is to simulate a real 90-minute interview test.
🛠️ 7. Add Export to CSV Functionality
Prompt:

diff
Copy
Edit
Add a new button at the top labeled “Export Progress to CSV”.  
When clicked, this should export a CSV file with the following columns:
- Week
- Problem Name
- Pattern
- Difficulty
- LeetCode URL
- Company Tags
- Status (checked/unchecked)
- Notes
- Starred (yes/no)
Make sure all rows across weeks are included in the export.
🛠️ 8. Add Optional Tags Column (Topic + Type)
Prompt:

pgsql
Copy
Edit
Please add a “Tags” column for each problem in the table.  
This should include topic-level tags like “Array”, “DFS”, “Greedy”, “Graph”, etc.  
Format each tag with a light gray pill-style UI and allow multiple per problem.
🛠️ 9. Add Mock Mode Toggle to Hide Notes/Extras
Prompt:

pgsql
Copy
Edit
Add a toggle at the top called "Mock Mode".  
When enabled, hide the Notes, Star, and Revision columns to simulate an exam-like view.  
Allow it to be turned off again to return to full tracker view.
🛠️ 10. Add “Last Updated” Timestamp for Each Problem
Prompt:

pgsql
Copy
Edit
Please add a way to store and display a "Last Updated" timestamp next to each checkbox or note input.  
This timestamp should update whenever a user checks/unchecks a box or edits the note.  
Use a light gray font for the timestamp below each status checkbox or note field.
✨ Usage Tip:
Share one of these prompts at a time with Claude. Once that section is updated and working, move to the next prompt.

Would you like me to combine these into a full HTML template with improvements, or generate a Notion version after applying these?