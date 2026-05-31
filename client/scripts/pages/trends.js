import {
  ApplicationsAPI,
  ApplicationSkillsAPI,
  SkillsAPI,
  getCurrentUserId,
} from "../api/fetch_api.js";

export async function initTrendsPage() {
  const userId = getCurrentUserId();

  const trendListItems = document.querySelector(".summary-data ul");
  if (!trendListItems) return;

  try {
    const [applications, allSkills] = await Promise.all([
      ApplicationsAPI.list(userId),
      SkillsAPI.list(userId),
    ]);

    const totalApps = applications.length;

    if (totalApps === 0) {
      trendListItems.innerHTML = "<li>No applications yet.</li>";
      return;
    }

    const skillCounts = {};

    for (const app of applications) {
      const appSkills = await ApplicationSkillsAPI.listByApplication(
        app.app_id,
      );

      const seenInApp = new Set();

      for (const s of appSkills) {
        const name = s.skill?.skill_name || s.skill_name;
        if (!name) continue;

        if (!seenInApp.has(name)) {
          skillCounts[name] = (skillCounts[name] || 0) + 1;
          seenInApp.add(name);
        }
      }
    }

    const merged = allSkills.map((skill) => {
      const count = skillCounts[skill.skill_name] || 0;

      return {
        name: skill.skill_name,
        count,
        percent: ((count / totalApps) * 100).toFixed(0),
      };
    });

    merged.sort((a, b) => b.count - a.count);

    trendListItems.innerHTML = "";

    for (const skill of merged) {
      const li = document.createElement("li");

      if (skill.count === 0) {
        li.textContent = `${skill.name} is not used in any applications`;
      } else {
        li.textContent = `${skill.name} is noted in ${skill.percent}% of your applications`;
      }

      trendListItems.appendChild(li);
    }
  } catch (err) {
    console.error("Failed to load trends:", err);
    trendListItems.innerHTML = "<li>Failed to load trends.</li>";
  }
}
