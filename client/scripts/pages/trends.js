import { SkillsAPI, getCurrentUserId } from "../api/fetch_api.js";

export async function initTrendsPage() {
  const trendsContainer = document.querySelector(".summary-data");
  if (!trendsContainer) return;

  try {
    const userId = getCurrentUserId();
    if (!userId) {
      trendsContainer.innerHTML = "<p>Please log in to view trends.</p>";
      return;
    }

    const stats = await SkillsAPI.getFrequencyStats(userId);
    
    if (!stats || stats.length === 0) {
      trendsContainer.innerHTML = "<p>No skill frequency data available yet.</p>";
      return;
    }

    // Create a summary section
    const html = `
      <h2>Skill Frequency Analytics</h2>
      <div class="trends-summary">
        ${stats.map(stat => `
          <div class="trend-item">
            <h3>${stat.skill}</h3>
            <p>Appears in <strong>${stat.count}</strong> application${stat.count !== 1 ? 's' : ''}</p>
            <div class="trend-bar">
              <div class="trend-fill" style="width: ${stat.percentage}%"></div>
            </div>
            <span class="trend-percentage">${stat.percentage.toFixed(1)}%</span>
          </div>
        `).join('')}
      </div>
    `;
    
    trendsContainer.innerHTML = html;
  } catch (err) {
    console.error("Failed to load trends:", err);
    trendsContainer.innerHTML = `<p>Error loading trends: ${err.message}</p>`;
  }
}
